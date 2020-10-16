import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgFemaleSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="female-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M430 190c0-95.94-78.06-174-174-174S82 94.06 82 190c0 88.49 66.4 161.77 152 172.61V394h-58v44h58v58h44v-58h58v-44h-58v-31.39c85.6-10.84 152-84.12 152-172.61zm-304 0c0-71.68 58.32-130 130-130s130 58.32 130 130-58.32 130-130 130-130-58.32-130-130z" />
    </svg>
  )
}

export default SvgFemaleSharp
