// Insurance company with button - only visible to buyer
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState, useEffect } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { error, overview } from '../../../lib/messages'
import { States } from '../../../lib/constants'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps, MachineLocation } from '../../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { hasReviewerApproved } from '../../../utils'

interface Props {
  noInsuranceError: boolean
}

export const LocationSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps & Props>
> = ({
  setStep,
  location = {},
  reviewerNationalId = '',
  application,
  noInsuranceError,
}) => {
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
          <Text variant="h4" color={noInsuranceError ? 'red600' : 'dark400'}>
            {formatMessage(overview.labels.locationTitle)}
          </Text>
          <Text color={noInsuranceError ? 'red600' : 'dark400'}>
            {machineLocation?.address && machineLocation?.postCode
              ? `${machineLocation.address} - ${machineLocation.postCode}`
              : formatMessage(overview.labels.noLocation)}
          </Text>
        </GridColumn>
      </GridRow>
      {noInsuranceError && (
        <Box marginTop={2}>
          <Text variant="eyebrow" color="red600">
            {formatMessage(error.noInsuranceSelected)}
          </Text>
        </Box>
      )}
    </ReviewGroup>
  )
}
