import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgColorWandSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="color-wand-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M133.441 200.647l67.197-67.196 78.142 78.142-67.196 67.196zM301.41 234.21l-67.19 67.2L412 480l68-68-178.59-177.79zM32 176h80v32H32zm35.624-85.75l22.627-22.628 56.569 56.569-22.627 22.627zM176 32h32v80h-32zm61.32 92.195l56.569-56.569 22.627 22.627-56.569 56.569zM67.62 293.887l56.569-56.569 22.627 22.627-56.569 56.569z" />
    </svg>
  )
}

export default SvgColorWandSharp
