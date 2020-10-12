import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgInvertModeSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="invert-mode-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M414.39 97.61A224 224 0 1097.61 414.39 224 224 0 10414.39 97.61zM256 432v-96a80 80 0 010-160V80c97.05 0 176 79 176 176s-78.95 176-176 176z" />
      <path d="M336 256a80 80 0 00-80-80v160a80 80 0 0080-80z" />
    </svg>
  )
}

export default SvgInvertModeSharp
