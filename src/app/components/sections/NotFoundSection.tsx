import { useEffect, useMemo, useRef, useState } from 'react';
import ShaderCanvas from '@/app/components/ShaderCanvas';
import vertSource from '@/shaders/table-felt.vert?raw';
import fragSource from '@/shaders/table-felt.frag?raw';

// ── 型 ──────────────────────────────────────────────────────────────────────

type RoleInfo = {
  name: string;
  multiplier: number;
  isWin: boolean;
  isPinzoro: boolean;
  color: string;
};

type HistoryEntry = { win: boolean; delta: number; role: string };

type NotFoundSectionProps = {
  diceBase: string;
  showDebugPinzoro?: boolean;
};

// ── ゲームロジック ────────────────────────────────────────────────────────────

const clamp = (v: number, max: number) => Math.min(Math.max(v, 1), max);
const d6 = () => Math.floor(Math.random() * 6) + 1;

function evalRole(vals: number[]): RoleInfo | null {
  const s = [...vals].sort();
  const triple = vals.every((v) => v === vals[0]);
  if (triple) {
    if (vals[0] === 1) return { name: 'ピンゾロ',    multiplier:  5, isWin: true,  isPinzoro: true,  color: '#f8d030' };
    if (vals[0] === 6) return { name: 'アラシ',      multiplier:  3, isWin: true,  isPinzoro: false, color: '#c084fc' };
    return              { name: `${vals[0]}ゾロ`,    multiplier:  2, isWin: true,  isPinzoro: false, color: '#30d830' };
  }
  if (s.join() === '1,2,3') return { name: 'ヒフミ', multiplier: -2, isWin: false, isPinzoro: false, color: '#d82828' };
  if (s.join() === '4,5,6') return { name: 'シゴロ', multiplier:  2, isWin: true,  isPinzoro: false, color: '#38c8f8' };
  const counts = vals.reduce<Record<number, number>>((a, v) => ({ ...a, [v]: (a[v] ?? 0) + 1 }), {});
  const pairKey = Object.keys(counts).find((k) => counts[+k] === 2);
  if (pairKey) {
    const eye = vals.find((v) => v !== +pairKey) ?? +pairKey;
    const win = eye >= 4;
    return { name: `${eye}の目`, multiplier: win ? 1 : -1, isWin: win, isPinzoro: false, color: win ? '#30d830' : '#d87830' };
  }
  return null;
}

function doRoll(): { vals: [number, number, number]; role: RoleInfo } {
  let role: RoleInfo | null = null;
  let vals: [number, number, number] = [1, 1, 1];
  for (let g = 0; !role && g < 12; g++) { vals = [d6(), d6(), d6()]; role = evalRole(vals); }
  return { vals, role: role ?? { name: '役なし', multiplier: -1, isWin: false, isPinzoro: false, color: '#687868' } };
}

// チップ HP バー (ブロック文字)
function chipBar(chips: number): string {
  const N = 10;
  const filled = Math.min(N, Math.round(chips / 100 * N));
  if (chips > 100) return '▓'.repeat(N);
  return '█'.repeat(filled) + '░'.repeat(N - filled);
}

// ── 役表 ─────────────────────────────────────────────────────────────────────

const RULES = [
  { name: 'ピンゾロ',        dice: '1・1・1',      mult: '+5', win: true,  sp: true  },
  { name: 'アラシ',          dice: '6・6・6',      mult: '+3', win: true,  sp: false },
  { name: 'シゴロ',          dice: '4・5・6',      mult: '+2', win: true,  sp: false },
  { name: 'ゾロ目(2〜5)',    dice: 'NNNゾロ',      mult: '+2', win: true,  sp: false },
  { name: '目役(4〜6)',      dice: '2枚揃+4/5/6',  mult: '+1', win: true,  sp: false },
  { name: '目役(1〜3)',      dice: '2枚揃+1/2/3',  mult: '-1', win: false, sp: false },
  { name: 'ヒフミ',          dice: '1・2・3',      mult: '-2', win: false, sp: false },
];

// ── NES 風 カラーパレット ─────────────────────────────────────────────────────
const P = {
  bg:      '#0a1a0d',
  panel:   '#142418',
  border:  '#3a8a45',
  borderHi:'#5ab860',
  text:    '#b8e8b8',
  muted:   '#306830',
  yellow:  '#f8d030',
  win:     '#30d830',
  lose:    '#d82828',
  dark:    '#000000',
};

// ── CSS: RPG窓枠を返す ────────────────────────────────────────────────────────
const rpgBox = (accent?: string): React.CSSProperties => ({
  background:  P.panel,
  border:      `3px solid ${accent ?? P.borderHi}`,
  boxShadow:   `0 0 0 2px ${P.bg}, 4px 4px 0 ${P.dark}`,
  imageRendering: 'pixelated',
});

// ── コンポーネント ────────────────────────────────────────────────────────────

export default function NotFoundSection({ diceBase, showDebugPinzoro = false }: NotFoundSectionProps) {
  const [display, setDisplay]     = useState<[number, number, number]>([1, 1, 1]);
  const [chips,   setChips]       = useState(100);
  const [bet,     setBet]         = useState(10);
  const [role,    setRole]        = useState<RoleInfo | null>(null);
  const [delta,   setDelta]       = useState<number | null>(null);
  const [rolling, setRolling]     = useState(false);
  const [stampKey, setStampKey]   = useState(0);
  const [history, setHistory]     = useState<HistoryEntry[]>([]);
  const [showRules, setShowRules] = useState(false);

  const initRef    = useRef(false);
  const ivRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxBet = useMemo(() => Math.max(1, chips), [chips]);
  const isLow  = chips > 0 && chips <= 20;

  const applyResult = (
    vals: [number, number, number],
    ri: RoleInfo,
    prevChips: number,
    betAmt: number,
    maxB: number,
  ) => {
    const safe = clamp(betAmt, maxB);
    const diff = safe * ri.multiplier;
    setDisplay(vals);
    setRole(ri);
    setDelta(diff);
    setChips(Math.max(0, prevChips + diff));
    setStampKey((k) => k + 1);
    setHistory((h) => [{ win: ri.isWin, delta: diff, role: ri.name }, ...h].slice(0, 8));
  };

  const startAnim = () => {
    setRolling(true); setRole(null); setDelta(null);
    ivRef.current = setInterval(() => setDisplay([d6(), d6(), d6()]), 70);
  };
  const stopAnim = () => {
    if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; }
    setRolling(false);
  };

  const handleRoll = () => {
    if (chips < 1 || rolling) return;
    const snap = { chips, bet, maxBet };
    startAnim();
    setTimeout(() => {
      const { vals, role: ri } = doRoll();
      stopAnim();
      applyResult(vals, ri, snap.chips, snap.bet, snap.maxBet);
    }, 850);
  };

  const handleForcePinzoro = () => {
    if (rolling) return;
    const snap = { chips, bet, maxBet };
    startAnim();
    setTimeout(() => {
      const ri: RoleInfo = { name: 'ピンゾロ', multiplier: 5, isWin: true, isPinzoro: true, color: '#f8d030' };
      stopAnim();
      applyResult([1, 1, 1], ri, snap.chips, snap.bet, snap.maxBet);
    }, 850);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const { vals, role: ri } = doRoll();
    applyResult(vals, ri, 100, 10, 100);
  }, []);

  useEffect(() => { setBet((b) => clamp(b, maxBet)); }, [maxBet]);
  useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current); }, []);

  const isGameOver = chips < 1 && !rolling;
  const betStr     = String(bet).padStart(3, '0');
  const chipsStr   = String(chips).padStart(3, '0');
  const bar        = chipBar(chips);

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden"
      style={{ background: P.bg, fontFamily: "'Press Start 2P', 'Courier New', monospace" }}
    >
      {/* ── アニメーション + フォント ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        /* スタンプ: ステップ関数で離散的に出現 */
        @keyframes stamp {
          0%   { opacity:0; transform:scale(2.2) rotate(-4deg); }
          33%  { opacity:1; transform:scale(1.1) rotate(1deg); }
          66%  { transform:scale(0.96) rotate(-0.5deg); }
          100% { transform:scale(1) rotate(0deg); }
        }
        .stamp-in { animation: stamp 0.24s steps(3, end) forwards; }

        /* ピンゾロ */
        @keyframes prainbow {
          0%,100% { background-position:0% 50%; }
          50%     { background-position:100% 50%; }
        }
        @keyframes pbounce {
          0%,100% { transform:scaleY(1); }
          50%     { transform:scaleY(1.1); }
        }
        .pinzoro-text {
          animation: pbounce 0.6s steps(2, end) infinite,
                     prainbow 1.6s linear infinite;
          background: linear-gradient(90deg,#ff0080,#ff8c00,#f8e71c,#7ed321,#50e3c2,#4a90e2,#9013fe,#ff0080);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* サイコロシェイク: ステップで跳ねる */
        @keyframes shake {
          0%   { transform:rotate(0deg)   translate(0,0); }
          25%  { transform:rotate(-20deg) translate(-3px,-6px); }
          50%  { transform:rotate(20deg)  translate(3px,-10px); }
          75%  { transform:rotate(-12deg) translate(-1px,-4px); }
          100% { transform:rotate(0deg)   translate(0,0); }
        }
        .dice-shake { animation: shake 0.16s steps(4, end) infinite; }

        /* HP バー点滅 (チップ少ないとき) */
        @keyframes blink { 50%{ opacity:0; } }
        .hp-blink { animation: blink 0.5s steps(1, end) infinite; }

        /* カーソル点滅 */
        @keyframes cursor { 50%{ opacity:0; } }
        .cursor { animation: cursor 0.8s steps(1, end) infinite; }

        /* ボタン押し下げ */
        .btn-px:hover  { transform:translate(2px,2px); box-shadow:2px 2px 0 #000 !important; }
        .btn-px:active { transform:translate(4px,4px); box-shadow:none !important; }

        /* ピクセルグリッドオーバーレイ */
        .pixel-grid {
          background-image:
            repeating-linear-gradient(0deg,  transparent, transparent 3px, rgba(0,8,0,0.12) 3px, rgba(0,8,0,0.12) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,8,0,0.12) 3px, rgba(0,8,0,0.12) 4px);
        }

        /* ダイサーパターン背景 (ヘッダーなど) */
        .dither-bg {
          background-color: #0d2010;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='2' height='2' fill='%230a1a0d'/%3E%3Crect x='2' y='2' width='2' height='2' fill='%230a1a0d'/%3E%3C/svg%3E");
          background-size: 4px 4px;
        }

        input[type=range] { accent-color: #f8d030; }
        input[type=number]:focus { outline: 2px solid #3a8a45; }
      `}</style>

      {/* ── シェーダー背景 ── */}
      <ShaderCanvas
        vertSource={vertSource}
        fragSource={fragSource}
        className="fixed inset-0 w-full h-full pixel-grid"
        style={{ zIndex: 0 }}
      />
      {/* ── ピクセルグリッドオーバーレイ (全体) ── */}
      <div className="pixel-grid fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* ── コンテンツ ── */}
      <div className="relative flex flex-col items-center w-full max-w-xs gap-1" style={{ zIndex: 2, fontSize: '0.6rem' }}>

        {/* ── タイトルバー ── */}
        <div
          className="w-full dither-bg flex items-center justify-between px-3 py-1.5"
          style={{ border: `3px solid ${P.borderHi}`, boxShadow: `0 0 0 2px ${P.bg}, 4px 4px 0 ${P.dark}` }}
        >
          <span style={{ color: P.muted }}>404</span>
          <span style={{ color: P.text }}>CHINCHIRO</span>
          <span style={{ color: P.muted }}>v1.0</span>
        </div>

        {/* ── HPバー + チップカウンター ── */}
        <div
          className="w-full px-3 py-2"
          style={rpgBox()}
        >
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: P.muted }}>CHIP</span>
            <span
              className={isLow ? 'hp-blink' : ''}
              style={{ color: isLow ? P.lose : P.win, letterSpacing: '0.05em' }}
            >
              {bar}
            </span>
            <span style={{ color: P.yellow, letterSpacing: '0.1em' }}>{chipsStr}</span>
          </div>
          {/* 勝敗履歴: ライフカウンター風 */}
          <div className="flex items-center gap-1">
            <span style={{ color: P.muted }}>REC</span>
            <span style={{ color: P.muted }}>:</span>
            {Array.from({ length: 8 }).map((_, i) => {
              const e = history[i];
              return (
                <span
                  key={i}
                  title={e ? `${e.role} (${e.delta >= 0 ? '+' : ''}${e.delta})` : ''}
                  style={{
                    display: 'inline-block',
                    width: 8, height: 8,
                    background: e ? (e.win ? P.win : P.lose) : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${e ? (e.win ? '#1a8a1a' : '#8a1a1a') : P.muted}`,
                    imageRendering: 'pixelated',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ── サイコロエリア ── */}
        <div
          className="w-full flex items-center justify-center gap-4 py-5 relative"
          style={{
            ...rpgBox(),
            background: '#070f08',
          }}
        >
          {/* ピクセルグリッドオーバーレイ (サイコロ上) */}
          <div className="pixel-grid absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />
          {display.map((val, i) => (
            <div
              key={i}
              className={rolling ? 'dice-shake' : ''}
              style={{ animationDelay: `${i * 0.06}s`, position: 'relative', zIndex: 1 }}
            >
              <img
                src={`${diceBase}dice-${val}.svg`}
                alt={`Dice ${val}`}
                style={{
                  width: 64, height: 64,
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(3px 3px 0 #000)',
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ── 役・結果表示ウィンドウ ── */}
        <div
          className="w-full px-3 py-3 min-h-[72px] flex flex-col items-start justify-center"
          style={rpgBox()}
        >
          {rolling ? (
            <div className="flex items-center gap-2" style={{ color: P.muted }}>
              <span className="cursor">▌</span>
              <span>ROLLING...</span>
            </div>
          ) : role ? (
            <div key={stampKey} className="stamp-in w-full">
              {/* 役名行 */}
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: P.muted }}>►</span>
                <span
                  className={role.isPinzoro ? 'pinzoro-text' : ''}
                  style={!role.isPinzoro ? { color: role.color } : undefined}
                >
                  {role.name}
                </span>
                <span style={{ color: P.muted, marginLeft: 'auto' }}>
                  {role.multiplier > 0 ? `×${role.multiplier}` : `×${role.multiplier}`}
                </span>
              </div>
              {/* 結果行 */}
              {delta !== null && (
                <div className="flex items-center gap-3">
                  <span style={{ color: role.isWin ? P.win : P.lose }}>
                    {role.isWin ? '▲ WIN' : '▼ LOSE'}
                  </span>
                  <span style={{ color: delta >= 0 ? P.yellow : P.lose, letterSpacing: '0.1em' }}>
                    {delta >= 0 ? `+${String(delta).padStart(3, '0')}` : `-${String(Math.abs(delta)).padStart(3, '0')}`}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span style={{ color: P.muted }}>---</span>
          )}
        </div>

        {/* ── ゲームオーバー ── */}
        {isGameOver ? (
          <div
            className="w-full px-3 py-3 flex flex-col items-center gap-3"
            style={rpgBox(P.lose)}
          >
            <div style={{ color: P.lose }}>--- CHIP OUT ---</div>
            <button
              type="button"
              onClick={() => { setChips(100); setBet(10); setHistory([]); setRole(null); setDelta(null); }}
              className="btn-px px-4 py-2 w-full"
              style={{
                background: P.yellow,
                color: '#0a1a0d',
                border: `3px solid #c9a030`,
                boxShadow: `4px 4px 0 ${P.dark}`,
                transition: 'transform 0.05s, box-shadow 0.05s',
                letterSpacing: '0.1em',
              }}
            >
              RETRY
            </button>
          </div>
        ) : (
          <div
            className="w-full px-3 py-3 flex flex-col gap-2.5"
            style={rpgBox()}
          >
            {/* BET行 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span style={{ color: P.muted }}>BET</span>
              <span style={{ color: P.yellow, letterSpacing: '0.1em', minWidth: '2.5em' }}>{betStr}</span>
              <div className="flex gap-1 ml-auto">
                {[10, 25, 50].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setBet(Math.min(v, maxBet))}
                    disabled={v > chips}
                    className="btn-px px-1.5 py-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: bet === Math.min(v, maxBet) && v <= chips ? P.yellow : P.panel,
                      color:      bet === Math.min(v, maxBet) && v <= chips ? '#0a1a0d' : P.text,
                      border:     `2px solid ${P.border}`,
                      boxShadow:  `2px 2px 0 ${P.dark}`,
                      transition: 'transform 0.05s, box-shadow 0.05s',
                    }}
                  >
                    {v}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBet(maxBet)}
                  className="btn-px px-1.5 py-0.5"
                  style={{
                    background: bet === maxBet ? P.lose : P.panel,
                    color:      bet === maxBet ? '#fff' : '#d87870',
                    border:     `2px solid #8a2828`,
                    boxShadow:  `2px 2px 0 ${P.dark}`,
                    transition: 'transform 0.05s, box-shadow 0.05s',
                  }}
                >
                  ALL
                </button>
              </div>
            </div>

            {/* スライダー行 */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setBet((b) => clamp(b - 5, maxBet))}
                className="btn-px w-6 h-6 flex items-center justify-center"
                style={{
                  background: P.panel, color: P.text,
                  border: `2px solid ${P.border}`, boxShadow: `2px 2px 0 ${P.dark}`,
                  transition: 'transform 0.05s, box-shadow 0.05s',
                }}
              >−</button>
              <input
                type="range" min={1} max={maxBet} value={bet}
                onChange={(e) => setBet(clamp(+e.target.value, maxBet))}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setBet((b) => clamp(b + 5, maxBet))}
                className="btn-px w-6 h-6 flex items-center justify-center"
                style={{
                  background: P.panel, color: P.text,
                  border: `2px solid ${P.border}`, boxShadow: `2px 2px 0 ${P.dark}`,
                  transition: 'transform 0.05s, box-shadow 0.05s',
                }}
              >＋</button>
              <input
                type="number" min={1} max={maxBet} value={bet}
                onChange={(e) => setBet(clamp(+e.target.value, maxBet))}
                style={{
                  width: 44, textAlign: 'center',
                  background: '#070f08', color: P.yellow,
                  border: `2px solid ${P.border}`,
                  boxShadow: `inset 1px 1px 0 rgba(0,0,0,0.6)`,
                  padding: '2px 4px',
                  fontFamily: 'inherit', fontSize: 'inherit',
                }}
              />
            </div>

            {/* ROLL ボタン */}
            <button
              id="roll-button"
              type="button"
              onClick={handleRoll}
              disabled={chips < 1 || rolling}
              className="btn-px w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:  rolling ? P.panel : P.yellow,
                color:       rolling ? P.text : '#0a1a0d',
                border:      `3px solid ${rolling ? P.border : '#c9a030'}`,
                boxShadow:   rolling ? `2px 2px 0 ${P.dark}` : `4px 4px 0 ${P.dark}`,
                transition:  'transform 0.05s, box-shadow 0.05s',
                letterSpacing: '0.15em',
              }}
            >
              {rolling ? '▌ ROLLING ▐' : '▶▶  ROLL  ◀◀'}
            </button>

            {/* デバッグ */}
            {showDebugPinzoro && (
              <button
                id="pinzoro-button"
                type="button"
                onClick={handleForcePinzoro}
                style={{ color: P.muted, fontSize: '0.5rem', letterSpacing: '0.1em' }}
              >
                [DEBUG:PINZORO]
              </button>
            )}
          </div>
        )}

        {/* ── 役表 ── */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setShowRules((r) => !r)}
            className="w-full py-1.5 text-center"
            style={{ color: P.muted, letterSpacing: '0.1em' }}
          >
            {showRules ? '[ CLOSE TABLE ]' : '[ ROLE TABLE ]'}
          </button>
          {showRules && (
            <div style={{ ...rpgBox(), overflow: 'hidden' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="dither-bg">
                    <th className="px-2 py-1.5 text-left" style={{ color: P.muted, borderBottom: `2px solid ${P.border}` }}>ROLE</th>
                    <th className="px-2 py-1.5 text-left" style={{ color: P.muted, borderBottom: `2px solid ${P.border}` }}>DICE</th>
                    <th className="px-2 py-1.5 text-right" style={{ color: P.muted, borderBottom: `2px solid ${P.border}` }}>×</th>
                  </tr>
                </thead>
                <tbody>
                  {RULES.map((r, i) => (
                    <tr key={r.name} style={{ borderTop: i > 0 ? `1px solid rgba(58,138,69,0.2)` : undefined }}>
                      <td
                        className={`px-2 py-1 ${r.sp ? 'pinzoro-text' : ''}`}
                        style={!r.sp ? { color: r.win ? P.win : P.lose } : undefined}
                      >
                        {r.name}
                      </td>
                      <td className="px-2 py-1" style={{ color: P.muted }}>{r.dice}</td>
                      <td className="px-2 py-1 text-right" style={{ color: r.win ? P.yellow : P.lose }}>{r.mult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <a
          href="/"
          style={{ color: P.muted, letterSpacing: '0.1em', marginTop: 8 }}
        >
          ← TOP
        </a>
      </div>
    </main>
  );
}
