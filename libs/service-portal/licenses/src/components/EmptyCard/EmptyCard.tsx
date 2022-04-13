import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useRouter } from 'next/router'

export const EmptyCard = ({
  image,
  title,
  text,
}: {
  title?: string
  text?: string
  image?: string
}) => {
  useNamespaces('sp.license')
  const router = useRouter()
  const { formatMessage } = useLocale()

  return (
    <ActionCard
      backgroundColor="blue"
      heading={title}
      headingVariant="h4"
      image={{ variant: 'image', src: image }}
      text={text}
      cta={{
        variant: 'text',
        onClick: () => {
          router.push('https://island.is')
        },
        label: formatMessage(m.applyFor),
      }}
    />
  )
}

export default EmptyCard
