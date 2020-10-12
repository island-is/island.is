import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgLocateSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="locate-sharp_svg__ionicon"
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
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth={48}
        d="M256 96V56m0 400v-40m0-304a144 144 0 10144 144 144 144 0 00-144-144zm160 144h40m-400 0h40"
      />
    </svg>
  )
}

export default SvgLocateSharp
