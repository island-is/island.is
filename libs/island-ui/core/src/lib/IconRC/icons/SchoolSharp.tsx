import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgSchoolSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="school-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 370.43L96 279v98.42l160 88.88 160-88.88V279l-160 91.43z" />
      <path d="M512.25 192L256 45.57-.25 192 256 338.43l208-118.86V384h48V192.14l.25-.14z" />
    </svg>
  )
}

export default SvgSchoolSharp
