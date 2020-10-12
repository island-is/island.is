import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCopy({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="copy_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M408 480H184a72 72 0 01-72-72V184a72 72 0 0172-72h224a72 72 0 0172 72v224a72 72 0 01-72 72z" />
      <path d="M160 80h235.88A72.12 72.12 0 00328 32H104a72 72 0 00-72 72v224a72.12 72.12 0 0048 67.88V160a80 80 0 0180-80z" />
    </svg>
  )
}

export default SvgCopy
