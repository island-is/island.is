import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgRemoveSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="remove-sharp_svg__ionicon"
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
        strokeWidth={32}
        d="M400 256H112"
      />
    </svg>
  )
}

export default SvgRemoveSharp
