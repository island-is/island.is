import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgShareSocialSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="share-social-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M378 324a69.78 69.78 0 00-48.83 19.91L202 272.41a69.68 69.68 0 000-32.82l127.13-71.5A69.76 69.76 0 10308.87 129l-130.13 73.2a70 70 0 100 107.56L308.87 383A70 70 0 10378 324z" />
    </svg>
  )
}

export default SvgShareSocialSharp
