import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCheckmarkDoneOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="checkmark-done-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M464 128L240 384l-96-96m0 96l-96-96m320-160L232 284"
      />
    </svg>
  )
}

export default SvgCheckmarkDoneOutline
