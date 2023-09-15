import React from 'react'
import Head from 'next/head'

interface Props {
  title: string
}

const PageHeader: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { title } = props

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  )
}

export default PageHeader
