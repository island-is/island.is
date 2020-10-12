import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgFolderSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="folder-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 420a28 28 0 0028 28h424a28 28 0 0028-28V208H16zm480-296a28 28 0 00-28-28H212.84l-48-32H44a28 28 0 00-28 28v84h480z" />
    </svg>
  )
}

export default SvgFolderSharp
