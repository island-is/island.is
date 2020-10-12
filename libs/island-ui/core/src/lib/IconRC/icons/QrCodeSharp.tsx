import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgQrCodeSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="qr-code-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M336 336h80v80h-80zm-64-64h64v64h-64zm144 144h64v64h-64zm16-144h48v48h-48zM272 432h48v48h-48zm64-336h80v80h-80z" />
      <path d="M480 240H272V32h208zm-164-44h120V76H316zM96 96h80v80H96z" />
      <path d="M240 240H32V32h208zM76 196h120V76H76zm20 140h80v80H96z" />
      <path d="M240 480H32V272h208zM76 436h120V316H76z" />
    </svg>
  )
}

export default SvgQrCodeSharp
