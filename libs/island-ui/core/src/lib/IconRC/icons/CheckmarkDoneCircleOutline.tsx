import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCheckmarkDoneCircleOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="checkmark-done-circle-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M368 192L256.13 320l-47.95-48m-16.23 48L144 272m161.71-80l-51.55 59"
      />
    </svg>
  )
}

export default SvgCheckmarkDoneCircleOutline
