import {
  Box,
  Text,
  AlertMessage,
  BulletList,
  Bullet,
  Tag,
} from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { PlateOwnership } from '../../shared'
import { RadioController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { information } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface PlateSearchFieldProps {
  myPlateOwnershipList: PlateOwnership[]
}

export const PlateRadioField: FC<
  React.PropsWithChildren<PlateSearchFieldProps & FieldBaseProps>
> = ({ myPlateOwnershipList, application }) => {
  const { formatMessage, formatDateFns } = useLocale()
  const { setValue } = useFormContext()
  const [regno, setRegno] = useState<string>(
    getValueViaPath(application.answers, 'pickPlate.regno', '') as string,
  )

  const plateOptions = (plates: PlateOwnership[]) => {
    const options = [] as Option[]

    for (const [index, plate] of plates.entries()) {
      const inThreeMonths = new Date().setMonth(new Date().getMonth() + 3)
      const canRenew = +new Date(plate.endDate) <= +inThreeMonths
      const disabled = !!plate?.validationErrorMessages?.length || !canRenew
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Box>
                <Text variant="h3" color={disabled ? 'dark200' : 'dark400'}>
                  {plate.regno}
                </Text>
              </Box>
              <Tag variant={canRenew ? 'red' : 'mint'} disabled>
                {formatMessage(information.labels.pickPlate.expiresTag, {
                  date: formatDateFns(new Date(plate.endDate), 'do MMM yyyy'),
                })}
              </Tag>
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

  useEffect(() => {
    setValue('pickPlate.regno', regno)
  }, [setValue, regno])

  return (
    <div>
      <RadioController
        id="pickPlate.value"
        largeButtons
        backgroundColor="blue"
        options={plateOptions(myPlateOwnershipList as PlateOwnership[])}
        onSelect={(s: string) =>
          setRegno(myPlateOwnershipList[parseInt(s, 10)].regno)
        }
      />
    </div>
  )
}
