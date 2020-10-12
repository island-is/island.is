import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgPricetagsSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="pricetags-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M288 16L0 304l176 176 288-288V16zm80 128a32 32 0 1132-32 32 32 0 01-32 32z" />
      <path d="M480 64v144L216.9 471.1 242 496l270-272V64h-32z" />
    </svg>
  )
}

export default SvgPricetagsSharp
