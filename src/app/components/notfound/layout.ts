// 404ボクセルシューティングのボクセル配置(レイアウト)。
// 画面サイズから「404」「NOT FOUND」を構成するボクセルの一様グリッド配置を構築する。

import type { Voxel, VoxelField } from './types';
import { GAME_CONFIG } from './config';
import { GLYPH_HEIGHT, GLYPH_WIDTH, getGlyphRows } from './font';

/** 文字間ギャップ(列数) */
const CHAR_GAP = 1;
/** 半角スペースの列数 */
const SPACE_COLS = 3;
/** 行間ギャップ(行数、セル単位) */
const ROW_GAP = 2;
/** 文字ブロックを軌道楕円に内接させる際の安全マージン(1未満で少し余裕を持たせる)。 */
const ORBIT_FIT_MARGIN = 0.95;

/**
 * 軌道マージン(画面端と自機軌道の間隔)を画面サイズに応じて計算する。
 * 固定値(GAME_CONFIG.ship.orbitMargin)は小さい画面では過大になるため、
 * 画面の短辺に比例した値との小さい方を採り、下限24pxでクランプする。
 * engine.ts の computeOrbit / updateViewport と共通のロジックとして使う。
 */
export function computeOrbitMargin(width: number, height: number): number {
  return Math.max(24, Math.min(GAME_CONFIG.ship.orbitMargin, Math.min(width, height) * 0.09));
}

/** 1文字あたりの列数(スペースは3列、通常のグリフは5列)。 */
function charCols(ch: string): number {
  return ch === ' ' ? SPACE_COLS : GLYPH_WIDTH;
}

/** 1行(文字列)の合計列数。文字間ギャップを含む。 */
function lineCols(line: string): number {
  let cols = 0;
  for (let i = 0; i < line.length; i++) {
    cols += charCols(line.charAt(i));
    if (i < line.length - 1) cols += CHAR_GAP;
  }
  return cols;
}

/** レイアウト計算用の行情報。 */
type LineLayout = {
  text: string;
  /** 行の上端のワールドY座標 */
  topY: number;
};

/** 画面サイズからボクセル配置を構築する。 */
export function buildVoxelField(width: number, height: number): VoxelField {
  const words: string[] =
    width >= 900 && width / height >= 1.1 ? ['404', 'NOT FOUND'] : ['404', 'NOT', 'FOUND'];

  const maxCols = Math.max(...words.map(lineCols));
  const totalHeightCells = words.length * GLYPH_HEIGHT + (words.length - 1) * ROW_GAP;

  // 自機は画面中央を中心とする楕円軌道(rx, ry)を周回する。文字ブロックはその内側に
  // 収まらなければならない(重なるとトロッコの見た目が破綻するため)。
  // 自機本体の見た目半径分もさらに内側へマージンとして差し引く。
  const margin = computeOrbitMargin(width, height);
  const orbitRx = width / 2 - margin;
  const orbitRy = height / 2 - margin;
  const safeRx = Math.max(1, orbitRx - GAME_CONFIG.ship.radius);
  const safeRy = Math.max(1, orbitRy - GAME_CONFIG.ship.radius);

  // 文字ブロック(幅maxCols, 高さtotalHeightCellsセル)を軌道の内接矩形として、
  // 楕円 (a/safeRx)^2 + (b/safeRy)^2 <= marginRatio^2 を満たす最大の cellSize を直接解く。
  // a = 半幅 = (maxCols/2)*cellSize, b = 半高 = (totalHeightCells/2)*cellSize
  const halfCols = maxCols / 2;
  const halfRows = totalHeightCells / 2;
  const ellipseFactor = Math.sqrt((halfCols / safeRx) ** 2 + (halfRows / safeRy) ** 2);
  const cellSizeFit = ellipseFactor > 0 ? ORBIT_FIT_MARGIN / ellipseFactor : 26;
  const cellSize = Math.max(5, Math.min(26, Math.floor(cellSizeFit)));

  const cols = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;
  const originX = width / 2 - (cols * cellSize) / 2;
  const originY = height / 2 - (rows * cellSize) / 2;
  const cells: (Voxel | null)[] = new Array(cols * rows).fill(null);

  const field: VoxelField = {
    cellSize,
    originX,
    originY,
    cols,
    rows,
    cells,
    remaining: 0,
    total: 0,
  };

  const centerX = width / 2;
  const centerY = height / 2;

  const lineHeightPx = GLYPH_HEIGHT * cellSize;
  const gapPx = ROW_GAP * cellSize;

  // 全行をまとめて1ブロックとし、画面中央に縦積みセンタリングする(中央の安全圏は不要)。
  const blockHeightPx = totalHeightCells * cellSize;
  const blockTopY = centerY - blockHeightPx / 2;

  const lines: LineLayout[] = [];
  let cursorTopY = blockTopY;
  for (const word of words) {
    lines.push({ text: word, topY: cursorTopY });
    cursorTopY += lineHeightPx + gapPx;
  }

  // 1パス目: グリッドへスナップしながらボクセルを配置する(HPは仮値)。
  const placed: Voxel[] = [];
  let total = 0;

  for (const line of lines) {
    const startX = centerX - (lineCols(line.text) * cellSize) / 2;
    let cursorCol = 0;

    for (let i = 0; i < line.text.length; i++) {
      const ch = line.text.charAt(i);
      const chWidth = charCols(ch);
      const glyph = ch === ' ' ? null : getGlyphRows(ch);

      if (glyph) {
        for (let r = 0; r < GLYPH_HEIGHT; r++) {
          const rowStr = glyph[r] ?? '';
          for (let c = 0; c < GLYPH_WIDTH; c++) {
            if (rowStr.charAt(c) !== '#') continue;

            const pixelX = startX + (cursorCol + c) * cellSize + cellSize / 2;
            const pixelY = line.topY + r * cellSize + cellSize / 2;

            const col = Math.floor((pixelX - originX) / cellSize);
            const row = Math.floor((pixelY - originY) / cellSize);
            if (col < 0 || col >= cols || row < 0 || row >= rows) continue;

            const idx = row * cols + col;
            if (cells[idx]) continue;

            const cellCenterX = originX + col * cellSize + cellSize / 2;
            const cellCenterY = originY + row * cellSize + cellSize / 2;

            // HPは2パス目で画面中央からの距離を基に決定するため、ここでは仮値を入れる。
            // hitFlash は十分昔(999)にして、初期表示で被弾フラッシュしないようにする。
            const voxel: Voxel = {
              col,
              row,
              x: cellCenterX,
              y: cellCenterY,
              hp: 1,
              maxHp: 1,
              hitFlash: 999,
            };
            cells[idx] = voxel;
            placed.push(voxel);
            total++;
          }
        }
      }

      cursorCol += chWidth;
      if (i < line.text.length - 1) cursorCol += CHAR_GAP;
    }
  }

  // 2パス目: 画面中央からの距離が遠いボクセルほど硬くする。
  // 距離はこの盤面内の最大距離で正規化し、t(0=中心,1=最外周)で閾値判定する。
  let maxDistSq = 0;
  for (const voxel of placed) {
    const dx = voxel.x - centerX;
    const dy = voxel.y - centerY;
    const distSq = dx * dx + dy * dy;
    if (distSq > maxDistSq) maxDistSq = distSq;
  }
  const maxDist = Math.sqrt(maxDistSq) || 1;

  for (const voxel of placed) {
    const dx = voxel.x - centerX;
    const dy = voxel.y - centerY;
    const t = Math.sqrt(dx * dx + dy * dy) / maxDist;
    const hp = t >= 0.66 ? 3 : t >= 0.33 ? 2 : 1;
    voxel.hp = hp;
    voxel.maxHp = hp;
  }

  field.total = total;
  field.remaining = total;

  return field;
}

/** ワールド座標→cells配列のindex。グリッド外なら -1。 */
export function cellIndexAt(field: VoxelField, x: number, y: number): number {
  const col = Math.floor((x - field.originX) / field.cellSize);
  const row = Math.floor((y - field.originY) / field.cellSize);
  if (col < 0 || col >= field.cols || row < 0 || row >= field.rows) return -1;
  return row * field.cols + col;
}

/** ワールド座標にある生存ボクセル。無ければ null。 */
export function voxelAt(field: VoxelField, x: number, y: number): Voxel | null {
  const idx = cellIndexAt(field, x, y);
  if (idx < 0) return null;
  const voxel = field.cells[idx];
  return voxel ?? null;
}
