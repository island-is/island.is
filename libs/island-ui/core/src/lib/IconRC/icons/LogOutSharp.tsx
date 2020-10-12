import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgLogOutSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="log-out-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M160 240h160V96a16 16 0 00-16-16H64a16 16 0 00-16 16v320a16 16 0 0016 16h240a16 16 0 0016-16V272H160zm299.31 4.69L368 153.37 345.37 176l64 64H320v32h89.37l-64 64L368 358.63l91.31-91.32a16 16 0 000-22.62z" />
    </svg>
  )
}

export default SvgLogOutSharp
