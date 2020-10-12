import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgQrCodeOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="qr-code-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect x={336} y={336} width={80} height={80} rx={8} ry={8} />
      <rect x={272} y={272} width={64} height={64} rx={8} ry={8} />
      <rect x={416} y={416} width={64} height={64} rx={8} ry={8} />
      <rect x={432} y={272} width={48} height={48} rx={8} ry={8} />
      <rect x={272} y={432} width={48} height={48} rx={8} ry={8} />
      <rect x={336} y={96} width={80} height={80} rx={8} ry={8} />
      <rect
        x={288}
        y={48}
        width={176}
        height={176}
        rx={16}
        ry={16}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect x={96} y={96} width={80} height={80} rx={8} ry={8} />
      <rect
        x={48}
        y={48}
        width={176}
        height={176}
        rx={16}
        ry={16}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect x={96} y={336} width={80} height={80} rx={8} ry={8} />
      <rect
        x={48}
        y={288}
        width={176}
        height={176}
        rx={16}
        ry={16}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgQrCodeOutline
