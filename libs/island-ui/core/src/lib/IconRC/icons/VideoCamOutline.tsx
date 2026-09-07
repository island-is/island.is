import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgVideoCamOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="video-cam-outline_svg__ionicon"
      aria-labelledby={titleId}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M14.2969 11.4688L11.7122 9.6494C11.6466 9.60327 11.5932 9.54205 11.5562 9.47091C11.5193 9.39978 11.5 9.3208 11.5 9.24065V6.7594C11.5 6.67925 11.5193 6.60028 11.5562 6.52914C11.5932 6.45801 11.6466 6.39679 11.7122 6.35065L14.2969 4.53128C14.373 4.49743 14.4564 4.48315 14.5394 4.48972C14.6225 4.49629 14.7026 4.5235 14.7724 4.5689C14.8423 4.61429 14.8997 4.67642 14.9394 4.74963C14.9792 4.82285 15 4.90484 15 4.98815V11.0119C15 11.0952 14.9792 11.1772 14.9394 11.2504C14.8997 11.3236 14.8423 11.3858 14.7724 11.4312C14.7026 11.4766 14.6225 11.5038 14.5394 11.5103C14.4564 11.5169 14.373 11.5026 14.2969 11.4688Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.375 12H2.625C2.1944 11.9988 1.7818 11.8272 1.47732 11.5227C1.17284 11.2182 1.00124 10.8056 1 10.375V5.625C1.00124 5.1944 1.17284 4.7818 1.47732 4.47732C1.7818 4.17284 2.1944 4.00124 2.625 4H8.39C8.81659 4.00132 9.22534 4.17137 9.52699 4.47301C9.82863 4.77466 9.99868 5.18341 10 5.61V10.375C9.99876 10.8056 9.82716 11.2182 9.52268 11.5227C9.2182 11.8272 8.8056 11.9988 8.375 12Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
      />
    </svg>
  )
}

export default SvgVideoCamOutline
