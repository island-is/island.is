import React, { FC } from 'react'
import format from 'date-fns/format'
import { GridContainer, GridRow, GridColumn } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { DatePickerController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const df = 'yyyy-MM-dd'

const ConfirmationDate: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  error,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const defaultDate = new Date()
  // Set date to yesterday if current time is before noon for better UX
  if (defaultDate.getHours() < 12)
    defaultDate.setDate(defaultDate.getDate() - 1)

  return (
    <GridContainer>
      <GridRow marginBottom={5}>
        <GridColumn
          span={['12/12', '6/12']}
          paddingBottom={[3, 0]}
          paddingTop={[3, 0]}
        >
          <DatePickerController
            defaultValue={format(defaultDate, df)}
            label={formatMessage(m.confirmationSectionSelectDatePlaceholder)}
            placeholder={formatMessage(m.confirmationSectionSelectDateLabel)}
            id={id}
            locale="is"
            maxDate={new Date()}
            backgroundColor="white"
            onChange={(d) => {
              setValue(id, d)
            }}
            error={error}
            required
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ConfirmationDate
