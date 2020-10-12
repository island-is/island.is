import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgRadio({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="radio_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle cx={256} cy={256} r={36} />
      <path d="M190.24 341.77a22 22 0 01-16.46-7.38 118 118 0 010-156.76 22 22 0 1132.87 29.24 74 74 0 000 98.29 22 22 0 01-16.43 36.61zm131.52 0a22 22 0 01-16.43-36.61 74 74 0 000-98.29 22 22 0 1132.87-29.24 118 118 0 010 156.76 22 22 0 01-16.44 7.38z" />
      <path d="M139.29 392.72a21.92 21.92 0 01-16.08-7 190 190 0 010-259.49 22 22 0 1132.13 30.06 146 146 0 000 199.38 22 22 0 01-16.06 37zm233.42 0a22 22 0 01-16.06-37 146 146 0 000-199.38 22 22 0 1132.13-30.06 190 190 0 010 259.49 21.92 21.92 0 01-16.07 6.95z" />
      <path d="M429 438a22 22 0 01-16.39-36.67 218.34 218.34 0 000-290.66 22 22 0 0132.78-29.34 262.34 262.34 0 010 349.34A22 22 0 01429 438zm-346 0a21.94 21.94 0 01-16.41-7.33 262.34 262.34 0 010-349.34 22 22 0 0132.78 29.34 218.34 218.34 0 000 290.66A22 22 0 0183 438z" />
    </svg>
  )
}

export default SvgRadio
