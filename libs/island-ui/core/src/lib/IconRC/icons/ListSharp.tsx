import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgListSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="list-sharp_svg__ionicon"
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
        strokeLinejoin="round"
        strokeWidth={48}
        d="M144 144h320M144 256h320M144 368h320"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M64 128h32v32H64zm0 112h32v32H64zm0 112h32v32H64z"
      />
    </svg>
  )
}

export default SvgListSharp
