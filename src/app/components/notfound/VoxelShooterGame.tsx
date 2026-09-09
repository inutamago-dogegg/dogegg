// 404ページ: ボクセルシューティングの React コンポーネント本体(HUD含む)。
// ゲームロジックは engine.ts、描画は render.ts、配置は layout.ts、フォントは font.ts が担当する。
// このファイルは Canvas のマウント/ループ/入力と、DOM オーバーレイの HUD・クリア画面のみを扱う。

import { useEffect, useRef, useState } from 'react';
import doggIconAsset from '@/images/dogegg_icon.png';
import { createGameState, fireShot, setPointer, stepGame, updateViewport } from './engine';
import { createBackground, drawFrame } from './render';
import type { RenderResources } from './render';
import { BEST_TIME_STORAGE_KEY, BUFF_STYLES, GAME_CONFIG, PALETTE } from './config';
import type { BuffKind, GamePhase, GameState, SpinBuffState, WeaponBuffState } from './types';

/** HUD 表示用に間引いて同期する状態(毎フレームの setState を避けるため)。 */
type HudState = {
  phase: GamePhase;
  elapsed: number;
  remaining: number;
  total: number;
  weaponBuff: WeaponBuffState | null;
  spinBuff: SpinBuffState | null;
};

const INITIAL_HUD: HudState = {
  phase: 'ready',
  elapsed: 0,
  remaining: 0,
  total: 0,
  weaponBuff: null,
  spinBuff: null,
};

/** クリア結果(クリアタイムとベスト更新判定)。 */
type ClearResult = {
  time: number;
  isNewBest: boolean;
};

/** HUD の同期間隔(ミリ秒)。毎フレーム setState しないための間引き。 */
const HUD_SYNC_INTERVAL_MS = 100;
/** リサイズのデバウンス間隔(ミリ秒)。 */
const RESIZE_DEBOUNCE_MS = 150;
/** このサイズ変化率(幅または高さ)を超えたらゲームを作り直す。 */
const RESET_SIZE_RATIO = 0.15;

/** 秒数を mm:ss.cc 形式にフォーマットする。 */
function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = Math.floor(clamped % 60);
  const centiseconds = Math.floor((clamped * 100) % 100);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

/** localStorage からベストタイムを読む。使用不可環境でも例外を投げない。 */
function readBestTime(): number | null {
  try {
    const raw = localStorage.getItem(BEST_TIME_STORAGE_KEY);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/** localStorage にベストタイムを書く。使用不可環境でも例外を投げない。 */
function writeBestTime(value: number): void {
  try {
    localStorage.setItem(BEST_TIME_STORAGE_KEY, String(value));
  } catch {
    // プライベートモード等で localStorage が使えない場合は諦める。
  }
}

type BuffBarProps = {
  kind: BuffKind;
  remaining: number;
  duration: number;
};

/** バフ1件分の残り時間ゲージ。 */
function BuffBar({ kind, remaining, duration }: BuffBarProps) {
  const style = BUFF_STYLES[kind];
  const ratio = duration > 0 ? Math.max(0, Math.min(1, remaining / duration)) : 0;
  return (
    <div className="flex items-center gap-2 text-[10px] sm:text-xs">
      <span className="w-24 shrink-0 truncate font-bold" style={{ color: style.color }}>
        {style.label}
      </span>
      <div
        className="h-1.5 flex-1"
        style={{ background: 'rgba(0,0,0,0.45)', border: `1px solid ${style.color}` }}
      >
        <div
          className="h-full"
          style={{ width: `${ratio * 100}%`, background: style.color, transition: 'width 0.1s linear' }}
        />
      </div>
    </div>
  );
}

export default function VoxelShooterGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const gameRef = useRef<GameState | null>(null);
  const resourcesRef = useRef<RenderResources>({ doggIcon: null, background: null });
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const firingRef = useRef<boolean>(false);
  const lastHudSyncRef = useRef<number>(0);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const dprRef = useRef<number>(1);
  const prevPhaseRef = useRef<GamePhase>('ready');
  const clearedAtRef = useRef<{ atMs: number; finalElapsed: number } | null>(null);
  const clearResultShownRef = useRef<boolean>(false);

  const [hud, setHud] = useState<HudState>(INITIAL_HUD);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [clearResult, setClearResult] = useState<ClearResult | null>(null);
  const [pageUrl, setPageUrl] = useState<string>('');
  /** 一度でもポインタ位置を取得したか(取得後はレティクル描画に任せてOSカーソルを隠す)。 */
  const [hasPointer, setHasPointer] = useState<boolean>(false);

  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  // ベストタイムの初回読み込み(クライアントのみ)。
  useEffect(() => {
    setBestTime(readBestTime());
  }, []);

  // シェア用のページ絶対URLを算出(location.href は404の非実在パスなので使わない)。
  useEffect(() => {
    setPageUrl(`${window.location.origin}${baseUrl}`);
  }, [baseUrl]);

  // どぐえぐアイコンの読み込み。未ロードでもゲームは動く。
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      resourcesRef.current.doggIcon = img;
    };
    img.src = doggIconAsset.src;
    return () => {
      img.onload = null;
    };
  }, []);

  // キャンバス初期化・リサイズ監視・アニメーションループ本体。
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const applySize = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      const prev = sizeRef.current;
      const isFirst = prev.width === 0 && prev.height === 0;
      const widthRatio = prev.width > 0 ? Math.abs(width - prev.width) / prev.width : 1;
      const heightRatio = prev.height > 0 ? Math.abs(height - prev.height) / prev.height : 1;

      sizeRef.current = { width, height };
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dprRef.current);
      canvas.height = Math.round(height * dprRef.current);
      resourcesRef.current.background = createBackground(width, height);

      if (isFirst || widthRatio > RESET_SIZE_RATIO || heightRatio > RESET_SIZE_RATIO) {
        gameRef.current = createGameState(width, height);
        prevPhaseRef.current = 'ready';
        clearedAtRef.current = null;
        clearResultShownRef.current = false;
        setClearResult(null);
      } else if (gameRef.current) {
        updateViewport(gameRef.current, width, height);
      }
    };

    // 初期化(ページ全体を覆う前提でビューポートサイズを使う)。
    applySize(window.innerWidth, window.innerHeight);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => applySize(width, height), RESIZE_DEBOUNCE_MS);
    });
    observer.observe(container);

    const loop = (timeMs: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const state = gameRef.current;
      const ctx = canvas.getContext('2d');
      if (!state || !ctx) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timeMs;
      }
      let dt = (timeMs - lastTimeRef.current) / 1000;
      lastTimeRef.current = timeMs;
      if (!Number.isFinite(dt) || dt < 0) dt = 0;
      if (dt > 0.05) dt = 0.05;

      if (firingRef.current) {
        fireShot(state);
      }

      stepGame(state, dt);

      // phase の変化を検知してクリア演出のタイマーを起動する。
      if (state.phase === 'cleared' && prevPhaseRef.current !== 'cleared') {
        clearedAtRef.current = { atMs: timeMs, finalElapsed: state.elapsed };
      }
      prevPhaseRef.current = state.phase;

      if (clearedAtRef.current && !clearResultShownRef.current) {
        const sinceClearSec = (timeMs - clearedAtRef.current.atMs) / 1000;
        if (sinceClearSec >= GAME_CONFIG.clearDelay) {
          clearResultShownRef.current = true;
          const finalTime = clearedAtRef.current.finalElapsed;
          const prevBest = readBestTime();
          const isNewBest = prevBest === null || finalTime < prevBest;
          if (isNewBest) writeBestTime(finalTime);
          setBestTime(isNewBest ? finalTime : prevBest);
          setClearResult({ time: finalTime, isNewBest });
        }
      }

      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(ctx, state, resourcesRef.current, timeMs);

      if (timeMs - lastHudSyncRef.current >= HUD_SYNC_INTERVAL_MS) {
        lastHudSyncRef.current = timeMs;
        setHud({
          phase: state.phase,
          elapsed: state.elapsed,
          remaining: state.field.remaining,
          total: state.field.total,
          weaponBuff: state.weaponBuff,
          spinBuff: state.spinBuff,
        });
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, []);

  // タブ復帰時に dt が暴発しないよう最終フレーム時刻をリセットする。
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTimeRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // キーボード操作(Space/Enter)。HUDのボタン操作と二重発火しないようフォーカス先を確認する。
  useEffect(() => {
    const isInteractiveTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      return target.tagName === 'BUTTON' || target.tagName === 'A' || target.isContentEditable;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.code !== 'Enter') return;
      if (isInteractiveTarget(event.target)) return;
      event.preventDefault();
      firingRef.current = true;
      const state = gameRef.current;
      if (state) fireShot(state);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.code !== 'Enter') return;
      firingRef.current = false;
    };
    const onBlur = () => {
      firingRef.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // ポインタ座標をキャンバス左上基準のCSSピクセルに変換して engine に反映する。
  const applyPointerFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const state = gameRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    setPointer(state, event.clientX - rect.left, event.clientY - rect.top);
    // 照準レティクルが出るまではOSカーソルを隠さない(狙点が一切見えない状態を避ける)。
    if (!hasPointer) setHasPointer(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    applyPointerFromEvent(event);
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    applyPointerFromEvent(event);
    firingRef.current = true;
    const state = gameRef.current;
    if (state) fireShot(state);
  };
  const stopFiring = () => {
    firingRef.current = false;
  };

  const handleRestart = () => {
    const { width, height } = sizeRef.current;
    if (width <= 0 || height <= 0) return;
    gameRef.current = createGameState(width, height);
    prevPhaseRef.current = 'ready';
    clearedAtRef.current = null;
    clearResultShownRef.current = false;
    firingRef.current = false;
    lastHudSyncRef.current = 0;
    setHud(INITIAL_HUD);
    setClearResult(null);
  };

  const progressRatio = hud.total > 0 ? (hud.total - hud.remaining) / hud.total : 0;

  const shareText = clearResult
    ? `どぐえぐのサイトの404ページを ${clearResult.time.toFixed(2)}秒 でクリアした！`
    : '';
  const shareHref =
    clearResult && pageUrl
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}&via=dogegg314`
      : '#';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: PALETTE.bgDeep }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none ${hasPointer ? 'cursor-none' : 'cursor-crosshair'}`}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={stopFiring}
        onPointerCancel={stopFiring}
        onPointerLeave={stopFiring}
        onContextMenu={(event) => event.preventDefault()}
      />

      {/* HUD オーバーレイ。クリックはキャンバスへ貫通させ、ボタン類のみ操作可にする。 */}
      <div
        className="pointer-events-none fixed inset-0 z-10 font-mono"
        style={{ color: PALETTE.uiText }}
      >
        <div className="absolute top-0 left-0 right-0 flex flex-col gap-2 p-3 sm:p-4">
          <div
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 text-xs sm:text-sm"
            style={{ background: PALETTE.uiPanel, border: `2px solid ${PALETTE.uiBorder}` }}
          >
            <span>
              TIME <strong style={{ color: PALETTE.uiAccent }}>{formatTime(hud.elapsed)}</strong>
            </span>
            <span>
              残り <strong style={{ color: PALETTE.uiAccent }}>{hud.remaining}</strong> / {hud.total}
            </span>
            <span style={{ color: PALETTE.uiMuted }}>
              BEST {bestTime !== null ? formatTime(bestTime) : '--:--.--'}
            </span>
          </div>

          <div
            className="h-2 w-full"
            style={{ background: PALETTE.uiPanel, border: `1px solid ${PALETTE.uiBorder}` }}
          >
            <div
              className="h-full"
              style={{
                width: `${progressRatio * 100}%`,
                background: PALETTE.uiAccent,
                transition: 'width 0.2s linear',
              }}
            />
          </div>

          {(hud.weaponBuff || hud.spinBuff) && (
            <div
              className="flex flex-col gap-1 px-3 py-2"
              style={{ background: PALETTE.uiPanel, border: `2px solid ${PALETTE.uiBorder}` }}
            >
              {hud.weaponBuff && (
                <BuffBar
                  kind={hud.weaponBuff.kind}
                  remaining={hud.weaponBuff.remaining}
                  duration={hud.weaponBuff.duration}
                />
              )}
              {hud.spinBuff && (
                <BuffBar kind="spin" remaining={hud.spinBuff.remaining} duration={hud.spinBuff.duration} />
              )}
            </div>
          )}
        </div>

        {/* 中央には文字ボクセルがあるため、案内は画面下部に固定して重ならないようにする。 */}
        {hud.phase === 'ready' && (
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-pulse px-4 py-2 text-center text-xs sm:bottom-20 sm:text-sm"
            style={{ background: PALETTE.uiPanel, border: `2px solid ${PALETTE.uiBorder}` }}
          >
            マウスで狙って クリック長押しで発射
          </div>
        )}

        <a
          href={baseUrl}
          className="pointer-events-auto absolute bottom-3 right-3 cursor-pointer border-2 px-3 py-2 text-xs sm:bottom-4 sm:right-4 sm:text-sm"
          style={{ background: PALETTE.uiPanel, borderColor: PALETTE.uiBorder, color: PALETTE.uiText }}
        >
          ← ホームに戻る
        </a>
      </div>

      {clearResult && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center p-4 font-mono"
          style={{ background: 'rgba(8, 5, 3, 0.85)' }}
        >
          <div
            className="flex w-full max-w-sm flex-col items-center gap-4 px-6 py-8 text-center"
            style={{ background: PALETTE.uiPanel, border: `3px solid ${PALETTE.uiBorder}`, color: PALETTE.uiText }}
          >
            <h1 className="text-3xl tracking-widest" style={{ color: PALETTE.uiAccent }}>
              CLEAR!
            </h1>
            <p className="text-4xl font-bold">{formatTime(clearResult.time)}</p>

            <div className="flex flex-col items-center gap-1 text-sm" style={{ color: PALETTE.uiMuted }}>
              <span>BEST {bestTime !== null ? formatTime(bestTime) : '--:--.--'}</span>
              {clearResult.isNewBest && (
                <span
                  className="px-2 py-1 text-xs font-bold"
                  style={{ background: PALETTE.uiAccent, color: PALETTE.bgDeep }}
                >
                  NEW BEST!
                </span>
              )}
            </div>

            <div className="mt-2 flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="pointer-events-auto w-full cursor-pointer border-2 px-4 py-2 text-sm sm:text-base"
                style={{ background: PALETTE.uiAccent, borderColor: PALETTE.uiBorder, color: PALETTE.bgDeep }}
              >
                もう一度
              </button>
              <a
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  if (shareHref === '#') event.preventDefault();
                }}
                className="pointer-events-auto w-full cursor-pointer border-2 px-4 py-2 text-sm sm:text-base"
                style={{ background: '#1d9bf0', borderColor: PALETTE.uiBorder, color: '#ffffff' }}
              >
                Xに投稿
              </a>
              <a
                href={baseUrl}
                className="pointer-events-auto mt-1 cursor-pointer text-xs underline sm:text-sm"
                style={{ color: PALETTE.uiMuted }}
              >
                ← TOPへ戻る
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
