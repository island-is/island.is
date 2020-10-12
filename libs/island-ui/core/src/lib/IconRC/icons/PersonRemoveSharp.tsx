import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgPersonRemoveSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="person-remove-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 214h144v36H16z" />
      <circle cx={288} cy={144} r={112} />
      <path d="M288 288c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z" />
    </svg>
  )
}

export default SvgPersonRemoveSharp
