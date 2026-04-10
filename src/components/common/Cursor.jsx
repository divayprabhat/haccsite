import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const ring = document.getElementById('cursor-ring')
    const dot = document.getElementById('cursor-dot')
    const trailEls = Array.from(document.querySelectorAll('.cursor-trail-dot'))
    if (!ring || !dot || trailEls.length === 0) return

    let rx = 0, ry = 0
    let mx = 0, my = 0
    const trail = trailEls.map(() => ({ x: 0, y: 0 }))

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top = my + 'px'
    }

    const onDown = () => ring.classList.add('clicking')
    const onUp = () => ring.classList.remove('clicking')

    const onOver = (e) => {
      const el = e.target.closest('button, a, [data-cursor="pointer"], input, textarea, [role="button"], select')
      if (el) ring.classList.add('hovering')
      else ring.classList.remove('hovering')
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)

    let raf
    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      rx = lerp(rx, mx, 0.12)
      ry = lerp(ry, my, 0.12)
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'

      trail[0].x = lerp(trail[0].x, mx, 0.28)
      trail[0].y = lerp(trail[0].y, my, 0.28)
      for (let i = 1; i < trail.length; i++) {
        trail[i].x = lerp(trail[i].x, trail[i - 1].x, 0.3)
        trail[i].y = lerp(trail[i].y, trail[i - 1].y, 0.3)
      }
      trailEls.forEach((el, i) => {
        el.style.left = trail[i].x + 'px'
        el.style.top = trail[i].y + 'px'
        el.style.opacity = `${Math.max(0.08, 0.32 - i * 0.035)}`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="cursor-trail-dot" />
      ))}
      <div id="cursor-ring" />
      <div id="cursor-dot" />
    </>
  )
}
