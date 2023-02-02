// Buyer and buyers coowener + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information } from '../../../lib/messages'
import { ReviewGroup } from '@island.is/application/ui-components'

export const OwnerSection: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.owner.title)}
          </Text>
          <Text>{getValueViaPath(answers, 'owner.name', '') as string}</Text>
          <Text>
            {getValueViaPath(answers, 'owner.nationalId', '') as string}
          </Text>
          <Text>{getValueViaPath(answers, 'owner.email', '') as string}</Text>
          <Text>{getValueViaPath(answers, 'owner.phone', '') as string}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
