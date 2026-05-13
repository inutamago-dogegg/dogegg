import { useEffect, useRef } from 'react';

type Props = {
  vertSource: string;
  fragSource: string;
  className?: string;
  style?: React.CSSProperties;
};

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[ShaderCanvas] compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
): WebGLProgram | null {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[ShaderCanvas] link error:', gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

/**
 * GLSL フラグメントシェーダーをフルスクリーンのキャンバスで実行するコンポーネント
 *
 * Props:
 *   vertSource  — 頂点シェーダーのソース文字列
 *   fragSource  — フラグメントシェーダーのソース文字列
 *   className   — 追加の Tailwind クラスなど
 *
 * シェーダーに渡される Uniform:
 *   u_resolution : vec2  — キャンバスの解像度 (px)
 *   u_time       : float — マウント後の経過時間 (秒)
 */
export default function ShaderCanvas({ vertSource, fragSource, className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      // WebGL 非対応環境では canvas が透明なまま → CSS フォールバックが見える
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
    if (!vs || !fs) return;

    const prog = linkProgram(gl, vs, fs);
    if (!prog) return;

    // フルスクリーンクワッド (-1,-1) → (1,1)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    const resLoc = gl.getUniformLocation(prog, 'u_resolution');
    const timLoc = gl.getUniformLocation(prog, 'u_time');

    // キャンバスサイズをコンテナに合わせる
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const t0 = performance.now();
    let raf: number;

    const draw = () => {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
      if (timLoc) gl.uniform1f(timLoc, (performance.now() - t0) * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [vertSource, fragSource]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
