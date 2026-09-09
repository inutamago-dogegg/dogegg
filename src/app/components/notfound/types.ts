// 404ページ ボクセルシューティングの共有型定義。
// このファイルが各モジュール(font/layout/engine/render/コンポーネント)間の契約になる。

/** 武器系バフ。同時に1種類だけ有効。 */
export type WeaponBuffKind = 'spread' | 'power' | 'explosive' | 'rapid';

/** 回転速度バフを含む全アイテム種別。 */
export type BuffKind = WeaponBuffKind | 'spin';

/** 破壊対象のボクセル1マス。 */
export type Voxel = {
  /** グリッド列 */
  col: number;
  /** グリッド行 */
  row: number;
  /** ワールド座標(セル中心) */
  x: number;
  y: number;
  /** 残りHP。0以下で破壊。 */
  hp: number;
  /** 初期HP(1..3)。硬さ=見た目の鉱石種に対応。 */
  maxHp: number;
  /** 直近ヒットからの経過秒。ヒット時に0へリセットし、被弾フラッシュ演出に使う。 */
  hitFlash: number;
};

/**
 * ボクセル配置。キャンバス全体を覆う一様グリッドで、文字部分だけ Voxel が入る。
 * 弾との判定はワールド座標→セル座標の変換で行う。
 */
export type VoxelField = {
  /** セル一辺のピクセル数(CSSピクセル) */
  cellSize: number;
  /** グリッド原点(col=0,row=0 セルの左上角)のワールド座標 */
  originX: number;
  originY: number;
  cols: number;
  rows: number;
  /** 長さ cols*rows。index = row * cols + col。空きセル/破壊済みは null。 */
  cells: (Voxel | null)[];
  /** 生存ボクセル数 */
  remaining: number;
  /** 初期ボクセル数 */
  total: number;
};

export type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 当たり判定半径(描画サイズにも使う) */
  radius: number;
  /** 1ヒットあたりのダメージ */
  damage: number;
  /** 残り貫通回数。0なら最初のヒットで消滅。 */
  pierce: number;
  /** 着弾時に範囲爆発するか */
  explosive: boolean;
  /** 生成からの経過秒(トレイル演出用) */
  age: number;
  dead: boolean;
};

export type Item = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: BuffKind;
  /**
   * 残り寿命の比率算出用。アイテムは時間経過で消滅しない仕様のため常に maxLife と同値(1)を保つ。
   * (描画側は life / maxLife を残量表示に使うので、フィールド自体は残している)
   */
  life: number;
  maxLife: number;
  /** 生成からの経過秒(ふわふわ上下演出用) */
  age: number;
  dead: boolean;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 一辺のピクセル数 */
  size: number;
  /** 残り寿命(秒) */
  life: number;
  maxLife: number;
  color: string;
  /** 破片の回転(ラジアン) */
  rot: number;
  /** 角速度(ラジアン/秒) */
  vrot: number;
  /** 重力の影響を受けるか(岩の破片=true, 光の粒=false) */
  gravity: boolean;
};

/** 「+3」「RAPID!」などの浮遊テキスト演出。 */
export type FloatingText = {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  color: string;
};

/** ready: 未発射(タイマー停止) / playing: 計測中 / cleared: 全破壊 */
export type GamePhase = 'ready' | 'playing' | 'cleared';

/** 自機が周回する楕円軌道(画面中央の文字を取り囲むレール)。 */
export type Orbit = {
  /** 軌道の中心(=文字の中心=画面中央) */
  cx: number;
  cy: number;
  /** 横半径・縦半径 */
  rx: number;
  ry: number;
};

export type ShipState = {
  /** 軌道上の現在位置(ワールド座標) */
  x: number;
  y: number;
  /** 軌道角(ラジアン)。これが増えることで文字の周りをグルグル周回する。 */
  angle: number;
  /** 照準角(ラジアン)。マウス/タッチ位置を向く(未取得のうちは軌道の中心を向く)。 */
  aim: number;
  /** 進行方向(ラジアン)。トロッコの向き(軌道の接線)。 */
  heading: number;
  /** 発射時の反動演出(0..1、時間で0へ減衰) */
  recoil: number;
};

export type WeaponBuffState = {
  kind: WeaponBuffKind;
  /** 残り効果時間(秒) */
  remaining: number;
  /** 効果時間の初期値(秒)。ゲージ表示に使う。 */
  duration: number;
};

export type SpinBuffState = {
  /** 残り効果時間(秒) */
  remaining: number;
  duration: number;
};

/** 照準の狙い先(マウス/タッチ位置)。 */
export type PointerState = {
  /** ワールド座標(CSSピクセル) */
  x: number;
  y: number;
  /** 一度でも位置を取得できたか。false のうちは軌道中心を狙う。 */
  active: boolean;
};

export type GameState = {
  /** キャンバスの論理サイズ(CSSピクセル) */
  width: number;
  height: number;
  /** 照準の狙い先 */
  pointer: PointerState;
  phase: GamePhase;
  /** 経過時間(秒)。phase === 'playing' の間だけ加算。 */
  elapsed: number;
  field: VoxelField;
  /** 自機の周回軌道 */
  orbit: Orbit;
  ship: ShipState;
  bullets: Bullet[];
  items: Item[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  /** 武器系バフ。null なら通常弾。 */
  weaponBuff: WeaponBuffState | null;
  /** 回転速度バフ。武器系と同時に有効化できる。 */
  spinBuff: SpinBuffState | null;
  /** 次に発射できるまでの残り時間(秒) */
  fireCooldown: number;
  /** 画面シェイク強度(ピクセル)。時間で減衰。 */
  shake: number;
  /** ヒットストップ残り時間(秒)。>0 の間はゲーム内時間を進めない。 */
  hitStop: number;
  /** 破壊したボクセルの累計数 */
  destroyed: number;
  /** 連続破壊コンボ数 */
  combo: number;
  /** コンボ持続の残り時間(秒)。0でコンボリセット。 */
  comboTimer: number;
};
