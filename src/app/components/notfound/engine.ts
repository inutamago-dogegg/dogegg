// 404ボクセルシューティングのゲームロジック本体。
// 状態(GameState)は再生成せず、常にミューテーションして更新する。
// 描画は render.ts 側の責務なので、ここでは座標・数値状態の更新のみを行う。

import type { GameState, Voxel, Item, Orbit, ShipState, PointerState } from './types';
import {
  GAME_CONFIG,
  PALETTE,
  VOXEL_COLORS,
  BUFF_STYLES,
  DROPPABLE_BUFFS,
  byLevel,
} from './config';
import { buildVoxelField, computeOrbitMargin } from './layout';

/** min以上max以下の整数乱数。 */
function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/** 画面サイズから自機の周回楕円軌道を算出する。半径は下限60でクランプする。 */
function computeOrbit(width: number, height: number): Orbit {
  const margin = computeOrbitMargin(width, height);
  return {
    cx: width / 2,
    cy: height / 2,
    rx: Math.max(60, width / 2 - margin),
    ry: Math.max(60, height / 2 - margin),
  };
}

/** 軌道角(ship.angle)から位置・進行方向を再計算し、照準角(aim)もポインタ基準で再計算してshipへ反映する。 */
function updateShipFromAngle(ship: ShipState, orbit: Orbit, pointer: PointerState): void {
  const cos = Math.cos(ship.angle);
  const sin = Math.sin(ship.angle);
  ship.x = orbit.cx + orbit.rx * cos;
  ship.y = orbit.cy + orbit.ry * sin;
  // 照準はポインタ位置を向く。ポインタ未取得のうちは従来どおり軌道中心(=文字の中心)を向く
  if (pointer.active) {
    ship.aim = Math.atan2(pointer.y - ship.y, pointer.x - ship.x);
  } else {
    ship.aim = Math.atan2(orbit.cy - ship.y, orbit.cx - ship.x);
  }
  // 進行方向は楕円の接線ベクトル (-rx*sin, ry*cos) の向き
  ship.heading = Math.atan2(orbit.ry * cos, -orbit.rx * sin);
}

/**
 * 配列を「生存要素だけ前に詰める」方式でその場フィルタする。
 * 毎フレーム呼ばれるためアロケーションを避け、新規配列は作らない。
 */
function compact<T>(arr: T[], keep: (item: T) => boolean): void {
  let write = 0;
  for (let read = 0; read < arr.length; read++) {
    const item = arr[read];
    if (item === undefined) continue;
    if (keep(item)) {
      arr[write] = item;
      write++;
    }
  }
  arr.length = write;
}

/** 光の粒(重力なし)パーティクルをまとめて生成する共通処理。マズルフラッシュ・爆発・アイテム取得演出に使う。 */
function spawnGlow(state: GameState, x: number, y: number, color: string, count: number, speedScale = 1): void {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (60 + Math.random() * 140) * speedScale;
    const life = 0.25 + Math.random() * 0.35;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 4,
      life,
      maxLife: life,
      color,
      rot: 0,
      vrot: 0,
      gravity: false,
    });
  }
}

/** ボクセル被弾時の小さな火花(非破壊ヒット用)。 */
function spawnSparks(state: GameState, x: number, y: number, count: number): void {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 120;
    const life = 0.15 + Math.random() * 0.15;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 2,
      life,
      maxLife: life,
      color: PALETTE.lantern,
      rot: 0,
      vrot: 0,
      gravity: false,
    });
  }
}

/** ボクセル破壊時の破片パーティクル(重力あり)。 */
function spawnDebris(state: GameState, voxel: Voxel): void {
  const fallback = { base: '#f5b942', light: '#ffe08a', dark: '#a8721c' };
  const colors = VOXEL_COLORS[voxel.maxHp] ?? VOXEL_COLORS[1] ?? fallback;
  const palette = [colors.base, colors.light, colors.dark];
  const count = randInt(GAME_CONFIG.fx.debrisMin, GAME_CONFIG.fx.debrisMax);
  const cellSize = state.field.cellSize;
  for (let i = 0; i < count; i++) {
    const color = palette[Math.floor(Math.random() * palette.length)] ?? colors.base;
    const angle = Math.random() * Math.PI * 2;
    const speed = GAME_CONFIG.fx.debrisSpeed * (0.5 + Math.random() * 0.7);
    const life = 0.35 + Math.random() * 0.45;
    state.particles.push({
      x: voxel.x,
      y: voxel.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: cellSize * (0.2 + Math.random() * 0.2),
      life,
      maxLife: life,
      color,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 12,
      gravity: true,
    });
  }
}

/**
 * ボクセル破壊時のアイテムドロップ抽選。
 * 破壊のたびに breaksSinceDrop を加算し、guaranteedDropInterval に達したら確定ドロップ(天井)。
 * それ未満なら従来どおり dropRate の確率で抽選する。ドロップが出た経路によらずカウンタをリセットする。
 */
function dropItem(state: GameState, x: number, y: number): void {
  state.breaksSinceDrop++;
  const guaranteed = state.breaksSinceDrop >= GAME_CONFIG.item.guaranteedDropInterval;
  if (!guaranteed && Math.random() >= GAME_CONFIG.item.dropRate) return;
  const kind = DROPPABLE_BUFFS[Math.floor(Math.random() * DROPPABLE_BUFFS.length)];
  if (kind === undefined) return;
  state.breaksSinceDrop = 0;
  const angle = Math.random() * Math.PI * 2;
  const speed = GAME_CONFIG.item.driftSpeed;
  state.items.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    kind,
    // 仕様変更: アイテムは時間経過で消滅しないので life は常に 1(maxLifeと同値)に固定
    life: 1,
    maxLife: 1,
    age: 0,
    dead: false,
  });
}

/** ボクセル破壊処理: フィールドから除去し、破片・ドロップ・コンボ・シェイクを反映する。 */
function destroyVoxel(state: GameState, voxel: Voxel): void {
  const field = state.field;
  const index = voxel.row * field.cols + voxel.col;
  field.cells[index] = null;
  field.remaining--;
  state.destroyed++;
  state.combo++;
  state.comboTimer = GAME_CONFIG.fx.comboWindow;
  state.shake = Math.min(GAME_CONFIG.fx.shakeMax, state.shake + GAME_CONFIG.fx.shakePerBreak);
  spawnDebris(state, voxel);
  dropItem(state, voxel.x, voxel.y);
}

/** ボクセルへのダメージ処理。破壊に至れば destroyVoxel、そうでなければ被弾フラッシュ+火花のみ。 */
function damageVoxel(state: GameState, voxel: Voxel, damage: number): void {
  voxel.hp -= damage;
  voxel.hitFlash = 0;
  if (voxel.hp <= 0) {
    destroyVoxel(state, voxel);
  } else {
    spawnSparks(state, voxel.x, voxel.y, randInt(2, 4));
  }
}

/**
 * 弾の円(x, y, radius)と重なる全ボクセルにダメージを与える。戻り値は1つでもヒットしたか。
 * 円の外接矩形からセルのcol/row範囲を絞り込み、その範囲だけを走査する(全セル走査はしない)。
 * セル矩形と円の重なりは「円中心からセル矩形上の最近接点までの距離」で判定する。
 */
function damageVoxelsInCircle(state: GameState, x: number, y: number, radius: number, damage: number): boolean {
  const field = state.field;
  const cellSize = field.cellSize;
  const minCol = Math.max(0, Math.floor((x - radius - field.originX) / cellSize));
  const maxCol = Math.min(field.cols - 1, Math.floor((x + radius - field.originX) / cellSize));
  const minRow = Math.max(0, Math.floor((y - radius - field.originY) / cellSize));
  const maxRow = Math.min(field.rows - 1, Math.floor((y + radius - field.originY) / cellSize));
  const radiusSq = radius * radius;

  let hit = false;
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const voxel = field.cells[row * field.cols + col];
      if (!voxel) continue;

      const cellLeft = field.originX + col * cellSize;
      const cellTop = field.originY + row * cellSize;
      const closestX = Math.max(cellLeft, Math.min(x, cellLeft + cellSize));
      const closestY = Math.max(cellTop, Math.min(y, cellTop + cellSize));
      const dx = x - closestX;
      const dy = y - closestY;
      if (dx * dx + dy * dy > radiusSq) continue;

      damageVoxel(state, voxel, damage);
      hit = true;
    }
  }
  return hit;
}

/** 爆発弾の着弾処理: 範囲内の全ボクセルにblastDamageを与え、シェイク・ヒットストップ・光パーティクルを発生させる。
 * 半径・威力は弾が発射時点で確定させた値(blastRadiusCells/blastDamage)を使う。
 * これにより、飛翔中にバフが切れても発射時の威力で爆発する。
 */
function explodeAt(state: GameState, x: number, y: number, radiusCells: number, blastDamage: number): void {
  const field = state.field;
  const radius = radiusCells * field.cellSize;
  const radiusSq = radius * radius;
  for (let i = 0; i < field.cells.length; i++) {
    const voxel = field.cells[i];
    if (!voxel) continue;
    const dx = voxel.x - x;
    const dy = voxel.y - y;
    if (dx * dx + dy * dy <= radiusSq) {
      damageVoxel(state, voxel, blastDamage);
    }
  }
  state.shake = Math.min(GAME_CONFIG.fx.shakeMax, state.shake + GAME_CONFIG.fx.shakePerBlast);
  state.hitStop = GAME_CONFIG.fx.hitStop;
  spawnGlow(state, x, y, PALETTE.lantern, randInt(10, 16));
}

/**
 * アイテム取得処理: バフ適用、演出テキスト・光パーティクル、ヒットストップ。
 * 同じ種類のバフを既に持っていればレベルアップ(上限あり)+効果時間リセット、
 * 持っていなければレベル1で新規追加する。種類が異なるバフは全て同時に有効。
 */
function collectItem(state: GameState, item: Item): void {
  const style = BUFF_STYLES[item.kind];
  const duration = GAME_CONFIG.buff.duration;
  const existing = state.buffs.find((b) => b.kind === item.kind);
  let level: number;
  if (existing) {
    existing.level = Math.min(existing.level + 1, GAME_CONFIG.buff.maxLevel);
    existing.remaining = duration;
    existing.duration = duration;
    level = existing.level;
  } else {
    level = 1;
    state.buffs.push({ kind: item.kind, level, remaining: duration, duration });
  }
  // レベル2以上なら「WIDE Lv2」のようにレベルが分かる表示にする
  const label = level > 1 ? `${style.shortLabel} Lv${level}` : style.shortLabel;
  state.floatingTexts.push({
    x: item.x,
    y: item.y,
    text: label,
    life: 1.0,
    maxLife: 1.0,
    color: style.color,
  });
  state.hitStop = GAME_CONFIG.fx.hitStop;
  spawnGlow(state, item.x, item.y, style.color, 12);
  item.dead = true;
}

/** 弾を1発生成してstate.bulletsへ追加する。 */
function spawnBullet(
  state: GameState,
  x: number,
  y: number,
  angle: number,
  speed: number,
  radius: number,
  damage: number,
  pierce: number,
  explosive: boolean,
  blastRadiusCells: number,
  blastDamage: number,
): void {
  state.bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    damage,
    pierce,
    explosive,
    blastRadiusCells,
    blastDamage,
    age: 0,
    dead: false,
  });
}

/** 新規ゲーム状態を作る(リトライ時もこれを呼ぶ)。 */
export function createGameState(width: number, height: number): GameState {
  const field = buildVoxelField(width, height);
  const orbit = computeOrbit(width, height);
  const pointer: PointerState = { x: orbit.cx, y: orbit.cy, active: false };
  const ship: ShipState = { x: 0, y: 0, angle: 0, aim: 0, heading: 0, recoil: 0 };
  updateShipFromAngle(ship, orbit, pointer);
  return {
    width,
    height,
    pointer,
    phase: 'ready',
    elapsed: 0,
    field,
    orbit,
    ship,
    bullets: [],
    items: [],
    particles: [],
    floatingTexts: [],
    buffs: [],
    fireCooldown: 0,
    shake: 0,
    hitStop: 0,
    destroyed: 0,
    combo: 0,
    comboTimer: 0,
    breaksSinceDrop: 0,
  };
}

/** ウィンドウリサイズ時に画面サイズだけ追従させる。フィールドは作り直さず、軌道と自機位置を新サイズへ合わせる。 */
export function updateViewport(state: GameState, width: number, height: number): void {
  state.width = width;
  state.height = height;
  const orbit = state.orbit;
  const margin = computeOrbitMargin(width, height);
  orbit.cx = width / 2;
  orbit.cy = height / 2;
  orbit.rx = Math.max(60, width / 2 - margin);
  orbit.ry = Math.max(60, height / 2 - margin);
  updateShipFromAngle(state.ship, orbit, state.pointer);
}

/** マウス/タッチ位置を更新する。ワールド座標(CSSピクセル)で受け取る。 */
export function setPointer(state: GameState, x: number, y: number): void {
  state.pointer.x = x;
  state.pointer.y = y;
  state.pointer.active = true;
  // 次の描画/発射に即反映されるようその場でaimも再計算する
  updateShipFromAngle(state.ship, state.orbit, state.pointer);
}

/** 発射入力。クールダウン中は何もしない。ready→playing遷移もここで行う。 */
export function fireShot(state: GameState): void {
  if (state.phase === 'cleared') return;
  if (state.phase === 'ready') {
    state.phase = 'playing';
  }
  if (state.fireCooldown > 0) return;

  // 種類の異なるバフは全て同時に効く。ここで各バフを引いて弾の性能に合成する。
  const spreadBuff = state.buffs.find((b) => b.kind === 'spread');
  const powerBuff = state.buffs.find((b) => b.kind === 'power');
  const explosiveBuff = state.buffs.find((b) => b.kind === 'explosive');
  const rapidBuff = state.buffs.find((b) => b.kind === 'rapid');

  state.fireCooldown = rapidBuff
    ? byLevel<number>(GAME_CONFIG.weapon.rapid.cooldowns, rapidBuff.level, GAME_CONFIG.fire.baseCooldown)
    : GAME_CONFIG.fire.baseCooldown;
  state.ship.recoil = 1;

  // 銃口・発射方向は照準角(aim)基準。aimはポインタ方向(未取得時は軌道中心)を向く。
  const muzzleX = state.ship.x + Math.cos(state.ship.aim) * GAME_CONFIG.ship.muzzleDistance;
  const muzzleY = state.ship.y + Math.sin(state.ship.aim) * GAME_CONFIG.ship.muzzleDistance;

  // 弾の性能を1つの雛形として組み立てる。初期値は通常弾。
  // config側のas const由来のリテラル型がletで広がらないため、number注釈で明示する。
  let speed: number = GAME_CONFIG.fire.bulletSpeed;
  let radius: number = GAME_CONFIG.fire.bulletRadius;
  let damage: number = GAME_CONFIG.fire.bulletDamage;
  let pierce = 0;
  let explosive = false;
  let blastRadiusCells = 0;
  let blastDamage = 0;

  if (powerBuff) {
    const cfg = GAME_CONFIG.weapon.power;
    radius = byLevel<number>(cfg.radii, powerBuff.level, radius);
    damage = byLevel<number>(cfg.damages, powerBuff.level, damage);
    pierce = byLevel<number>(cfg.pierces, powerBuff.level, pierce);
    speed *= cfg.speedScale;
  }

  if (explosiveBuff) {
    const cfg = GAME_CONFIG.weapon.explosive;
    explosive = true;
    blastRadiusCells = byLevel<number>(cfg.radiusCells, explosiveBuff.level, 0);
    blastDamage = byLevel<number>(cfg.blastDamages, explosiveBuff.level, 0);
    // powerと併用していない場合のみ、弾自体を爆発弾基準の見た目・威力にする
    // (power併用時はpowerの大型弾のまま爆発させるのが正しい挙動)
    if (!powerBuff) {
      radius = cfg.radius;
      damage = cfg.damage;
    }
  }

  if (spreadBuff) {
    const cfg = GAME_CONFIG.weapon.spread;
    const count = byLevel<number>(cfg.counts, spreadBuff.level, 1);
    const spreadRad = byLevel<number>(cfg.spreadRads, spreadBuff.level, 0);
    const half = spreadRad / 2;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = state.ship.aim - half + spreadRad * t;
      spawnBullet(state, muzzleX, muzzleY, angle, speed, radius, damage, pierce, explosive, blastRadiusCells, blastDamage);
    }
  } else {
    spawnBullet(
      state,
      muzzleX,
      muzzleY,
      state.ship.aim,
      speed,
      radius,
      damage,
      pierce,
      explosive,
      blastRadiusCells,
      blastDamage,
    );
  }

  spawnGlow(state, muzzleX, muzzleY, PALETTE.muzzleFlash, 3);
}

/** 1フレーム進める。dt は秒。 */
export function stepGame(state: GameState, dt: number): void {
  const clampedDt = Math.min(dt, 0.05);

  // ヒットストップ中はゲーム内時間を進めない
  if (state.hitStop > 0) {
    state.hitStop -= clampedDt;
    return;
  }

  if (state.phase === 'playing') {
    state.elapsed += clampedDt;
  }

  // 自機の軌道周回・反動減衰
  const spinBuff = state.buffs.find((b) => b.kind === 'spin');
  const angularSpeed = spinBuff
    ? byLevel<number>(GAME_CONFIG.ship.buffSpins, spinBuff.level, GAME_CONFIG.ship.baseSpin)
    : GAME_CONFIG.ship.baseSpin;
  let angle = (state.ship.angle + angularSpeed * clampedDt) % (Math.PI * 2);
  if (angle < 0) angle += Math.PI * 2;
  state.ship.angle = angle;
  updateShipFromAngle(state.ship, state.orbit, state.pointer);
  state.ship.recoil = Math.max(0, state.ship.recoil - clampedDt / 0.12);

  // クールダウン・バフ残り時間。逆順ループでspliceし、途中削除してもインデックスがずれないようにする
  state.fireCooldown = Math.max(0, state.fireCooldown - clampedDt);
  for (let i = state.buffs.length - 1; i >= 0; i--) {
    const buff = state.buffs[i];
    if (!buff) continue;
    buff.remaining -= clampedDt;
    if (buff.remaining <= 0) state.buffs.splice(i, 1);
  }

  // 弾の更新(サブステップ移動でトンネリングを防止)
  const field = state.field;
  const marginX = field.cellSize * 2;
  const maxStep = Math.max(field.cellSize * 0.5, 0.0001);
  const itemRadiusSq = GAME_CONFIG.item.radius * GAME_CONFIG.item.radius;
  for (const bullet of state.bullets) {
    if (bullet.dead) continue;
    const speed = Math.hypot(bullet.vx, bullet.vy);
    const totalDist = speed * clampedDt;
    const steps = Math.max(1, Math.ceil(totalDist / maxStep));
    const stepDt = clampedDt / steps;

    for (let s = 0; s < steps; s++) {
      bullet.x += bullet.vx * stepDt;
      bullet.y += bullet.vy * stepDt;

      const hit = damageVoxelsInCircle(state, bullet.x, bullet.y, bullet.radius, bullet.damage);
      if (hit) {
        if (bullet.explosive) {
          explodeAt(state, bullet.x, bullet.y, bullet.blastRadiusCells, bullet.blastDamage);
        }
        if (bullet.pierce > 0) {
          bullet.pierce--;
        } else {
          bullet.dead = true;
          break;
        }
      }

      // アイテム取得判定(取得しても弾は消えない)
      for (const item of state.items) {
        if (item.dead) continue;
        const dx = item.x - bullet.x;
        const dy = item.y - bullet.y;
        if (dx * dx + dy * dy <= itemRadiusSq) {
          collectItem(state, item);
        }
      }

      if (
        bullet.x < -marginX ||
        bullet.x > state.width + marginX ||
        bullet.y < -marginX ||
        bullet.y > state.height + marginX
      ) {
        bullet.dead = true;
        break;
      }
    }

    bullet.age += clampedDt;
  }
  compact(state.bullets, (b) => !b.dead);

  // ボクセル被弾フラッシュの経過時間を進める(0.5秒以降は光らないので更新不要)
  for (const voxel of field.cells) {
    if (!voxel) continue;
    if (voxel.hitFlash < 0.5) voxel.hitFlash += clampedDt;
  }

  // アイテムの更新(速度減衰・位置更新)。仕様変更によりアイテムは時間経過で消滅しない。
  const dampFactor = Math.pow(GAME_CONFIG.item.damping, clampedDt);
  for (const item of state.items) {
    if (item.dead) continue;
    item.age += clampedDt;
    item.vx *= dampFactor;
    item.vy *= dampFactor;
    item.x += item.vx * clampedDt;
    item.y += item.vy * clampedDt;
  }
  compact(state.items, (i) => !i.dead);

  // パーティクルの更新
  for (const p of state.particles) {
    if (p.gravity) p.vy += GAME_CONFIG.fx.gravity * clampedDt;
    p.x += p.vx * clampedDt;
    p.y += p.vy * clampedDt;
    p.rot += p.vrot * clampedDt;
    p.life -= clampedDt;
  }
  compact(state.particles, (p) => p.life > 0);

  // フローティングテキストの更新
  for (const t of state.floatingTexts) {
    t.y -= 34 * clampedDt;
    t.life -= clampedDt;
  }
  compact(state.floatingTexts, (t) => t.life > 0);

  // 画面シェイクの減衰
  state.shake *= Math.pow(GAME_CONFIG.fx.shakeDamping, clampedDt);
  if (state.shake < 0.05) state.shake = 0;

  // コンボタイマー
  state.comboTimer -= clampedDt;
  if (state.comboTimer <= 0) {
    state.combo = 0;
    state.comboTimer = 0;
  }

  // クリア判定
  if (state.phase === 'playing' && state.field.remaining === 0) {
    state.phase = 'cleared';
  }
}
