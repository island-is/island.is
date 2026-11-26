import { useEffect, useRef } from 'react'

export const SCALE_ICON_ID = 'scale-animated-icon'

const DURATION = 1400
const TILTS = [0, 8, -6, 3, 0]
const PIVOT_TO_PAN = 5.97

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

const tiltAt = (progress: number) => {
  const segments = TILTS.length - 1
  const position = Math.min(progress, 1) * segments
  const index = Math.min(Math.floor(position), segments - 1)
  const local = easeInOut(position - index)
  return TILTS[index] + (TILTS[index + 1] - TILTS[index]) * local
}

export default function Scale() {
  const svgRef = useRef<SVGSVGElement>(null)
  const beamRef = useRef<SVGGElement>(null)
  const leftPanRef = useRef<SVGGElement>(null)
  const rightPanRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    let frame = 0

    const render = (deg: number) => {
      const drop = PIVOT_TO_PAN * Math.sin((deg * Math.PI) / 180)
      beamRef.current?.setAttribute('transform', `rotate(${deg})`)
      leftPanRef.current?.setAttribute('transform', `translate(0 ${-drop})`)
      rightPanRef.current?.setAttribute('transform', `translate(0 ${drop})`)
    }

    const play = () => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return
      }
      cancelAnimationFrame(frame)
      const start = performance.now()
      const step = (now: number) => {
        const progress = (now - start) / DURATION
        render(tiltAt(progress))
        if (progress < 1) {
          frame = requestAnimationFrame(step)
        }
      }
      frame = requestAnimationFrame(step)
    }

    svg.style.cursor = 'pointer'
    svg.addEventListener('click', play)
    return () => {
      cancelAnimationFrame(frame)
      svg.removeEventListener('click', play)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      id={SCALE_ICON_ID}
      viewBox="-4 -4 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <g
        transform="translate(0.796 2.388)"
        stroke="#0061ff"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.2 0.86V4.04" />
        <g transform="translate(11.2 4.04)">
          <g ref={beamRef}>
            <path d="M-8.75 0H8.76" />
          </g>
        </g>
        <g ref={leftPanRef}>
          <path d="M0.86 13.89 5.23 4.04 9.61 13.89M0.86 13.89H9.61A4.375 4.375 0 0 1 0.86 13.89" />
        </g>
        <g ref={rightPanRef}>
          <path d="M12.8 13.89 17.17 4.04 21.55 13.89M12.8 13.89H21.55A4.375 4.375 0 0 1 12.8 13.89" />
        </g>
      </g>
    </svg>
  )
}
