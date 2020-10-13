import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgOpenSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="open-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M201.37 288l176-176H48v352h352V134.63l-176 176L201.37 288z" />
      <path d="M320 48v32h89.37l-32 32L400 134.63l32-32V192h32V48H320z" />
    </svg>
  )
}

export default SvgOpenSharp
