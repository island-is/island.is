import React from 'react'
import { useIntl } from 'react-intl'

import { GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { Routes } from '../../lib/constants'
import { contactInfo } from '../../lib/messages'
import SummaryBlock from './SummaryBlock'

interface Props {
  goToScreen?: (id: string) => void
  route: Routes
  email: string
  phone: string
}

const ContactInfo = ({ route, email, phone, goToScreen }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text fontWeight="semiBold">
            {formatMessage(contactInfo.emailInput.label)}
          </Text>
          <Text marginBottom={[3, 3, 3, 0]}>{email}</Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text fontWeight="semiBold">
            {formatMessage(contactInfo.phoneInput.label)}
          </Text>
          <Text>{phone}</Text>
        </GridColumn>
      </GridRow>
    </SummaryBlock>
  )
}

export default ContactInfo
