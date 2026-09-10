// 404ボクセルシューティングの調整値とドット絵パレット。
// 難易度・演出のバランス調整はすべてこのファイルで完結させる。

import type { BuffKind } from './types';

export const GAME_CONFIG = {
  ship: {
    /** 通常時の周回角速度(ラジアン/秒)。約3.5秒で文字の周りを1周する。 */
    baseSpin: 1.8,
    /** 回転速度バフ中の周回角速度(ラジアン/秒)。添字が重ねがけレベル-1。 */
    buffSpins: [3.2, 4.2, 5.2],
    /** トロッコ+砲塔の見た目半径(ピクセル) */
    radius: 34,
    /** 銃口までの距離(ピクセル) */
    muzzleDistance: 30,
    /** 軌道と画面端の間隔(ピクセル)。軌道半径 = 画面半径 - この値。 */
    orbitMargin: 58,
  },
  fire: {
    /** 通常時の発射間隔(秒) */
    baseCooldown: 0.135,
    /** 弾速(ピクセル/秒) */
    bulletSpeed: 940,
    /** 通常弾の半径(ピクセル) */
    bulletRadius: 4.5,
    /** 通常弾のダメージ */
    bulletDamage: 1,
  },
  // 強化は種類が違えば同時に有効(重ねがけ)になり、効果は掛け合わさる。
  // 各配列は添字が「重ねがけレベル - 1」に対応する。
  weapon: {
    /** ワイド/スプレッド弾: 1回の発射で counts 発を spreadRads の角度範囲に扇状発射 */
    spread: { counts: [3, 5, 7], spreadRads: [0.22, 0.34, 0.46] },
    /** パワーショット: 大型・貫通・高ダメージ */
    power: { radii: [11, 14, 17], damages: [3, 5, 7], pierces: [6, 9, 12], speedScale: 0.85 },
    /** 爆発弾: 着弾点を中心に radiusCells セル分の範囲へ blastDamages のダメージ */
    explosive: { radius: 7, damage: 1, radiusCells: [2.4, 3.0, 3.6], blastDamages: [3, 4, 5] },
    /** 連射: 発射間隔を短縮する */
    rapid: { cooldowns: [0.075, 0.055, 0.04] },
  },
  buff: {
    /** 強化の効果時間(秒)。取り直すとこの値にリセットされる。 */
    duration: 6.5,
    /** 同じ強化を取り直して上げられる上限レベル */
    maxLevel: 3,
  },
  item: {
    /** ボクセル破壊1回あたりのランダムドロップ確率 */
    dropRate: 0.03,
    /**
     * 確定ドロップの間隔(破壊数)。ドロップが出るたびにカウンタをリセットする。
     * 運だけでクリアタイムが極端にブレる(強化なしの単調な時間が続く)のを防ぐための天井。
     */
    guaranteedDropInterval: 18,
    /** 弾で撃ち抜くための当たり判定半径(ピクセル) */
    radius: 14,
    /** ドロップ直後の初速(ピクセル/秒) */
    driftSpeed: 30,
    /** 速度の減衰率(1秒あたりの倍率) */
    damping: 0.4,
    /** ふわふわ上下の振幅(ピクセル)と周期(秒) */
    bobAmplitude: 4,
    bobPeriod: 1.4,
  },
  fx: {
    /** ボクセル破壊時に出す破片パーティクル数の範囲 */
    debrisMin: 5,
    debrisMax: 9,
    /** 破片の初速(ピクセル/秒) */
    debrisSpeed: 210,
    /** 破片にかかる重力(ピクセル/秒^2) */
    gravity: 900,
    /** 画面シェイクの上限(ピクセル)と減衰率(1秒あたりの倍率) */
    shakeMax: 13,
    shakeDamping: 0.02,
    /** 1ボクセル破壊あたりのシェイク加算 */
    shakePerBreak: 1.1,
    /** 爆発時のシェイク加算 */
    shakePerBlast: 6,
    /** 爆発・アイテム取得時のヒットストップ(秒) */
    hitStop: 0.04,
    /** コンボ表示の持続時間(秒) */
    comboWindow: 1.4,
  },
  /** 全ボクセル破壊後、クリア画面を出すまでの余韻(秒) */
  clearDelay: 0.6,
} as const;

/** ドット絵パレット(炭鉱テーマ)。 */
export const PALETTE = {
  /** 坑道の暗がり */
  bgDeep: '#120c09',
  bgRock: '#1e150f',
  bgRockAlt: '#261b13',
  bgRockLight: '#30231a',
  /** 地面・レール・支保工 */
  ground: '#3a2a1d',
  groundDark: '#241a12',
  rail: '#8a939c',
  railDark: '#4d545c',
  timber: '#6b4a2a',
  timberDark: '#472f1a',
  /** ランタンの灯り */
  lantern: '#ffb347',
  lanternGlow: 'rgba(255, 179, 71, 0.16)',
  /** 弾・銃口 */
  bullet: '#ffe9a8',
  bulletCore: '#fff6d8',
  muzzleFlash: '#ffd166',
  /** UI */
  uiText: '#f0e2cd',
  uiMuted: '#a08a72',
  uiPanel: 'rgba(18, 12, 9, 0.86)',
  uiBorder: '#6b4a2a',
  uiAccent: '#ffb347',
} as const;

/** ボクセルの硬さ(maxHp)ごとの鉱石カラー。base=面, light=ハイライト, dark=影 */
export const VOXEL_COLORS: Record<number, { base: string; light: string; dark: string }> = {
  1: { base: '#f5b942', light: '#ffe08a', dark: '#a8721c' },
  2: { base: '#d97a45', light: '#f0a978', dark: '#8f4620' },
  3: { base: '#7d8896', light: '#aab4c0', dark: '#4a545f' },
};

/** アイテム種別ごとの色とドット絵ラベル。 */
export const BUFF_STYLES: Record<BuffKind, { color: string; light: string; label: string; shortLabel: string }> = {
  spread:    { color: '#38bdf8', light: '#9fe4ff', label: 'ワイドショット', shortLabel: 'WIDE' },
  power:     { color: '#f87171', light: '#ffb3b3', label: 'パワーショット', shortLabel: 'POWER' },
  explosive: { color: '#fb923c', light: '#ffcf9c', label: 'ばくはつ弾',     shortLabel: 'BLAST' },
  rapid:     { color: '#c084fc', light: '#e2c3ff', label: 'れんしゃ',       shortLabel: 'RAPID' },
  spin:      { color: '#4ade80', light: '#a7f3c4', label: 'こうそく回転',   shortLabel: 'SPIN' },
};

/** ドロップ抽選の対象(全5種を等確率)。 */
export const DROPPABLE_BUFFS: readonly BuffKind[] = ['spread', 'power', 'explosive', 'rapid', 'spin'];

/** 重ねがけレベル(1始まり)に対応する値を配列から取り出す。範囲外は末尾/先頭にフォールバックする。 */
export function byLevel<T>(values: readonly T[], level: number, fallback: T): T {
  if (values.length === 0) return fallback;
  const index = Math.min(Math.max(Math.floor(level) - 1, 0), values.length - 1);
  return values[index] ?? fallback;
}

/** ベストタイム保存に使う localStorage キー。 */
export const BEST_TIME_STORAGE_KEY = 'dogegg-404-voxel-best-time';
