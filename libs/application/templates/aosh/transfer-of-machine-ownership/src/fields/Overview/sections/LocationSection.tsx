// Location with button - only visible to buyer
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState, useEffect } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../../lib/messages'
import { States } from '../../../lib/constants'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps, MachineLocation } from '../../../shared'
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
  const initialMachineLocation = getValueViaPath(
    application.answers,
    'location',
    undefined,
  ) as MachineLocation | undefined

  const [machineLocation, setMachineLocation] = useState<
    MachineLocation | undefined
  >(
    getValueViaPath(application.answers, 'location', undefined) as
      | MachineLocation
      | undefined,
  )

  // Use an effect to update machineLocation when initialMachineLocation changes.
  useEffect(() => {
    setMachineLocation(initialMachineLocation)

    // If location prop has a value, update machineLocation
    if (location) {
      setMachineLocation(location)
    }
  }, [initialMachineLocation, location])

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId
  return (
    <ReviewGroup
      editMessage={
        isBuyer &&
        !hasReviewerApproved(reviewerNationalId, answers) &&
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
            {machineLocation?.address && machineLocation?.postCode
              ? `${machineLocation.address} - ${machineLocation.postCode}`
              : formatMessage(overview.labels.noLocation)}
          </Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
