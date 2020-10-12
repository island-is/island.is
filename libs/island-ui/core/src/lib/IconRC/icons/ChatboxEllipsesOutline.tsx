import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgChatboxEllipsesOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="chatbox-ellipses-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M408 64H104a56.16 56.16 0 00-56 56v192a56.16 56.16 0 0056 56h40v80l93.72-78.14a8 8 0 015.13-1.86H408a56.16 56.16 0 0056-56V120a56.16 56.16 0 00-56-56z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle cx={160} cy={216} r={32} />
      <circle cx={256} cy={216} r={32} />
      <circle cx={352} cy={216} r={32} />
    </svg>
  )
}

export default SvgChatboxEllipsesOutline
