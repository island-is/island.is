import {
  Box,
  Text,
  AlertMessage,
  BulletList,
  Bullet,
} from '@island.is/island-ui/core'
import { FC } from 'react'
import { PlateOwnership } from '../../shared'
import { RadioController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { information } from '../../lib/messages'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface PlateSearchFieldProps {
  myPlateOwnershipList: PlateOwnership[]
}

export const PlateRadioField: FC<PlateSearchFieldProps & FieldBaseProps> = ({
  myPlateOwnershipList,
}) => {
  const { formatMessage } = useLocale()

  const plateOptions = (plates: PlateOwnership[]) => {
    const options = [] as Option[]

    for (const [index, plate] of plates.entries()) {
      const disabled = !!plate?.validationErrorMessages?.length
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="h3" color={disabled ? 'dark200' : 'dark400'}>
                {plate.regno}
              </Text>
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickPlate.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!!plate.validationErrorMessages?.length &&
                          plate.validationErrorMessages?.map((error) => {
                            return <Bullet>{error.defaultMessage}</Bullet>
                          })}
                      </BulletList>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <div>
      <RadioController
        id="pickPlate.vehicle"
        largeButtons
        backgroundColor="blue"
        options={plateOptions(myPlateOwnershipList as PlateOwnership[])}
      />
    </div>
  )
}
