import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBriefcaseSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="briefcase-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M336 288H176v-32H16v196a12 12 0 0012 12h456a12 12 0 0012-12V256H336zm160-164a12 12 0 00-12-12H384V56a8 8 0 00-8-8H136a8 8 0 00-8 8v56H28a12 12 0 00-12 12v100h480zm-152-12H168V88h176z" />
    </svg>
  )
}

export default SvgBriefcaseSharp
