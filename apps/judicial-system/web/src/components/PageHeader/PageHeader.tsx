import React from 'react'
import Head from 'next/head'

interface Props {
  title: string
}

const PageHeader: React.FC<Props> = (props) => {
  const { title } = props

  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}

export default PageHeader
