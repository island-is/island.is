import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgGitCommitSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="git-commit-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M480 224H380a128 128 0 00-247.9 0H32v64h100.05A128 128 0 00380 288h100zm-224 96a64 64 0 1164-64 64.07 64.07 0 01-64 64z" />
    </svg>
  )
}

export default SvgGitCommitSharp
