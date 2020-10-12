import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCaretUpSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="caret-up-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M448 368L256 144 64 368h384z" />
    </svg>
  )
}

export default SvgCaretUpSharp
