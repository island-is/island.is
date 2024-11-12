import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import {
  Box,
  SkeletonLoader,
  AlertMessage,
  Bullet,
  BulletList,
  ActionCard,
  InputError,
} from '@island.is/island-ui/core'
import { PlateOwnership } from '../../shared'
import { error, information } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { useLazyPlateDetails } from '../../hooks/useLazyPlateDetails'
import { checkCanRenew } from '../../utils'

interface PlateSearchFieldProps {
  myPlateOwnershipList: PlateOwnership[]
}

export const PlateSelectField: FC<
  React.PropsWithChildren<PlateSearchFieldProps & FieldBaseProps>
> = ({ myPlateOwnershipList, application, errors }) => {
  const { formatMessage, formatDateFns } = useLocale()
  const { setValue } = useFormContext()

  const plateValue = getValueViaPath(
    application.answers,
    'pickPlate.value',
    '',
  ) as string
  const currentPlate = myPlateOwnershipList[parseInt(plateValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedPlate, setSelectedPlate] = useState<PlateOwnership | null>(
    currentPlate && currentPlate.regno
      ? {
          regno: currentPlate.regno,
          startDate: currentPlate.startDate,
          endDate: currentPlate.endDate,
          validationErrorMessages: currentPlate.validationErrorMessages,
        }
      : null,
  )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickPlate.regno', '') as string,
  )

  const getPlateDetails = useLazyPlateDetails()
  const getPlateDetailsCallback = useCallback(
    async ({ regno }: { regno: string }) => {
      const { data } = await getPlateDetails({
        regno,
      })
      return data
    },
    [getPlateDetails],
  )

  const onChange = (option: Option) => {
    const currentPlate = myPlateOwnershipList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentPlate.regno) {
      getPlateDetailsCallback({
        regno: currentPlate.regno,
      })
        .then((response) => {
          setSelectedPlate({
            regno: currentPlate.regno,
            startDate: currentPlate.startDate,
            endDate: currentPlate.endDate,
            validationErrorMessages:
              response?.myPlateOwnershipChecksByRegno?.validationErrorMessages,
          })

          const canRenew = checkCanRenew(selectedPlate)
          const disabled =
            !!response?.myPlateOwnershipChecksByRegno?.validationErrorMessages
              ?.length || !canRenew

          setPlate(disabled ? '' : currentPlate.regno || '')
          setValue('pickPlate.regno', disabled ? '' : currentPlate.regno)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    }
  }

  const canRenew = checkCanRenew(selectedPlate)
  const disabled = !!selectedPlate?.validationErrorMessages?.length || !canRenew

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickPlate.plate)}
        id="pickPlate.value"
        name="pickPlate.value"
        onSelect={(option) => onChange(option as Option)}
        options={myPlateOwnershipList.map((plate, index) => {
          return {
            value: index.toString(),
            label: `${plate.regno}`,
          }
        })}
        placeholder={formatMessage(information.labels.pickPlate.placeholder)}
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {selectedPlate && (
              <ActionCard
                backgroundColor={disabled ? 'red' : 'blue'}
                heading={selectedPlate.regno || ''}
                text=""
                focused={true}
                tag={{
                  label: formatMessage(
                    information.labels.pickPlate.expiresTag,
                    {
                      date: formatDateFns(new Date(selectedPlate.endDate)),
                    },
                  ),
                  variant: canRenew ? 'red' : 'mint',
                  // TODO disabled: true,
                }}
              />
            )}
            {selectedPlate && disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickPlate.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!!selectedPlate.validationErrorMessages?.length &&
                          selectedPlate.validationErrorMessages?.map(
                            (error) => {
                              return <Bullet>{error.defaultMessage}</Bullet>
                            },
                          )}
                      </BulletList>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      {!isLoading && plate.length === 0 && (errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidPlate)} />
      )}
    </Box>
  )
}
