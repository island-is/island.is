import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgCaretBackSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="caret-back-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M368 64L144 256l224 192V64z" />
    </svg>
  )
}

export default SvgCaretBackSharp
