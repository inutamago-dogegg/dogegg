// table-felt.vert
// フルスクリーンクワッド用の頂点シェーダー
// このファイルは基本的に変更不要です

attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
