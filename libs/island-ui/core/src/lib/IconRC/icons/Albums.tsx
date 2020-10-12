import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgAlbums({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="albums_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M368 96H144a16 16 0 010-32h224a16 16 0 010 32zm32 48H112a16 16 0 010-32h288a16 16 0 010 32zm19.13 304H92.87A44.92 44.92 0 0148 403.13V204.87A44.92 44.92 0 0192.87 160h326.26A44.92 44.92 0 01464 204.87v198.26A44.92 44.92 0 01419.13 448z" />
    </svg>
  )
}

export default SvgAlbums
