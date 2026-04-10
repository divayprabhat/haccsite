import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SPHERES = [
  { size: 130, color: ['#a78bfa', '#8b5cf6'], x: 10, y: 15, speed: 0.28, floatAmp: 18, phaseX: 0.0, phaseY: 0.5, zIdx: 8, mouth: 'happy' },
  { size: 108, color: ['#fb923c', '#f97316'], x: 78, y: 8, speed: 0.22, floatAmp: 22, phaseX: 1.2, phaseY: 2.1, zIdx: 7, mouth: 'excited' },
  { size: 80, color: ['#38bdf8', '#0ea5e9'], x: 5, y: 62, speed: 0.38, floatAmp: 26, phaseX: 2.4, phaseY: 0.8, zIdx: 9, mouth: 'happy' },
  { size: 60, color: ['#e879f9', '#d946ef'], x: 84, y: 60, speed: 0.45, floatAmp: 30, phaseX: 0.7, phaseY: 3.1, zIdx: 6, mouth: 'happy' },
  { size: 50, color: ['#facc15', '#eab308'], x: 48, y: 5, speed: 0.52, floatAmp: 28, phaseX: 3.5, phaseY: 1.4, zIdx: 5, mouth: 'excited' },
  { size: 92, color: ['#818cf8', '#6366f1'], x: 70, y: 73, speed: 0.31, floatAmp: 16, phaseX: 1.8, phaseY: 4.2, zIdx: 7, mouth: 'happy' },
  { size: 44, color: ['#fb7185', '#f43f5e'], x: 20, y: 80, speed: 0.55, floatAmp: 32, phaseX: 4.2, phaseY: 0.3, zIdx: 6, mouth: 'happy' },
  { size: 68, color: ['#67e8f9', '#22d3ee'], x: 32, y: 86, speed: 0.36, floatAmp: 20, phaseX: 2.9, phaseY: 2.7, zIdx: 8, mouth: 'excited' },
]

const EYE_SCLERA_FRAC = 0.18
const EYE_PUPIL_FRAC = 0.069
const EYE_SEP_FRAC = 0.25
const EYE_Y_FRAC = 0.075

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function mixRgb(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  }
}

function hash2D(x, y, s) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + s * 0.001) * 43758.5453
  return n - Math.floor(n)
}

function noise2D(x, y, s) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash2D(x0, y0, s)
  const b = hash2D(x0 + 1, y0, s)
  const c = hash2D(x0, y0 + 1, s)
  const d = hash2D(x0 + 1, y0 + 1, s)
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
}

function fbm(x, y, seed) {
  let v = 0
  let a = 0.5
  let xf = x
  let yf = y
  for (let i = 0; i < 4; i++) {
    v += a * noise2D(xf, yf, seed + i * 31)
    xf *= 2
    yf *= 2
    a *= 0.5
  }
  return v
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function createGrainTexture(renderer) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const i = (py * size + px) * 4
      const v = 90 + hash2D(px, py, 404) * 125
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 5)
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
  return tex
}

function createStonePlanetMap(c1, c2, seed, renderer) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  const A = hexToRgb(c1)
  const B = hexToRgb(c2)
  const mid = mixRgb(A, B, 0.5)
  const deep = {
    r: Math.round(mid.r * 0.22 + 18),
    g: Math.round(mid.g * 0.2 + 16),
    b: Math.round(mid.b * 0.22 + 20),
  }
  const charcoal = {
    r: Math.round((A.r + B.r) * 0.12 + 22),
    g: Math.round((A.g + B.g) * 0.11 + 20),
    b: Math.round((A.b + B.b) * 0.12 + 24),
  }

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = px / size
      const v = py / size
      const x = u * 5.5 + seed * 0.001
      const y = v * 5.5

      const n0 = fbm(x, y, seed)
      const n1 = fbm(x * 2.1 + 1.7, y * 2.1 - 0.8, seed + 19)
      const n2 = fbm(x * 4 + n1 * 1.8, y * 4 - n0 * 1.2, seed + 47)
      const warpX = x - n1 * 1.4 + n0 * 0.6
      const warpY = y + n0 * 1.3 - n2 * 0.5
      const macro = fbm(warpX, warpY, seed + 61)
      const meso = fbm(warpX * 3.2, warpY * 3.2, seed + 73) * 0.35
      const micro = fbm(warpX * 11, warpY * 11, seed + 89) * 0.12
      let t = macro * 0.62 + meso + micro + n2 * 0.08
      t = Math.min(1, Math.max(0, t))

      let c
      if (t < 0.4) c = mixRgb(A, B, t / 0.4)
      else if (t < 0.72) c = mixRgb(B, mid, (t - 0.4) / 0.32)
      else c = mixRgb(mid, A, (t - 0.72) / 0.28)

      const patchField = fbm(x * 0.85 + 20, y * 0.85 - 12, seed + 101)
      const patch = smoothstep(0.38, 0.62, patchField)
      const patchDeep = smoothstep(0.52, 0.78, fbm(x * 1.2, y * 1.2, seed + 131))
      c = mixRgb(c, charcoal, patch * 0.58)
      c = mixRgb(c, deep, patchDeep * 0.45)

      const grain = (hash2D(px * 0.31, py * 0.29, seed + 888) - 0.5) * 32
      const speck = hash2D(px + seed, py * 1.7, 777) > 0.992 ? -20 : 0
      const i = (py * size + px) * 4
      img.data[i] = Math.min(255, Math.max(0, c.r + grain + speck))
      img.data[i + 1] = Math.min(255, Math.max(0, c.g + grain + speck))
      img.data[i + 2] = Math.min(255, Math.max(0, c.b + grain + speck))
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
  return tex
}

function pixelCenterToWorld(cx, cy, W, H, camera) {
  const vFov = (camera.fov * Math.PI) / 180
  const dist = camera.position.z
  const halfH = Math.tan(vFov / 2) * dist
  const halfW = halfH * (W / H)
  const wx = (cx / W - 0.5) * 2 * halfW
  const wy = -(cy / H - 0.5) * 2 * halfH
  return { wx, wy, halfW }
}

function radiusWorldFromPixels(sizePx, W, halfW) {
  return (sizePx / W) * halfW
}

export default function FloatingSpheres() {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const smoothRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const scrollRef = useRef(0)
  const rafRef = useRef(null)
  const ballsRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const lerp = (a, b, f) => a + (b - a) * f
    let W = window.innerWidth
    let H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 120)
    camera.position.set(0, 0, 26)
    camera.lookAt(0, 0, 0)

    const keyDir = new THREE.DirectionalLight(0xfffdfb, 3.2)
    keyDir.position.set(9, 15, 11)
    scene.add(keyDir)

    const fillPt = new THREE.PointLight(0xdbeafe, 0.65, 100)
    fillPt.position.set(-11, 3, 8)
    scene.add(fillPt)

    const rimPt = new THREE.PointLight(0xffedd5, 0.52, 90)
    rimPt.position.set(5, -5, 9)
    scene.add(rimPt)

    const hemi = new THREE.HemisphereLight(0xfff7ed, 0xa8b8cf, 0.52)
    scene.add(hemi)

    const v3 = new THREE.Vector3()
    const v3b = new THREE.Vector3()

    const scleraMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    })
    const pupilMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6,
    })
    const eyeRimMat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    })

    const sharedGrain = createGrainTexture(renderer)

    ballsRef.current = SPHERES.map((cfg, index) => {
      const marbleMap = createStonePlanetMap(cfg.color[0], cfg.color[1], index * 997 + 13, renderer)

      const { halfW } = pixelCenterToWorld(W / 2, H / 2, W, H, camera)
      const r0 = radiusWorldFromPixels(cfg.size, W, halfW)

      const mat = new THREE.MeshPhysicalMaterial({
        map: marbleMap,
        roughness: 0.48,
        roughnessMap: sharedGrain,
        metalness: 0.1,
        bumpMap: sharedGrain,
        bumpScale: 0.04,
        clearcoat: 0.5,
        clearcoatRoughness: 0.22,
        envMapIntensity: 0,
        sheen: 0.32,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color(cfg.color[0]),
      })

      const geo = new THREE.SphereGeometry(r0, 48, 48)
      const sphereMesh = new THREE.Mesh(geo, mat)

      const auraGeo = new THREE.SphereGeometry(r0 * 1.14, 24, 24)
      const auraCol = new THREE.Color(cfg.color[0])
      auraCol.lerp(new THREE.Color(0xfff7ed), 0.35)
      const auraMat = new THREE.MeshBasicMaterial({
        color: auraCol,
        transparent: true,
        opacity: 0.17,
        depthWrite: false,
      })
      const auraMesh = new THREE.Mesh(auraGeo, auraMat)
      auraMesh.renderOrder = -1

      const ballGroup = new THREE.Group()
      ballGroup.add(auraMesh)
      ballGroup.add(sphereMesh)
      ballGroup.position.z = -cfg.zIdx * 0.12
      scene.add(ballGroup)

      const faceGroup = new THREE.Group()
      faceGroup.renderOrder = 4
      scene.add(faceGroup)

      const scleraR = r0 * EYE_SCLERA_FRAC
      const pupilRadius = r0 * EYE_PUPIL_FRAC
      const sep = r0 * EYE_SEP_FRAC
      const eyeY = r0 * EYE_Y_FRAC
      const segs = 40

      const rimGeoL = new THREE.RingGeometry(scleraR * 0.94, scleraR * 1.12, segs)
      const rimGeoR = new THREE.RingGeometry(scleraR * 0.94, scleraR * 1.12, segs)
      const scleraGeoL = new THREE.CircleGeometry(scleraR, segs)
      const scleraGeoR = new THREE.CircleGeometry(scleraR, segs)
      const pupilGeoL = new THREE.CircleGeometry(pupilRadius, 28)
      const pupilGeoR = new THREE.CircleGeometry(pupilRadius, 28)

      const eyeLGroup = new THREE.Group()
      eyeLGroup.position.set(-sep, eyeY, 0.01)
      const rimL = new THREE.Mesh(rimGeoL, eyeRimMat)
      rimL.position.z = -0.001
      rimL.renderOrder = 4
      const scleraL = new THREE.Mesh(scleraGeoL, scleraMat)
      scleraL.renderOrder = 5
      const pupilL = new THREE.Mesh(pupilGeoL, pupilMat)
      pupilL.position.z = 0.02
      pupilL.renderOrder = 6
      eyeLGroup.add(rimL)
      eyeLGroup.add(scleraL)
      eyeLGroup.add(pupilL)
      faceGroup.add(eyeLGroup)

      const eyeRGroup = new THREE.Group()
      eyeRGroup.position.set(sep, eyeY, 0.01)
      const rimR = new THREE.Mesh(rimGeoR, eyeRimMat)
      rimR.position.z = -0.001
      rimR.renderOrder = 4
      const scleraRMesh = new THREE.Mesh(scleraGeoR, scleraMat)
      scleraRMesh.renderOrder = 5
      const pupilR = new THREE.Mesh(pupilGeoR, pupilMat)
      pupilR.position.z = 0.02
      pupilR.renderOrder = 6
      eyeRGroup.add(rimR)
      eyeRGroup.add(scleraRMesh)
      eyeRGroup.add(pupilR)
      faceGroup.add(eyeRGroup)

      let mouthMesh
      if (cfg.mouth === 'happy') {
        const tor = new THREE.TorusGeometry(r0 * 0.15, r0 * 0.024, 8, 20, Math.PI)
        mouthMesh = new THREE.Mesh(tor, pupilMat)
        mouthMesh.rotation.z = Math.PI
        mouthMesh.position.set(0, -r0 * 0.11, 0.018)
      } else {
        const circ = new THREE.CircleGeometry(r0 * 0.1, 28)
        mouthMesh = new THREE.Mesh(circ, pupilMat)
        mouthMesh.position.set(0, -r0 * 0.13, 0.018)
      }
      mouthMesh.renderOrder = 6
      faceGroup.add(mouthMesh)

      return {
        ballGroup,
        sphereMesh,
        auraMesh,
        faceGroup,
        eyeLGroup,
        eyeRGroup,
        pupilL,
        pupilR,
        mouthMesh,
        rimGeoL,
        rimGeoR,
        scleraGeoL,
        scleraGeoR,
        pupilGeoL,
        pupilGeoR,
        cfg,
        r0,
        _curScale: 1,
        _prevX: 0,
        _prevY: 0,
        _excited: false,
      }
    })

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight)
      scrollRef.current = Math.min(1, window.scrollY / max)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })

    let t = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      t += 0.012

      smoothRef.current.x = lerp(smoothRef.current.x, mouseRef.current.x, 0.08)
      smoothRef.current.y = lerp(smoothRef.current.y, mouseRef.current.y, 0.08)

      W = window.innerWidth
      H = window.innerHeight
      const sm = smoothRef.current
      const scrollP = scrollRef.current

      if (container) {
        container.style.opacity = `${1 - scrollP * 0.25}`
      }

      ballsRef.current.forEach((b) => {
        const { ballGroup, sphereMesh, auraMesh, faceGroup, eyeLGroup, eyeRGroup, pupilL, pupilR, mouthMesh, cfg, r0 } = b
        const baseX = (cfg.x / 100) * W
        const baseY = (cfg.y / 100) * H

        const floatX = Math.sin(t * cfg.speed + cfg.phaseX) * cfg.floatAmp
        const floatY = Math.cos(t * cfg.speed * 0.7 + cfg.phaseY) * cfg.floatAmp * 0.8

        let cx = baseX + floatX
        let cy = baseY + floatY - scrollP * (20 + cfg.size * 0.12)

        const dx = cx + cfg.size / 2 - sm.x
        const dy = cy + cfg.size / 2 - sm.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repR = cfg.size * 1.8
        let scaleTarget = 1
        let tiltX = 0
        let tiltY = 0

        if (dist < repR && dist > 1) {
          const f = 1 - dist / repR
          cx += (dx / dist) * f * 55
          cy += (dy / dist) * f * 55
          scaleTarget = 1 + f * 0.12
          tiltY = -(dx / dist) * f * 16
          tiltX = (dy / dist) * f * 16

          if (f > 0.5 && !b._excited) b._excited = true
          else if (f <= 0.5 && b._excited) b._excited = false
        } else if (b._excited) {
          b._excited = false
        }

        b._curScale = lerp(b._curScale, scaleTarget, 0.1)

        const velX = cx - b._prevX
        const velY = cy - b._prevY
        const spd = Math.sqrt(velX * velX + velY * velY)
        const sqX = 1 + spd * 0.014
        const sqY = 1 - spd * 0.009

        b._prevX = cx
        b._prevY = cy

        const centerPxX = cx + cfg.size / 2
        const centerPxY = cy + cfg.size / 2
        const { wx, wy, halfW } = pixelCenterToWorld(centerPxX, centerPxY, W, H, camera)
        const rWorld = radiusWorldFromPixels(cfg.size, W, halfW)

        ballGroup.position.set(wx, wy, ballGroup.position.z)
        const sc = b._curScale
        ballGroup.scale.set(sc * sqX, sc * sqY, sc)

        const rScale = rWorld / r0
        sphereMesh.scale.setScalar(rScale)
        auraMesh.scale.setScalar(rScale * 1.14)
        auraMesh.material.opacity = 0.12 + (1 - scrollP) * 0.22

        ballGroup.rotation.x = THREE.MathUtils.degToRad(tiltX)
        ballGroup.rotation.y = THREE.MathUtils.degToRad(tiltY)

        const eyeScale = b._excited ? 1.28 : 1
        const s = rScale * eyeScale
        eyeLGroup.scale.set(s, s, s)
        eyeRGroup.scale.set(s, s, s)

        sphereMesh.getWorldPosition(v3)
        v3b.copy(camera.position).sub(v3).normalize()
        const faceDist = rWorld * 0.99
        faceGroup.position.copy(v3).addScaledVector(v3b, faceDist)
        
        // Make face group always face camera but keep eyes upright
        faceGroup.lookAt(camera.position)
        // Reset the roll to keep eyes upright
        const euler = new THREE.Euler()
        euler.setFromQuaternion(faceGroup.quaternion)
        euler.z = 0
        faceGroup.quaternion.setFromEuler(euler)

        const eyeCX = cx + cfg.size / 2
        const eyeCY = cy + cfg.size * 0.46
        const mdx = sm.x - eyeCX
        const mdy = sm.y - eyeCY
        const mag = Math.max(1, Math.sqrt(mdx * mdx + mdy * mdy))
        const nx = mdx / mag
        const ny = mdy / mag

        const scleraRad = r0 * EYE_SCLERA_FRAC
        const pupilRad = r0 * EYE_PUPIL_FRAC
        const maxPupilTravel = Math.max(0.0005, (scleraRad - pupilRad - r0 * 0.01) * 0.9)
        let px = nx * maxPupilTravel
        let py = -ny * maxPupilTravel
        const d = Math.hypot(px, py)
        if (d > maxPupilTravel && d > 1e-6) {
          px *= maxPupilTravel / d
          py *= maxPupilTravel / d
        }
        pupilL.position.x = px
        pupilL.position.y = py
        pupilR.position.x = px
        pupilR.position.y = py

        mouthMesh.scale.set(s, s, s)
        const mouthY = (cfg.mouth === 'happy' ? -r0 * 0.11 : -r0 * 0.13) * rScale
        mouthMesh.position.set(0, mouthY, 0.018)
      })

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)

      ballsRef.current.forEach((b) => {
        b.auraMesh.geometry.dispose()
        b.auraMesh.material.dispose()
        b.sphereMesh.geometry.dispose()
        const m = b.sphereMesh.material
        m.map?.dispose()
        m.roughnessMap = null
        m.bumpMap = null
        m.dispose()
        b.rimGeoL.dispose()
        b.rimGeoR.dispose()
        b.scleraGeoL.dispose()
        b.scleraGeoR.dispose()
        b.pupilGeoL.dispose()
        b.pupilGeoR.dispose()
        b.mouthMesh.geometry.dispose()
        scene.remove(b.ballGroup)
        scene.remove(b.faceGroup)
      })

      sharedGrain.dispose()

      scleraMat.dispose()
      pupilMat.dispose()
      eyeRimMat.dispose()

      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
}
