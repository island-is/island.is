import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgReorderFourOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="reorder-four-outline_svg__ionicon"
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
        d="M96 304h320M96 208h320M96 112h320M96 400h320"
      />
    </svg>
  )
}

export default SvgReorderFourOutline
