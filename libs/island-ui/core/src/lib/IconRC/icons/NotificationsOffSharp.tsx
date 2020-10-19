import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgNotificationsOffSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="notifications-off-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M41.37 64l22.628-22.628L470.627 448l-22.628 22.627zM256 480a80.09 80.09 0 0073.3-48H182.7a80.09 80.09 0 0073.3 48zM112 227.47V288l-48 64v48h268.12L115.87 183.75a236.75 236.75 0 00-3.87 43.72zM448 352l-48-64v-60.53C400 157 372.64 95.61 304 80l-8-48h-80l-8 48a117.45 117.45 0 00-41.95 18.17l282 282z" />
    </svg>
  )
}

export default SvgNotificationsOffSharp
