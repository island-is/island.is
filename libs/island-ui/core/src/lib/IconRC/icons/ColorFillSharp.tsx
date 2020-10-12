import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgColorFillSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="color-fill-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M416 320s-64 48-64 99.84c0 33.28 28.67 60.16 64 60.16s64-27 64-60.16C480 368 416 320 416 320zM144 32l-76 76 70 70L32 280l176 184 152.8-148.3L416 304zm24 116l-39.6-41 15.88-15.89L184 132z" />
    </svg>
  )
}

export default SvgColorFillSharp
