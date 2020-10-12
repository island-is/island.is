import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgReorderFourSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="reorder-four-sharp_svg__ionicon"
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
        strokeWidth={44}
        d="M102 304h308m-308-96h308m-308-96h308M102 400h308"
      />
    </svg>
  )
}

export default SvgReorderFourSharp
