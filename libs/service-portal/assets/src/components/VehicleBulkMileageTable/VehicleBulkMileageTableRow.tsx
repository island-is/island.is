import { Box, Button } from '@island.is/island-ui/core'
import { ExpandRow, NestedFullTable } from '@island.is/service-portal/core'
import { InputController } from '@island.is/shared/form-fields'
import { MessageDescriptor } from 'react-intl'
import { m as coreMessages } from '@island.is/service-portal/core'
import { SubmissionStatus } from '../../screens/VehicleBulkMileage/VehicleBulkMileageState'import { useFormContext } from 'react-hook-form'
}

interface Props {
  id: string
  line: string[]
  detail: Array<string[]>
  onSaveClick: (mileage: number, permNo: string) => void
}

const getTag = (
  submissionStatus: SubmissionStatus,
): {
  icon: 'checkmarkCircle' | 'closeCircle' | 'pencil'
  text: MessageDescriptor
} => {
  switch (submissionStatus) {
    case 'success':
      return { icon: 'checkmarkCircle', text: coreMessages.saved }
    case 'failure':
      return { icon: 'closeCircle', text: coreMessages.companyTitle }

    default:
      return { icon: 'pencil', text: coreMessages.save }
  }
}

export const VehicleBulkMileageTableRow = (props: Props) => {

  const {control, handleSubmit} = useFormContext()

  return (
    <ExpandRow
      key={`Expand-row-id-${props.id}`}
      data={[
        ...props.line.map((l) => {
          return {
            value: l,
          }
        }),
        {
          value: (
            <Box>
              <InputController
                control={control}
                type="number"
                id={props.id}
                name={props.id}
                size="xs"
                suffix=" km"
                thousandSeparator
                rightAlign
                maxLength={12}
                defaultValue={''}
                required={false}
                /*
                  rules={{
                    validate: {
                      value: (value: number) => {
                        // Input number must be higher than the highest known mileage registration value

                        if (vehicle.latestRegistration) {
                          // If we're in editing mode, we want to find the highest confirmed registered number, ignoring all Island.is registrations from today.
                          const confirmedRegistrations =
                            vehicle?.mileageRegistrationHistory?.filter(
                              (item) => {
                                if (item.date) {
                                  const isIslandIsReadingToday =
                                    item.origin ===
                                      'ISLAND.IS' &&
                                    isReadDateToday(
                                      new Date(item.date),
                                    )
                                  return !isIslandIsReadingToday
                                }
                                return true
                              },
                            )

                          const detailArray =
                            vehicle.isCurrentlyEditing
                              ? confirmedRegistrations
                              : vehicle.mileageRegistrationHistory

                          const latestRegistration =
                            detailArray?.[0]?.mileage ?? 0

                          if (latestRegistration > value) {
                            return formatMessage(
                              messages.mileageInputTooLow,
                            )
                          }
                        }
                      },
                    },
                    required: {
                      value: true,
                      message: formatMessage(
                        messages.mileageInputMinLength,
                      ),
                    },
                    minLength: {
                      value: 1,
                      message: formatMessage(
                        messages.mileageInputMinLength,
                      ),
                    },
                    }}*/
              />
            </Box>
          ),
        },
        {
          value: (
            <Button
              icon={getTag(vehicle.permNo).icon}
              size="small"
              type="button"
              variant="text"
              onClick={handleSubmit((data) =>
                props.onSaveClick(
                  permNo: props.id,
                  odometerStatus: parseInt(data[vehicle.permNo]),
                ),
              )}
            >
              {formatMessage(getTag(vehicle.permNo).text)}
            </Button>
          ),
        },
      ]}
    >
      <NestedFullTable
        headerArray={['Dagsetning', 'Skráning', 'Ársnotkun', 'Kílómetrastaða']}
        data={
          vehicle.registrationHistory?.map((det) => [
            formatDate(det.date),
            det.origin,
            '',
            det.mileage.toString(),
          ]) ?? []
        }
      />
    </ExpandRow>
  )
}
