import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgTimerSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="timer-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 48C141.12 48 48 141.12 48 256s93.12 208 208 208 208-93.12 208-208S370.88 48 256 48zm0 384c-97 0-176-78.95-176-176a174.55 174.55 0 0153.87-126.72L279 233l-19 30-125-91c-13 23-26.7 46-26.7 84 0 81.44 66.26 147.7 147.7 147.7S403.7 337.44 403.7 256c0-76.67-58.72-139.88-133.55-147v55h-28.3V79.89c4.24.07 8.94.11 14.15.11 97.05 0 176 79 176 176s-78.95 176-176 176z" />
    </svg>
  )
}

export default SvgTimerSharp
