import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  RadioButton,
} from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Controller } from 'react-hook-form'
import { Plate } from '../../shared/types'
import { licensePlate } from '../../lib/messages'
import { plate110 } from '../../assets/plates/plate-110-510'
import { plate200 } from '../../assets/plates/plate-200-280'
import { plate155 } from '../../assets/plates/plate-155-305'

export const LicensePlates: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field } = props
  const { formatMessage } = useLocale()

  const options = [
    {
      value: Plate.A,
      label: licensePlate.labels.plate110,
      illustration: plate110,
    },
    {
      value: Plate.B,
      label: licensePlate.labels.plate200,
      illustration: plate200,
    },
    {
      value: Plate.D,
      label: licensePlate.labels.plate155,
      illustration: plate155,
    },
  ]

  return (
    <Box>
      {/* Setja radio controller með engum border - 3 saman */}
      <Controller
        name={`${field.id}`}
        render={({ field: { value, onChange } }) => (
          <GridRow>
            {options.map((option, index) => (
              <GridColumn
                span={['1/1', '1/1', '1/3']}
                paddingBottom={2}
                key={`option-${option.value}`}
              ></GridColumn>
            ))}
          </GridRow>
        )}
      />
    </Box>
  )
}
