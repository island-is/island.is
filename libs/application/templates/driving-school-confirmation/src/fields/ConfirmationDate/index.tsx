import React, { FC } from 'react'
import { GridContainer, GridRow, GridColumn } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/core'
import { DatePickerController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const ConfirmationDate: FC<FieldBaseProps> = ({ field, error }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  return (
    <GridContainer>
      <GridRow marginBottom={5}>
        <GridColumn
          span={['12/12', '6/12']}
          paddingBottom={[3, 0]}
          paddingTop={[3, 0]}
        >
          <DatePickerController
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
