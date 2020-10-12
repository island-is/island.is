import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgLogoHackernews({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="logo-hackernews_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M32 32v448h448V32zm249.67 250.83v84H235v-84l-77-140h55l46.32 97.54 44.33-97.54h52.73z" />
    </svg>
  )
}

export default SvgLogoHackernews
