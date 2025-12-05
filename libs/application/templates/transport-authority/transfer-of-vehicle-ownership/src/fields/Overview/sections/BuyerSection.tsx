// Buyer and buyers coowner + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, overview, review } from '../../../lib/messages'
import { States } from '../../../lib/constants'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps } from '../../../shared'
import { formatPhoneNumber, hasReviewerApproved } from '../../../utils'
import kennitala from 'kennitala'

export const BuyerSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, setStep, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep && setStep('addPeople')
  }

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId
  const phone = getValueViaPath(answers, 'buyer.phone', '') as string

  return (
    <ReviewGroup
      editMessage={
        isBuyer &&
        !hasReviewerApproved(answers, reviewerNationalId) &&
        application.state !== States.COMPLETED
          ? formatMessage(overview.labels.addCoOwnerAndOperatorButton)
          : undefined
      }
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['6/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.buyer.title)}{' '}
            {isBuyer && `(${formatMessage(review.status.youLabel)})`}
          </Text>
          <Text>{getValueViaPath(answers, 'buyer.name', '') as string}</Text>
          <Text>
            {kennitala.format(
              getValueViaPath(answers, 'buyer.nationalId', '') as string,
            )}
          </Text>
          <Text>{getValueViaPath(answers, 'buyer.email', '') as string}</Text>
          <Text>{formatPhoneNumber(phone)}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
