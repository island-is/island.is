import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgLogoAngular({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="logo-angular_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M213.57 256h84.85l-42.43-89.36L213.57 256z" />
      <path d="M256 32L32 112l46.12 272L256 480l177.75-96L480 112zm88 320l-26.59-56H194.58L168 352h-40L256 72l128 280z" />
    </svg>
  )
}

export default SvgLogoAngular
