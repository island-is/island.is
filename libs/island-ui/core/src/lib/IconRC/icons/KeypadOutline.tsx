import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgKeypadOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="keypad-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx={256}
        cy={448}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={256}
        cy={320}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        d="M288 192a32 32 0 11-32-32 32 32 0 0132 32z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={256}
        cy={64}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={384}
        cy={320}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={384}
        cy={192}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={384}
        cy={64}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={128}
        cy={320}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={128}
        cy={192}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={128}
        cy={64}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgKeypadOutline
