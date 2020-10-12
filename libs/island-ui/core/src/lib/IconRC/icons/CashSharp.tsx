import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCashSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="cash-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M48 368h416v32H48zm32 48h352v32H80zm400-240a96.11 96.11 0 01-96-96V64H128v16a96.11 96.11 0 01-96 96H16v64h16a96.11 96.11 0 0196 96v16h256v-16a96.11 96.11 0 0196-96h16v-64zM256 304a96 96 0 1196-96 96.11 96.11 0 01-96 96z" />
      <path d="M96 80V64H16v80h16a64.07 64.07 0 0064-64zM32 272H16v80h80v-16a64.07 64.07 0 00-64-64zm448-128h16V64h-80v16a64.07 64.07 0 0064 64zm-64 192v16h80v-80h-16a64.07 64.07 0 00-64 64z" />
      <circle cx={256} cy={208} r={64} />
    </svg>
  )
}

export default SvgCashSharp
