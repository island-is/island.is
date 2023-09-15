import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import {
  Box,
  CategoryCard,
  SkeletonLoader,
  AlertMessage,
  Bullet,
  BulletList,
} from '@island.is/island-ui/core'
import { PlateOwnership } from '../../shared'
import { information } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'

interface PlateSearchFieldProps {
  myPlateOwnershipList: PlateOwnership[]
}

export const PlateSelectField: FC<
  React.PropsWithChildren<PlateSearchFieldProps & FieldBaseProps>
> = ({ myPlateOwnershipList, application }) => {
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

  const onChange = (option: Option) => {
    const currentPlate = myPlateOwnershipList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentPlate.regno) {
      setSelectedPlate({
        regno: currentPlate.regno,
        startDate: currentPlate.startDate,
        endDate: currentPlate.endDate,
        validationErrorMessages: currentPlate.validationErrorMessages,
      })
      setValue('pickPlate.regno', disabled ? '' : selectedPlate.regno)
      setIsLoading(false)
    }
  }
  const inThreeMonths = new Date().setMonth(new Date().getMonth() + 3)
  const canRenew =
    selectedPlate && +new Date(selectedPlate.endDate) <= +inThreeMonths
  const disabled =
    (selectedPlate && !!selectedPlate.validationErrorMessages?.length) ||
    !canRenew
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
              <CategoryCard
                colorScheme={disabled ? 'red' : 'blue'}
                heading={selectedPlate.regno || ''}
                text=""
                tags={[
                  {
                    label: formatMessage(
                      information.labels.pickPlate.expiresTag,
                      {
                        date: formatDateFns(
                          new Date(selectedPlate.endDate),
                          'do MMM yyyy',
                        ),
                      },
                    ),
                    disabled: true,
                  },
                ]}
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
    </Box>
  )
}
