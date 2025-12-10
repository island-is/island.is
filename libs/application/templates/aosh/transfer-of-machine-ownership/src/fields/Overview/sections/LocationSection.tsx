// Location with button - only visible to buyer
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../../lib/messages'
import { States } from '../../../lib/constants'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps } from '../../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { hasReviewerApproved } from '../../../utils'

export const LocationSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ setStep, location = {}, reviewerNationalId = '', application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep && setStep('location')
  }
  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId
  return (
    <ReviewGroup
      editMessage={
        isBuyer &&
        !hasReviewerApproved(answers, reviewerNationalId) &&
        application.state !== States.COMPLETED
          ? formatMessage(overview.labels.addLocationButton)
          : undefined
      }
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['6/12']}>
          <Text variant="h4" color="dark400">
            {formatMessage(overview.labels.locationTitle)}
          </Text>
          <Text color="dark400">
            {location?.address || location?.postCode
              ? [location.address, location.postCode]
                  .filter(Boolean)
                  .join(' - ')
              : formatMessage(overview.labels.noLocation)}
          </Text>
          <Text color="dark400">
            {location?.moreInfo
              ? `${location.moreInfo.slice(0, 25)}${
                  location.moreInfo.length > 25 ? '...' : ''
                }`
              : ''}
          </Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
