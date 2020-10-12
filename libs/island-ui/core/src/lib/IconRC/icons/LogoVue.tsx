import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgLogoVue({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="logo-vue_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 144.03l-55.49-96.11h-79.43L256 281.61 390.92 47.92h-79.43L256 144.03z" />
      <path d="M409.4 47.92L256 313.61 102.6 47.92H15.74L256 464.08 496.26 47.92H409.4z" />
    </svg>
  )
}

export default SvgLogoVue
