import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCartSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="cart-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle cx={176} cy={416} r={32} />
      <circle cx={400} cy={416} r={32} />
      <path d="M167.78 304h261.34l38.4-192H133.89l-8.47-48H32v32h66.58l48 272H432v-32H173.42l-5.64-32z" />
    </svg>
  )
}

export default SvgCartSharp
