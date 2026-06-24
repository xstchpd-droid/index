import * as THREE from 'three'
import { useEffect, useRef } from 'react'

const chineseNumbers = ['零一', '零二', '零三', '零四', '零五', '零六']

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smoothstep = (edge0, edge1, value) => {
  const progress = clamp((value - edge0) / (edge1 - edge0))
  return progress * progress * (3 - 2 * progress)
}

const windowFocus = (value, start, peak, end) => {
  if (value <= peak) return smoothstep(start, peak, value)
  return 1 - smoothstep(peak, end, value)
}

function createProjectTexture(project, index) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 720
  const context = canvas.getContext('2d')
  const accent = project.accent

  context.fillStyle = '#0a0a0a'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.strokeStyle = 'rgba(255,255,255,0.10)'
  context.lineWidth = 1
  for (let x = 0; x <= canvas.width; x += 60) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, canvas.height)
    context.stroke()
  }
  for (let y = 0; y <= canvas.height; y += 60) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(canvas.width, y)
    context.stroke()
  }

  context.globalAlpha = 0.22
  context.fillStyle = accent
  context.beginPath()
  context.moveTo(710, 80)
  context.lineTo(1120, 640)
  context.lineTo(520, 640)
  context.closePath()
  context.fill()
  context.globalAlpha = 1

  context.strokeStyle = accent
  context.lineWidth = 4
  context.beginPath()
  context.arc(820, 360, 220, 0, Math.PI * 2)
  context.stroke()
  context.beginPath()
  context.arc(820, 360, 128, 0, Math.PI * 2)
  context.stroke()

  context.fillStyle = accent
  context.font = '700 28px "Microsoft YaHei", sans-serif'
  context.fillText(chineseNumbers[index], 62, 76)

  context.fillStyle = 'rgba(255,255,255,0.52)'
  context.font = '400 20px "Microsoft YaHei", sans-serif'
  context.fillText(project.year, 62, 128)
  context.fillText(project.category, 62, 164)

  context.fillStyle = '#f4f2ea'
  context.font = '800 58px "Microsoft YaHei", sans-serif'
  const title = project.title
  const splitAt = Math.min(7, title.length)
  context.fillText(title.slice(0, splitAt), 62, 520)
  if (title.length > splitAt) context.fillText(title.slice(splitAt), 62, 590)

  context.fillStyle = accent
  context.font = '600 24px "Microsoft YaHei", sans-serif'
  context.fillText(project.type, 62, 660)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

function createCylinderGrid(radius = 7.5, height = 9.5, columns = 38, rows = 13) {
  const group = new THREE.Group()
  const material = new THREE.LineBasicMaterial({
    color: 0x8f9791,
    transparent: true,
    opacity: 0.24,
  })
  const angleStart = -Math.PI * 0.68
  const angleRange = Math.PI * 1.36

  for (let column = 0; column <= columns; column += 1) {
    const angle = angleStart + (column / columns) * angleRange
    const points = []
    for (let row = 0; row <= rows; row += 1) {
      const y = -height / 2 + (row / rows) * height
      points.push(new THREE.Vector3(Math.sin(angle) * radius, y, -Math.cos(angle) * radius))
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material))
  }

  for (let row = 0; row <= rows; row += 1) {
    const y = -height / 2 + (row / rows) * height
    const points = []
    for (let column = 0; column <= columns; column += 1) {
      const angle = angleStart + (column / columns) * angleRange
      points.push(new THREE.Vector3(Math.sin(angle) * radius, y, -Math.cos(angle) * radius))
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material))
  }

  return { group, material }
}

function createTriangleFrame(size, color, opacity = 0.42) {
  const height = size * 0.92
  const points = [
    new THREE.Vector3(0, height * 0.55, 0),
    new THREE.Vector3(size * 0.5, -height * 0.45, 0),
    new THREE.Vector3(-size * 0.5, -height * 0.45, 0),
  ]
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material)
  return { line, material }
}

function WorldScene({ progressRef, projects }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80)
    camera.position.set(0, 0, 10.5)

    const { group: gridGroup, material: gridMaterial } = createCylinderGrid()
    const gridDark = new THREE.Color(0x8f9791)
    const gridLight = new THREE.Color(0x59605d)
    gridGroup.position.z = -0.8
    scene.add(gridGroup)

    const projectGroup = new THREE.Group()
    projectGroup.position.z = 0.2
    const panelMaterials = []
    const panelTextures = []
    projects.forEach((project, index) => {
      const texture = createProjectTexture(project, index)
      panelTextures.push(texture)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
      panelMaterials.push(material)
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.52), material)
      const angle = (index - (projects.length - 1) / 2) * 0.34
      panel.position.set(Math.sin(angle) * 6.1, index % 2 === 0 ? 0.18 : -0.18, -Math.cos(angle) * 6.1 + 1.25)
      panel.rotation.y = -angle
      panel.userData.baseAngle = angle
      projectGroup.add(panel)

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(project.accent),
        transparent: true,
        opacity: 0,
      })
      panel.userData.edgeMaterial = edgeMaterial
      panel.add(new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry), edgeMaterial))
    })
    scene.add(projectGroup)

    const triangleGroup = new THREE.Group()
    const outerTriangle = createTriangleFrame(5.8, 0xf4f2ea, 0.55)
    const innerTriangle = createTriangleFrame(2.6, 0xd8ff45, 0.58)
    innerTriangle.line.position.z = 0.12
    triangleGroup.add(outerTriangle.line, innerTriangle.line)

    const prismGeometry = new THREE.ConeGeometry(1.55, 3.1, 3, 1, true)
    const prismMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8ff45,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
      side: THREE.DoubleSide,
    })
    const prism = new THREE.Mesh(prismGeometry, prismMaterial)
    prism.rotation.x = Math.PI / 2
    prism.position.z = -0.15
    triangleGroup.add(prism)
    triangleGroup.position.z = -1.4
    scene.add(triangleGroup)

    let width = 0
    let height = 0
    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()

    const pointer = new THREE.Vector2()
    const pointerTarget = new THREE.Vector2()
    const handlePointer = (event) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * -2
    }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('resize', resize)

    let currentProgress = progressRef.current || 0
    let frameId = 0
    const clock = new THREE.Clock()

    const render = () => {
      frameId = window.requestAnimationFrame(render)
      currentProgress += (progressRef.current - currentProgress) * 0.1
      pointer.lerp(pointerTarget, 0.055)
      const elapsed = clock.getElapsedTime()

      const worksFocus = windowFocus(currentProgress, 0.07, 0.25, 0.44)
      const lightFocus = windowFocus(currentProgress, 0.37, 0.58, 0.84)
      const heroFocus = 1 - smoothstep(0.08, 0.24, currentProgress)
      const contactFocus = smoothstep(0.88, 1, currentProgress)

      camera.position.x += (pointer.x * 0.34 + Math.sin(currentProgress * Math.PI * 1.2) * 0.42 - camera.position.x) * 0.06
      camera.position.y += (pointer.y * 0.22 + Math.sin(currentProgress * Math.PI * 2) * 0.18 - camera.position.y) * 0.06
      camera.position.z = 10.5 - worksFocus * 0.85
      camera.lookAt(0, 0, -1.2)

      gridGroup.rotation.y = (currentProgress - 0.25) * -1.05 + pointer.x * 0.035
      gridGroup.position.y = Math.sin(currentProgress * Math.PI * 2) * 0.25
      gridMaterial.color.lerpColors(gridDark, gridLight, lightFocus)
      gridMaterial.opacity = 0.16 + worksFocus * 0.16 + lightFocus * 0.08

      projectGroup.rotation.y = (0.25 - currentProgress) * 3.6
      projectGroup.position.z = -Math.abs(currentProgress - 0.25) * 10
      projectGroup.position.y = Math.sin(elapsed * 0.35) * 0.05
      panelMaterials.forEach((material, index) => {
        material.opacity = worksFocus
        const panel = projectGroup.children[index]
        if (panel) panel.userData.edgeMaterial.opacity = worksFocus * 0.7
      })

      triangleGroup.rotation.y = pointer.x * 0.08 + currentProgress * 0.6
      triangleGroup.rotation.x = pointer.y * 0.04
      triangleGroup.position.x = lightFocus * 0.4
      triangleGroup.scale.setScalar(0.88 + heroFocus * 0.25 + lightFocus * 0.08)
      const triangleOpacity = Math.max(heroFocus * 0.74, lightFocus * 0.58, contactFocus * 0.2)
      outerTriangle.material.opacity = triangleOpacity
      innerTriangle.material.opacity = triangleOpacity * 0.78
      outerTriangle.material.color.set(lightFocus > 0.45 ? 0x111313 : 0xf4f2ea)
      innerTriangle.material.color.set(lightFocus > 0.45 ? 0x111313 : 0xd8ff45)
      prismMaterial.opacity = Math.max(heroFocus * 0.16, lightFocus * 0.08)
      prism.rotation.z = elapsed * 0.12 + currentProgress * Math.PI

      renderer.render(scene, camera)
    }
    render()

    return () => {
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frameId)
      panelTextures.forEach((texture) => texture.dispose())
      panelMaterials.forEach((material) => material.dispose())
      prismGeometry.dispose()
      prismMaterial.dispose()
      gridMaterial.dispose()
      gridGroup.traverse((object) => {
        object.geometry?.dispose()
      })
      projectGroup.traverse((object) => {
        object.geometry?.dispose()
        object.material?.dispose()
      })
      outerTriangle.line.geometry.dispose()
      outerTriangle.material.dispose()
      innerTriangle.line.geometry.dispose()
      innerTriangle.material.dispose()
      renderer.dispose()
    }
  }, [progressRef, projects])

  return <canvas className="webgl-world" ref={canvasRef} aria-hidden="true" />
}

export default WorldScene
