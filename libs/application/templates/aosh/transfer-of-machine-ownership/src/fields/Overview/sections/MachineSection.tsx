import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import { Operator, ReviewScreenProps } from '../../../shared'

export const MachineSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const dateOfContract = format(
    parseISO(getValueViaPath(answers, 'machine.date', '') as string),
    'dd.MM.yyyy',
    {
      locale: is,
    },
  )
  const regNumber = getValueViaPath(answers, 'machine.regNumber', undefined) as
    | string
    | undefined
  const type = getValueViaPath(answers, 'machine.type', '') as string
  const subType = getValueViaPath(answers, 'machine.subType', '') as string
  const category = getValueViaPath(answers, 'machine.category', '') as string
  const buyerOperatorValue = getValueViaPath(
    answers,
    'buyerOperator',
    null, // Initialize as null
  ) as Operator | null

  let isOperator = false

  if (buyerOperatorValue && buyerOperatorValue.wasRemoved !== 'true') {
    isOperator = buyerOperatorValue.nationalId === reviewerNationalId
  }

  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.machine.title)}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text>{regNumber ? regNumber : ''}</Text>
          <Text>
            {type ? `${type} - ` : ''}
            {subType}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          {!isOperator && category.length > 0 && <Text>{category}</Text>}
          <Text>{`${formatMessage(
            overview.labels.agreementDate,
          )} ${dateOfContract}`}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
