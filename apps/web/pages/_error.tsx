import React from 'react'
import { ErrorProps } from 'next/error'

function CustomError ({ statusCode, title = '', ...props }: ErrorProps) {
  console.log('Inside cmp error props')
  return (
    <h1>
      Error: {statusCode}: {title}
    </h1>
  )
}

CustomError.getInitialProps = ({ ...props }) => {
  const statusCode = props?.err?.statusCode ?? props?.res?.statusCode ?? 404
  const title = props?.err?.title ?? ''
  return { statusCode, title }
}

export default CustomError
