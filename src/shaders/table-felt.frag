// table-felt.frag
// チンチロテーブルのフェルト布テクスチャ
//
// ── 調整できるパラメータ ─────────────────────────────────────────────────────
//
//   COLOR_BASE  / COLOR_LIGHT / COLOR_DARK
//     テーブルの色を変えたいときはここの RGB 値 (0.0〜1.0) を書き換えてください
//     例: vec3(1.0, 0.6, 0.0) でオレンジ系になります
//
//   FIBER_SCALE
//     繊維の細かさ。大きいほど目が細かくなります (推奨: 60〜150)
//
//   WARP_AMOUNT
//     布の歪み強度。大きいほど不均一で荒っぽい見た目になります (推奨: 0.005〜0.04)
//
//   VIGNETTE_STRENGTH
//     周囲の暗さ。0.0=なし, 1.0=強いビネット
//
//   TIME_SPEED
//     アニメーション速度。0.0 にすると静止します
//
// ─────────────────────────────────────────────────────────────────────────────

precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;

// ── ユーザー調整パラメータ ────────────────────────────────────────────────────
const vec3  COLOR_BASE        = vec3(0.07, 0.25, 0.12);   // 基本グリーン
const vec3  COLOR_LIGHT       = vec3(0.11, 0.37, 0.19);   // 明るい部分
const vec3  COLOR_DARK        = vec3(0.03, 0.13, 0.06);   // 暗い部分
const float FIBER_SCALE       = 95.0;                     // 繊維の密度
const float WARP_AMOUNT       = 0.016;                    // 布の歪み
const float VIGNETTE_STRENGTH = 0.60;                     // ビネット強度
const float TIME_SPEED        = 0.008;                    // アニメーション速度

// ── ドット絵パラメータ ────────────────────────────────────────────────────────
//   PIXEL_SIZE: 1ピクセルあたりの画面ドット数
//     4.0 = ドット絵らしい粗さ (推奨)
//     2.0 = 細かめ
//     1.0 = 通常描画 (ピクセル化なし)
const float PIXEL_SIZE = 4.0;
// ─────────────────────────────────────────────────────────────────────────────

// ── ノイズ関数群 ──────────────────────────────────────────────────────────────

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),               hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

// フラクタルブラウン運動 — 複数スケールのノイズを重ね合わせる
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p  = p * 2.13 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// ─────────────────────────────────────────────────────────────────────────────

void main() {
  // ドット絵用ピクセル化: UV をグリッドに量子化する
  vec2 pixCoord = floor(gl_FragCoord.xy / PIXEL_SIZE) * PIXEL_SIZE + PIXEL_SIZE * 0.5;
  vec2 uv = pixCoord / u_resolution;
  float t  = u_time * TIME_SPEED;

  // UV を微妙に歪める — 布の不均一さ、縫い目のゆらぎを再現
  vec2 warp = vec2(
    fbm(uv * 3.8 + vec2(0.0,  t      )),
    fbm(uv * 3.8 + vec2(5.2, -t * 1.3))
  ) * WARP_AMOUNT;
  vec2 wu = uv + warp;

  // 横方向の繊維 (経糸 — tate-ito)
  float h = noise(vec2(wu.x * FIBER_SCALE, wu.y * 2.8));
  h = h * h;  // コントラスト強調

  // 縦方向の繊維 (緯糸 — yoko-ito)
  float v = noise(vec2(wu.x * 2.8, wu.y * FIBER_SCALE));
  v = v * v;

  // 微細なランダムネス — 布表面の毛羽立ち
  float micro = noise(uv * 300.0) * 0.06;

  // 大スケールの色むら — 布を畳んだり使ったりした跡
  float large = fbm(uv * 2.0 + vec2(t * 0.4, 0.0));

  // 繊維を合成 (経糸 55% : 緯糸 45%)
  float felt = h * 0.55 + v * 0.45 + micro;

  // カラー合成
  vec3 color = mix(COLOR_DARK, COLOR_LIGHT, felt * 0.62 + large * 0.38);

  // ビネット — 中心を明るく、周囲を暗くしてテーブルらしさを出す
  vec2 center = uv * 2.0 - 1.0;
  float vig   = 1.0 - dot(center * 0.50, center * 0.50);
  vig         = clamp(vig, 0.0, 1.0);
  vig         = vig * vig;
  color       = mix(color * (1.0 - VIGNETTE_STRENGTH), color, vig);

  gl_FragColor = vec4(color, 1.0);
}
