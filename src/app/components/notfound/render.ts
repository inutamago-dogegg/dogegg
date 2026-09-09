// 404ボクセルシューティングの描画モジュール。
// state は読み取り専用として扱い、一切書き換えない。
// Canvas上の矩形描画のみでドット絵を手続き的に組み立てる(画像素材はどぐえぐアイコンのみ)。

import type { Bullet, FloatingText, GameState, Item, Particle, ShipState, Voxel } from './types';
import { BUFF_STYLES, GAME_CONFIG, PALETTE, VOXEL_COLORS } from './config';

export type RenderResources = {
  /** どぐえぐアイコン画像。未ロードなら null。 */
  doggIcon: HTMLImageElement | null;
  /** createBackground で作った背景キャンバス。未生成なら null。 */
  background: HTMLCanvasElement | null;
};

/** VOXEL_COLORS に対応硬さが無い場合のフォールバック配色。 */
const FALLBACK_VOXEL_COLOR = { base: '#8a8a8a', light: '#c4c4c4', dark: '#4c4c4c' };

// ---------------------------------------------------------------------------
// 背景(坑道)
// ---------------------------------------------------------------------------

/** 坑道の背景をオフスクリーンキャンバスに一度だけ描いて返す(リサイズ時のみ作り直す)。 */
export function createBackground(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = false;

  const w = canvas.width;
  const h = canvas.height;
  const groundHeight = Math.round(h * 0.12);
  const groundY = h - groundHeight;

  // 深い坑道の地色
  ctx.fillStyle = PALETTE.bgDeep;
  ctx.fillRect(0, 0, w, h);

  drawRockTexture(ctx, w, h);
  drawTimberFrames(ctx, w, groundY);
  drawGroundStrip(ctx, w, h, groundY);
  drawLanterns(ctx, w, h);
  drawVignette(ctx, w, h);

  return canvas;
}

/** チャンキーな岩肌テクスチャ(8〜16px程度のマスをランダムに敷き詰める)。 */
function drawRockTexture(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const cell = 12;
  const colors = [PALETTE.bgRock, PALETTE.bgRockAlt, PALETTE.bgRockLight];
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      if (Math.random() < 0.55) {
        const color = colors[Math.floor(Math.random() * colors.length)] ?? PALETTE.bgRock;
        const grow = Math.random() < 0.3 ? cell : 0;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cell + grow, cell + grow);
      }
    }
  }
}

/** 坑道の枠に見える木製支保工(縦柱2本+横梁)を等間隔に並べる。 */
function drawTimberFrames(ctx: CanvasRenderingContext2D, w: number, groundY: number): void {
  const frameGap = 240;
  const postWidth = 16;
  const frameHalfSpan = 70;
  const frameCount = Math.max(1, Math.round(w / frameGap));
  for (let i = 0; i <= frameCount; i++) {
    const cx = Math.round((i / frameCount) * w);
    const leftX = cx - frameHalfSpan;
    const rightX = cx + frameHalfSpan;
    drawTimberPost(ctx, leftX, groundY, postWidth);
    drawTimberPost(ctx, rightX, groundY, postWidth);
    // 横梁
    const beamLeft = leftX;
    const beamW = rightX - leftX + postWidth;
    ctx.fillStyle = PALETTE.timberDark;
    ctx.fillRect(beamLeft, 18, beamW, 14);
    ctx.fillStyle = PALETTE.timber;
    ctx.fillRect(beamLeft, 20, beamW, 8);
  }
}

function drawTimberPost(ctx: CanvasRenderingContext2D, x: number, groundY: number, width: number): void {
  const px = Math.round(x);
  ctx.fillStyle = PALETTE.timberDark;
  ctx.fillRect(px, 0, width, groundY);
  ctx.fillStyle = PALETTE.timber;
  ctx.fillRect(px + 2, 0, width - 4, groundY);
  // 節目のドット
  ctx.fillStyle = PALETTE.timberDark;
  for (let y = 24; y < groundY; y += 28) {
    ctx.fillRect(px + 2, y, width - 4, 3);
  }
}

/** 画面下部の地面ストリップ。 */
function drawGroundStrip(ctx: CanvasRenderingContext2D, w: number, h: number, groundY: number): void {
  ctx.fillStyle = PALETTE.ground;
  ctx.fillRect(0, groundY, w, h - groundY);
  ctx.fillStyle = PALETTE.groundDark;
  const cell = 14;
  for (let x = 0; x < w; x += cell) {
    if (Math.random() < 0.5) {
      ctx.fillRect(x, groundY + Math.floor(Math.random() * 5), cell, 4);
    }
  }
}

/** 天井から吊るされたランタンを2〜3個配置。 */
function drawLanterns(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const count = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const lx = Math.round(((i + 0.5) / count) * w);
    const ly = Math.round(h * 0.16 + Math.random() * 24);
    // 淡いグロー
    ctx.fillStyle = PALETTE.lanternGlow;
    ctx.beginPath();
    ctx.arc(lx, ly, 46, 0, Math.PI * 2);
    ctx.fill();
    // 吊り紐
    ctx.fillStyle = PALETTE.timberDark;
    ctx.fillRect(lx - 1, ly - 22, 2, 22);
    // 本体
    ctx.fillStyle = PALETTE.railDark;
    ctx.fillRect(lx - 6, ly - 8, 12, 14);
    ctx.fillStyle = PALETTE.lantern;
    ctx.fillRect(lx - 4, ly - 6, 8, 10);
  }
}

/** 画面端に向かって暗くなるビネット。 */
function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const gradient = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.72,
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

// ---------------------------------------------------------------------------
// 1フレーム描画
// ---------------------------------------------------------------------------

/**
 * 1フレーム描画する。state は読み取り専用として扱い、絶対に書き換えない。
 * ctx は呼び出し側で DPR スケール済み(CSSピクセル座標系で描けばよい)。
 * timeMs は performance.now() 相当(ランタンの揺らぎ等の演出に使う)。
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  res: RenderResources,
  timeMs: number,
): void {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, state.width, state.height);

  ctx.save();
  if (state.shake > 0) {
    const shakeX = Math.round((Math.random() * 2 - 1) * state.shake);
    const shakeY = Math.round((Math.random() * 2 - 1) * state.shake);
    ctx.translate(shakeX, shakeY);
  }

  drawBackgroundLayer(ctx, state, res, timeMs);
  drawOrbitRail(ctx, state.orbit);
  drawVoxels(ctx, state);
  drawItems(ctx, state);
  drawBullets(ctx, state);
  drawShip(ctx, state, res, timeMs);
  drawParticles(ctx, state);
  drawFloatingTexts(ctx, state);

  ctx.restore();
}

/** 背景キャンバスの貼り付け+ランタンの明滅オーバーレイ。 */
function drawBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  res: RenderResources,
  timeMs: number,
): void {
  if (res.background) {
    ctx.drawImage(res.background, 0, 0, state.width, state.height);
  } else {
    ctx.fillStyle = PALETTE.bgDeep;
    ctx.fillRect(0, 0, state.width, state.height);
  }
  // ランタンの揺らぎ(簡易的に画面全体へ淡く重ねる明滅)
  const flicker = 0.05 + 0.03 * Math.sin(timeMs / 220) + 0.02 * Math.sin(timeMs / 71);
  ctx.globalAlpha = Math.max(0, flicker);
  ctx.fillStyle = PALETTE.lanternGlow;
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// 周回軌道(楕円レール)
// ---------------------------------------------------------------------------

/**
 * 自機が周回する楕円軌道を、文字ボクセルを取り囲む鉱山レールとして描く。
 * ボクセルより先(下のレイヤー)に描くこと。state.orbit は毎フレーム同じ値なので
 * 都度サンプリングしても軽量な範囲に抑える(サンプル点は80点程度)。
 */
function drawOrbitRail(ctx: CanvasRenderingContext2D, orbit: GameState['orbit']): void {
  const { cx, cy, rx, ry } = orbit;
  const sampleCount = 80; // レール描画のサンプル点数(低コスト維持)
  const tieStep = 4; // 何点ごとに枕木を置くか
  const railOffset = 9; // 内側/外側レールの半径オフセット
  const innerRx = Math.max(4, rx - railOffset);
  const innerRy = Math.max(4, ry - railOffset);
  const outerRx = rx + railOffset;
  const outerRy = ry + railOffset;

  // 枕木(レール本体より先に描いて下敷きにする)
  ctx.fillStyle = PALETTE.timber;
  for (let i = 0; i < sampleCount; i += tieStep) {
    const t = (i / sampleCount) * Math.PI * 2;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    drawTie(
      ctx,
      cx + innerRx * cos,
      cy + innerRy * sin,
      cx + outerRx * cos,
      cy + outerRy * sin,
    );
  }

  // レール本体(内側=影色、外側=明色で立体感を出す)
  drawRailRing(ctx, cx, cy, innerRx, innerRy, sampleCount, PALETTE.railDark);
  drawRailRing(ctx, cx, cy, outerRx, outerRy, sampleCount, PALETTE.rail);
}

/** 枕木1本を内外レールの間に短い矩形で描く。 */
function drawTie(ctx: CanvasRenderingContext2D, ix: number, iy: number, ox: number, oy: number): void {
  const angle = Math.atan2(oy - iy, ox - ix);
  const len = Math.hypot(ox - ix, oy - iy);
  ctx.save();
  ctx.translate(Math.round((ix + ox) / 2), Math.round((iy + oy) / 2));
  ctx.rotate(angle);
  ctx.fillRect(-len / 2, -3, len, 6);
  ctx.restore();
}

/** 楕円上の点列を1本のパスとして結び、レールを描く(1色あたり1回のstroke)。 */
function drawRailRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  sampleCount: number,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= sampleCount; i++) {
    const t = (i / sampleCount) * Math.PI * 2;
    const x = Math.round(cx + rx * Math.cos(t));
    const y = Math.round(cy + ry * Math.sin(t));
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// ボクセル
// ---------------------------------------------------------------------------

function drawVoxels(ctx: CanvasRenderingContext2D, state: GameState): void {
  const size = state.field.cellSize;
  for (const voxel of state.field.cells) {
    if (!voxel) continue;
    drawVoxel(ctx, voxel, size);
  }
}

function drawVoxel(ctx: CanvasRenderingContext2D, voxel: Voxel, size: number): void {
  const colors = VOXEL_COLORS[voxel.maxHp] ?? VOXEL_COLORS[1] ?? FALLBACK_VOXEL_COLOR;
  const s = Math.round(size);
  const x = Math.round(voxel.x - size / 2);
  const y = Math.round(voxel.y - size / 2);
  const bevel = Math.max(2, Math.round(size * 0.16));

  // ベース面
  ctx.fillStyle = colors.base;
  ctx.fillRect(x, y, s, s);
  // ハイライト(左上)
  ctx.fillStyle = colors.light;
  ctx.fillRect(x, y, s, bevel);
  ctx.fillRect(x, y, bevel, s);
  // シャドウ(右下)
  ctx.fillStyle = colors.dark;
  ctx.fillRect(x, y + s - bevel, s, bevel);
  ctx.fillRect(x + s - bevel, y, bevel, s);

  // ダメージ表現: 残りHPに応じたヒビ(暗いドット)
  if (voxel.hp < voxel.maxHp) {
    const damageRatio = 1 - voxel.hp / voxel.maxHp;
    const crackCount = Math.min(4, Math.ceil(damageRatio * 4));
    const span = Math.max(1, s - bevel * 2);
    ctx.fillStyle = colors.dark;
    for (let c = 0; c < crackCount; c++) {
      const seed = voxel.col * 13 + voxel.row * 7 + c * 37;
      const cx = x + bevel + (seed % span);
      const cy = y + bevel + ((seed * 3 + 11) % span);
      ctx.fillRect(cx, cy, 2, 2);
    }
  }

  // 被弾フラッシュ(直近ヒットからの経過秒が短いほど白く光る)
  if (voxel.hitFlash < 0.12) {
    const t = 1 - voxel.hitFlash / 0.12;
    ctx.globalAlpha = t * 0.85;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, s, s);
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------------------
// アイテム
// ---------------------------------------------------------------------------

function drawItems(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const item of state.items) {
    if (item.dead) continue;
    drawItem(ctx, item);
  }
}

function drawItem(ctx: CanvasRenderingContext2D, item: Item): void {
  const style = BUFF_STYLES[item.kind];

  // 残り寿命が少ないと点滅させる演出(アイテムは時間経過で消滅しない仕様になり
  // life は常に maxLife と同値=1のため、実際には発火しない。将来の仕様変更に備えてロジックは残す)。
  const lifeRatio = item.maxLife > 0 ? item.life / item.maxLife : 1;
  if (lifeRatio < 0.25 && Math.sin(item.age * 16) < 0) return;

  const bobY = Math.sin((item.age / GAME_CONFIG.item.bobPeriod) * Math.PI * 2) * GAME_CONFIG.item.bobAmplitude;
  const x = Math.round(item.x);
  const y = Math.round(item.y + bobY);
  const r = GAME_CONFIG.item.radius;

  // 淡いグロー
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = style.color;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;

  // ドット絵クリスタル(3段ブロックで菱形風に)
  const wNarrow = Math.round(r * 0.5);
  const wWide = Math.round(r * 1.0);
  const bandH = Math.round(r * 0.5);
  ctx.fillStyle = style.color;
  ctx.fillRect(x - wNarrow / 2, y - bandH * 1.5, wNarrow, bandH);
  ctx.fillRect(x - wWide / 2, y - bandH * 0.5, wWide, bandH);
  ctx.fillRect(x - wNarrow / 2, y + bandH * 0.5, wNarrow, bandH);
  // ハイライトのドット
  ctx.fillStyle = style.light;
  ctx.fillRect(x - wWide / 2 + 1, y - bandH * 0.5 + 1, 2, 2);
}

// ---------------------------------------------------------------------------
// 弾
// ---------------------------------------------------------------------------

function drawBullets(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const bullet of state.bullets) {
    if (bullet.dead) continue;
    drawBullet(ctx, bullet);
  }
}

function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  const isPower = bullet.pierce > 0;
  const glowColor = bullet.explosive ? BUFF_STYLES.explosive.light : PALETTE.bullet;
  const coreColor = bullet.explosive ? BUFF_STYLES.explosive.color : PALETTE.bulletCore;
  const r = Math.max(1, Math.round(bullet.radius));
  const x = Math.round(bullet.x);
  const y = Math.round(bullet.y);

  // 進行方向の逆へ短いトレイル
  const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
  const trailLen = Math.min(22, 6 + bullet.age * 60);
  const tx = Math.round(x - (bullet.vx / speed) * trailLen);
  const ty = Math.round(y - (bullet.vy / speed) * trailLen);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = glowColor;
  ctx.fillRect(tx - r, ty - r, r * 2, r * 2);
  ctx.globalAlpha = 1;

  // グロー
  ctx.fillStyle = glowColor;
  ctx.fillRect(x - r - 1, y - r - 1, r * 2 + 2, r * 2 + 2);
  // コア(パワーショットは大きめ)
  const coreR = isPower ? r : Math.max(1, Math.round(r * 0.55));
  ctx.fillStyle = coreColor;
  ctx.fillRect(x - coreR, y - coreR, coreR * 2, coreR * 2);
}

// ---------------------------------------------------------------------------
// 自機(トロッコ+砲塔+どぐえぐ)
// ---------------------------------------------------------------------------

function drawShip(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  res: RenderResources,
  timeMs: number,
): void {
  const x = Math.round(state.ship.x);
  const y = Math.round(state.ship.y);
  const radius = GAME_CONFIG.ship.radius;

  // 足元の直線レールは周回楕円レール(drawOrbitRail)に置き換わったため描かない。
  drawCart(ctx, x, y, radius, state.ship.heading);
  drawTurret(ctx, x, y, state.ship);
  drawDoggIcon(ctx, x, y, radius, res.doggIcon, timeMs);
}

/** トロッコ本体。heading(軌道の接線=進行方向)へ向けて回転させ、レールを走っているように見せる。 */
function drawCart(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, heading: number): void {
  const w = Math.round(radius * 1.6);
  const h = Math.round(radius * 0.9);
  const left = -Math.round(w / 2);
  const top = Math.round(-h * 0.1);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);

  // 車輪
  ctx.fillStyle = PALETTE.railDark;
  ctx.fillRect(left + 4, top + h - 4, 8, 8);
  ctx.fillRect(left + w - 12, top + h - 4, 8, 8);

  // 木箱本体
  ctx.fillStyle = PALETTE.timberDark;
  ctx.fillRect(left, top, w, h);
  ctx.fillStyle = PALETTE.timber;
  ctx.fillRect(left + 3, top + 3, w - 6, h - 6);

  // 金属縁
  ctx.fillStyle = PALETTE.rail;
  ctx.fillRect(left, top, w, 3);
  ctx.fillStyle = PALETTE.railDark;
  ctx.fillRect(left, top + h - 3, w, 3);

  ctx.restore();
}

/** 砲塔・銃身。aim(常に軌道中心=文字を向く)へ向けて回転させる。 */
function drawTurret(ctx: CanvasRenderingContext2D, x: number, y: number, ship: ShipState): void {
  const barrelLen = GAME_CONFIG.ship.muzzleDistance;
  const recoilOffset = ship.recoil * 8;
  const len = Math.max(4, Math.round(barrelLen - recoilOffset));

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ship.aim);

  // 砲台の土台
  ctx.fillStyle = PALETTE.railDark;
  ctx.fillRect(-6, -6, 12, 12);

  // 銃身(反動で後退)
  ctx.fillStyle = PALETTE.rail;
  ctx.fillRect(0, -3, len, 6);
  ctx.fillStyle = PALETTE.railDark;
  ctx.fillRect(0, 2, len, 1);

  // 発射直後の銃口フラッシュ
  if (ship.recoil > 0.5) {
    ctx.globalAlpha = Math.min(1, (ship.recoil - 0.5) * 2);
    ctx.fillStyle = PALETTE.muzzleFlash;
    ctx.fillRect(len - 2, -6, 10, 12);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawDoggIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  icon: HTMLImageElement | null,
  timeMs: number,
): void {
  const bob = Math.sin(timeMs / 260) * 2;
  const cx = Math.round(x);
  const cy = Math.round(y - radius * 0.35 + bob);
  const r = Math.round(radius * 0.5);

  if (icon) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(icon, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  } else {
    // 未ロード時の代替: 単色の丸
    ctx.fillStyle = PALETTE.uiAccent;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// パーティクル・フローティングテキスト
// ---------------------------------------------------------------------------

function drawParticles(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const p of state.particles) {
    drawParticle(ctx, p);
  }
  ctx.globalAlpha = 1;
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  const alpha = p.maxLife > 0 ? Math.max(0, Math.min(1, p.life / p.maxLife)) : 1;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  const half = p.size / 2;
  ctx.save();
  ctx.translate(Math.round(p.x), Math.round(p.y));
  ctx.rotate(p.rot);
  ctx.fillRect(-half, -half, p.size, p.size);
  ctx.restore();
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.floatingTexts.length === 0) return;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const t of state.floatingTexts) {
    drawFloatingText(ctx, t);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawFloatingText(ctx: CanvasRenderingContext2D, t: FloatingText): void {
  const alpha = t.maxLife > 0 ? Math.max(0, Math.min(1, t.life / t.maxLife)) : 1;
  const rise = (1 - alpha) * 18;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = t.color;
  ctx.fillText(t.text, Math.round(t.x), Math.round(t.y - rise));
}

// 「クリックで発射」の案内は自機に追従させると軌道上を高速で動き回って読めないため、
// Canvas 側では描かず React 側の DOM オーバーレイ(画面下部固定)が担当する。
