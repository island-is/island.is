import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgFolderSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="folder-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 420a28 28 0 0028 28h424a28 28 0 0028-28V208H16zm480-296a28 28 0 00-28-28H212.84l-48-32H44a28 28 0 00-28 28v84h480z" />
    </svg>
  )
}

export default SvgFolderSharp
