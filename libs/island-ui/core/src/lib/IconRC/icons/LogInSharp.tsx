import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgLogInSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="log-in-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M432 80H192a16 16 0 00-16 16v144h153.37l-64-64L288 153.37l91.31 91.32a16 16 0 010 22.62L288 358.63 265.37 336l64-64H176v144a16 16 0 0016 16h240a16 16 0 0016-16V96a16 16 0 00-16-16zM64 240h112v32H64z" />
    </svg>
  )
}

export default SvgLogInSharp
