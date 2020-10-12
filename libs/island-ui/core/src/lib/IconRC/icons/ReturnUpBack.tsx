import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgReturnUpBack({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="return-up-back_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M112 160l-64 64 64 64"
      />
      <path
        d="M64 224h294c58.76 0 106 49.33 106 108v20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgReturnUpBack
