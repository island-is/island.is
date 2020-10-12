import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgFunnelSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="funnel-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M0 48l192 240v128l128 48V288L512 48H0z" />
    </svg>
  )
}

export default SvgFunnelSharp
