import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgScanSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="scan-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M388 466h-68v-44h68a34 34 0 0034-34v-68h44v68a78.09 78.09 0 01-78 78zm78-274h-44v-68a34 34 0 00-34-34h-68V46h68a78.09 78.09 0 0178 78zM192 466h-68a78.09 78.09 0 01-78-78v-68h44v68a34 34 0 0034 34h68zM90 192H46v-68a78.09 78.09 0 0178-78h68v44h-68a34 34 0 00-34 34z" />
    </svg>
  )
}

export default SvgScanSharp
