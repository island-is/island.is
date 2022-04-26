import React from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { Routes } from '../../lib/constants'
import SummaryBlock from './SummaryBlock'

interface Props {
  goToScreen?: (id: string) => void
  items: {
    route: Routes
    label: MessageDescriptor
    info?: MessageDescriptor | string
    comment?: string
  }[]
}

const FormInfo = ({ items, goToScreen }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <>
      {items.map((item, i) => (
        <SummaryBlock editAction={() => goToScreen?.(item.route ?? '')} key={i}>
          <Text fontWeight="semiBold">{formatMessage(item.label)}</Text>

          <Text>
            {typeof item.info === 'string'
              ? item.info
              : formatMessage(item.info as MessageDescriptor)}
          </Text>

          {item.comment && <Text marginTop={2}>{item.comment}</Text>}
        </SummaryBlock>
      ))}
    </>
  )
}

export default FormInfo
