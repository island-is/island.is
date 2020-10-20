import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgDesktop = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="desktop_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 352a48.05 48.05 0 0048 48h133.88l-4 32H144a16 16 0 000 32h224a16 16 0 000-32h-49.88l-4-32H448a48.05 48.05 0 0048-48v-48H16zm240-16a16 16 0 11-16 16 16 16 0 0116-16zM496 96a48.05 48.05 0 00-48-48H64a48.05 48.05 0 00-48 48v192h480z" />
    </svg>
  )
}

export default SvgDesktop
