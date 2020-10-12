import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgGitCompareSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="git-compare-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M209 384h-37a28 28 0 01-28-28V152a64 64 0 10-64-1.16V356a92.1 92.1 0 0092 92h37v55.21L294.39 416 209 328.79zM113 64a32 32 0 11-32 32 32 32 0 0132-32zm319 296.61V156a92.1 92.1 0 00-92-92h-35V9.93L217.14 96 305 182.07V128h35a28 28 0 0128 28v204.61a64 64 0 1064 0zM400 448a32 32 0 1132-32 32 32 0 01-32 32z" />
    </svg>
  )
}

export default SvgGitCompareSharp
