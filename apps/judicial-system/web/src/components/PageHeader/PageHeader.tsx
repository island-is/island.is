import React from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import Head from 'next/head'

interface Props {
  title: MessageDescriptor
}

const PageHeader: React.FC<Props> = (props) => {
  const { title } = props
  const { formatMessage } = useIntl()

  return (
    <Head>
      <title>{formatMessage(title)}</title>
    </Head>
  )
}

export default PageHeader
