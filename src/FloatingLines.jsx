import { useEffect, useRef } from 'react'
import './FloatingLines.css'

const vertexShader = `#version 300 es
precision highp float;
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `#version 300 es
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE = vec3(47.0, 75.0, 162.0) / 255.0;
out vec4 outputColor;

mat2 rotate(float radians) {
  return mat2(cos(radians), sin(radians), -sin(radians), cos(radians));
}

vec3 backgroundColor(vec2 uv) {
  vec3 color = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float middle = uv.y - y;
  color += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(middle)));
  color += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(middle - 0.8)));
  return color * 0.5;
}

vec3 getLineColor(float progress, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;
  if (lineGradientCount == 1) return lineGradient[0] * 0.5;

  float clampedProgress = clamp(progress, 0.0, 0.9999);
  float scaled = clampedProgress * float(lineGradientCount - 1);
  int index = int(floor(scaled));
  float mixAmount = fract(scaled);
  int nextIndex = min(index + 1, lineGradientCount - 1);
  return mix(lineGradient[index], lineGradient[nextIndex], mixAmount) * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float movement = time * 0.1;
  float amplitude = sin(offset + time * 0.2) * 0.3;
  float y = sin(uv.x + offset + movement) * amplitude;

  if (shouldBend) {
    vec2 delta = screenUv - mouseUv;
    float influence = exp(-dot(delta, delta) * bendRadius);
    y += (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
  }

  float middle = uv.y - y;
  return 0.0175 / max(abs(middle) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  if (parallax) baseUv += parallaxOffset;

  vec3 color = vec3(0.0);
  vec3 baseColor = lineGradientCount > 0 ? vec3(0.0) : backgroundColor(baseUv);
  vec2 mouseUv = vec2(0.0);

  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float lineIndex = float(i);
      float progress = lineIndex / max(float(bottomLineCount - 1), 1.0);
      vec3 lineColor = getLineColor(progress, baseColor);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 rotatedUv = baseUv * rotate(angle);
      color += lineColor * wave(
        rotatedUv + vec2(bottomLineDistance * lineIndex + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * lineIndex,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float lineIndex = float(i);
      float progress = lineIndex / max(float(middleLineCount - 1), 1.0);
      vec3 lineColor = getLineColor(progress, baseColor);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 rotatedUv = baseUv * rotate(angle);
      color += lineColor * wave(
        rotatedUv + vec2(middleLineDistance * lineIndex + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * lineIndex,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float lineIndex = float(i);
      float progress = lineIndex / max(float(topLineCount - 1), 1.0);
      vec3 lineColor = getLineColor(progress, baseColor);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 rotatedUv = baseUv * rotate(angle);
      rotatedUv.x *= -1.0;
      color += lineColor * wave(
        rotatedUv + vec2(topLineDistance * lineIndex + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * lineIndex,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(color, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  outputColor = color;
}
`

const MAX_GRADIENT_STOPS = 8
const DEFAULT_ENABLED_WAVES = Object.freeze(['top', 'middle', 'bottom'])
const DEFAULT_LINE_COUNT = Object.freeze([6])
const DEFAULT_LINE_DISTANCE = Object.freeze([5])
const DEFAULT_BOTTOM_WAVE_POSITION = Object.freeze({ x: 2, y: -0.7, rotate: -1 })

function hexToVector(hex) {
  const value = hex.trim().replace(/^#/, '')
  const expanded = value.length === 3 ? value.split('').map(character => character + character).join('') : value
  const red = parseInt(expanded.slice(0, 2), 16)
  const green = parseInt(expanded.slice(2, 4), 16)
  const blue = parseInt(expanded.slice(4, 6), 16)
  return [red / 255, green / 255, blue / 255]
}

function createProgram(gl) {
  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(message || 'WebGL shader compilation failed')
    }
    return shader
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexShader)
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader)
  const program = gl.createProgram()
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(message || 'WebGL program linking failed')
  }
  return program
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = DEFAULT_ENABLED_WAVES,
  lineCount = DEFAULT_LINE_COUNT,
  lineDistance = DEFAULT_LINE_DISTANCE,
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = DEFAULT_BOTTOM_WAVE_POSITION,
  animationSpeed = 1,
  interactive = true,
  bendRadius = 10,
  bendStrength = -5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}) {
  const containerRef = useRef(null)
  const targetMouseRef = useRef([-1000, -1000])
  const currentMouseRef = useRef([-1000, -1000])
  const targetInfluenceRef = useRef(0)
  const currentInfluenceRef = useRef(0)
  const targetParallaxRef = useRef([0, 0])
  const currentParallaxRef = useRef([0, 0])

  const getValue = (value, waveType, fallback) => {
    if (typeof value === 'number') return value
    const index = enabledWaves.indexOf(waveType)
    return index >= 0 ? (value[index] ?? fallback) : fallback
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let active = true
    let frameId = 0
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return undefined

    let program
    try {
      program = createProgram(gl)
    } catch (error) {
      console.warn('Dynamic background unavailable:', error)
      return undefined
    }

    const lowPowerDevice = window.matchMedia('(max-width: 900px)').matches
      || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
      || (navigator.deviceMemory && navigator.deviceMemory <= 4)
    const frameInterval = 1000 / (lowPowerDevice ? 24 : 30)
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1 : 1.25)
    const locations = {}
    const uniform = (name) => {
      locations[name] ??= gl.getUniformLocation(program, name)
      return locations[name]
    }

    gl.useProgram(program)
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW)
    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const topEnabled = enabledWaves.includes('top')
    const middleEnabled = enabledWaves.includes('middle')
    const bottomEnabled = enabledWaves.includes('bottom')
    gl.uniform1f(uniform('animationSpeed'), animationSpeed)
    gl.uniform1i(uniform('enableTop'), topEnabled ? 1 : 0)
    gl.uniform1i(uniform('enableMiddle'), middleEnabled ? 1 : 0)
    gl.uniform1i(uniform('enableBottom'), bottomEnabled ? 1 : 0)
    gl.uniform1i(uniform('topLineCount'), topEnabled ? getValue(lineCount, 'top', 6) : 0)
    gl.uniform1i(uniform('middleLineCount'), middleEnabled ? getValue(lineCount, 'middle', 6) : 0)
    gl.uniform1i(uniform('bottomLineCount'), bottomEnabled ? getValue(lineCount, 'bottom', 6) : 0)
    gl.uniform1f(uniform('topLineDistance'), getValue(lineDistance, 'top', 5) * 0.01)
    gl.uniform1f(uniform('middleLineDistance'), getValue(lineDistance, 'middle', 5) * 0.01)
    gl.uniform1f(uniform('bottomLineDistance'), getValue(lineDistance, 'bottom', 5) * 0.01)
    gl.uniform3f(uniform('topWavePosition'), topWavePosition?.x ?? 10, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
    gl.uniform3f(uniform('middleWavePosition'), middleWavePosition?.x ?? 5, middleWavePosition?.y ?? 0, middleWavePosition?.rotate ?? 0.2)
    gl.uniform3f(uniform('bottomWavePosition'), bottomWavePosition?.x ?? 2, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4)
    gl.uniform1i(uniform('interactive'), interactive ? 1 : 0)
    gl.uniform1f(uniform('bendRadius'), bendRadius)
    gl.uniform1f(uniform('bendStrength'), bendStrength)
    gl.uniform1i(uniform('parallax'), parallax ? 1 : 0)

    const gradient = new Float32Array(MAX_GRADIENT_STOPS * 3).fill(1)
    const stops = linesGradient?.slice(0, MAX_GRADIENT_STOPS) ?? []
    stops.forEach((color, index) => gradient.set(hexToVector(color), index * 3))
    gl.uniform3fv(uniform('lineGradient[0]'), gradient)
    gl.uniform1i(uniform('lineGradientCount'), stops.length)

    container.appendChild(canvas)
    const startedAt = performance.now()

    let resizeFrameId = 0
    const setSize = () => {
      if (!active) return
      const nextWidth = container.clientWidth || 1
      const nextHeight = container.clientHeight || 1
      const drawingWidth = Math.max(1, Math.round(nextWidth * pixelRatio))
      const drawingHeight = Math.max(1, Math.round(nextHeight * pixelRatio))
      if (canvas.width === drawingWidth && canvas.height === drawingHeight) return
      canvas.width = drawingWidth
      canvas.height = drawingHeight
      gl.viewport(0, 0, drawingWidth, drawingHeight)
      gl.uniform3f(uniform('iResolution'), drawingWidth, drawingHeight, 1)
    }
    const scheduleResize = () => {
      if (resizeFrameId) return
      resizeFrameId = window.requestAnimationFrame(() => {
        resizeFrameId = 0
        setSize()
      })
    }

    const handlePointerMove = event => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      targetMouseRef.current[0] = x * pixelRatio
      targetMouseRef.current[1] = (rect.height - y) * pixelRatio
      targetInfluenceRef.current = 1

      if (parallax) {
        targetParallaxRef.current[0] = ((x - rect.width / 2) / rect.width) * parallaxStrength
        targetParallaxRef.current[1] = (-(y - rect.height / 2) / rect.height) * parallaxStrength
      }
    }

    const handlePointerLeave = event => {
      if (!event.relatedTarget) targetInfluenceRef.current = 0
    }

    setSize()
    const resizeObserver = new ResizeObserver(scheduleResize)
    resizeObserver.observe(container)
    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('mouseout', handlePointerLeave)
    }

    let lastRenderTime = 0
    const render = (time) => {
      if (!active) return
      frameId = window.requestAnimationFrame(render)
      if (time - lastRenderTime < frameInterval) return
      lastRenderTime = time - ((time - lastRenderTime) % frameInterval)
      gl.uniform1f(uniform('iTime'), (time - startedAt) / 1000)

      if (interactive) {
        currentMouseRef.current[0] += (targetMouseRef.current[0] - currentMouseRef.current[0]) * mouseDamping
        currentMouseRef.current[1] += (targetMouseRef.current[1] - currentMouseRef.current[1]) * mouseDamping
        gl.uniform2f(uniform('iMouse'), currentMouseRef.current[0], currentMouseRef.current[1])
        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping
        gl.uniform1f(uniform('bendInfluence'), currentInfluenceRef.current)
      }

      if (parallax) {
        currentParallaxRef.current[0] += (targetParallaxRef.current[0] - currentParallaxRef.current[0]) * mouseDamping
        currentParallaxRef.current[1] += (targetParallaxRef.current[1] - currentParallaxRef.current[1]) * mouseDamping
        gl.uniform2f(uniform('parallaxOffset'), currentParallaxRef.current[0], currentParallaxRef.current[1])
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId)
        frameId = 0
      } else if (!frameId) {
        frameId = window.requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    frameId = window.requestAnimationFrame(render)

    return () => {
      active = false
      window.cancelAnimationFrame(frameId)
      window.cancelAnimationFrame(resizeFrameId)
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('mouseout', handlePointerLeave)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
  ])

  return <div ref={containerRef} className="floating-lines-container" style={{ mixBlendMode }} aria-hidden="true" />
}
