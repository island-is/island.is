// Buyer and buyers coowener + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, review } from '../../../lib/messages'
import { ReviewGroup } from '@island.is/application/ui-components'
import kennitala from 'kennitala'
import { ReviewScreenProps } from '../../../shared'
import { formatPhoneNumber } from '../../../utils'

export const OwnerSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const phone = getValueViaPath(answers, 'owner.phone', '') as string
  const nationalId = getValueViaPath(answers, 'owner.nationalId', '') as string
  const isOwner = nationalId === reviewerNationalId
  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.owner.title)}{' '}
            {isOwner && `(${formatMessage(review.status.youLabel)})`}
          </Text>
          <Text>{getValueViaPath(answers, 'owner.name', '') as string}</Text>
          <Text>{kennitala.format(nationalId)}</Text>
          <Text>{getValueViaPath(answers, 'owner.email', '') as string}</Text>
          <Text>{formatPhoneNumber(phone)}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
