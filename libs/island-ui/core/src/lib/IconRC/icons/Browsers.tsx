import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBrowsers({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="browsers_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M416 48H96a64 64 0 00-64 64v288a64 64 0 0064 64h320a64 64 0 0064-64V112a64 64 0 00-64-64zm24 96H72a8 8 0 01-8-8v-24a32.09 32.09 0 0132-32h320a32.09 32.09 0 0132 32v24a8 8 0 01-8 8z" />
    </svg>
  )
}

export default SvgBrowsers
