import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgLogoVercel({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="logo-vercel_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path fillRule="evenodd" d="M256 48l240 416H16z" />
    </svg>
  )
}

export default SvgLogoVercel
