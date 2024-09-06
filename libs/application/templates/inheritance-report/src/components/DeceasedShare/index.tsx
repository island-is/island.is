import {
  GridColumn,
  GridRow,
  Box,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import ShareInput from '../ShareInput'
import { useEffect } from 'react'
import { useFormContext, useFormState } from 'react-hook-form'
import { CheckboxController } from '@island.is/shared/form-fields'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { YES, getErrorViaPath } from '@island.is/application/core'
import { MessageDescriptor } from 'react-intl'

export type DeceasedShareProps = {
  id?: string
  labelCheck?: MessageDescriptor
  labelInput?: MessageDescriptor
  checkFieldName?: string
  valueFieldName?: string
  defaultValue?: string
  pushRight?: boolean
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  disabled?: boolean
}

export const DeceasedShare = ({
  id,
  labelCheck = m.hadSeparatePropertyTitle,
  labelInput = m.deceasedShare,
  checkFieldName = 'deceasedShareEnabled',
  valueFieldName = 'deceasedShare',
  defaultValue = '0',
  pushRight,
  paddingTop = 'none',
  paddingBottom = 'none',
  disabled = false,
}: DeceasedShareProps) => {
  const { errors } = useFormState()
  const { setValue, watch } = useFormContext()
  const { formatMessage } = useLocale()

  const prefix = id ? `${id}.` : ''

  const checkboxFieldName = `${prefix}${checkFieldName}`
  const inputFieldName = `${prefix}${valueFieldName}`

  const watchedCheckboxField = watch(checkboxFieldName)
  const watchedInputField = watch(inputFieldName)

  const error = getErrorViaPath(errors, `${id}.${valueFieldName}`)
  const checked = watchedCheckboxField?.[0] === YES

  useEffect(() => {
    if (!checked) {
      setValue(inputFieldName, defaultValue)
    }
  }, [checked, defaultValue, inputFieldName, setValue, watchedInputField])

  return (
    <GridRow>
      <GridColumn
        span={['1/1', '1/2']}
        offset={pushRight ? ['0', '1/2'] : '0'}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
      >
        <Box width="full">
          <Box paddingBottom={checked ? 3 : 0} width="full">
            <CheckboxController
              name={checkboxFieldName}
              large={false}
              id={checkboxFieldName}
              labelVariant="default"
              strong={checked}
              defaultValue={watchedCheckboxField}
              disabled={disabled}
              options={[
                {
                  label: formatMessage(labelCheck),
                  value: YES,
                },
              ]}
              spacing={0}
            />
          </Box>
          {checked && (
            <Box width="full">
              <ShareInput
                name={inputFieldName}
                hasError={!!error}
                errorMessage={error}
                disabled={!checked}
                label={formatMessage(labelInput)}
              />
            </Box>
          )}
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default DeceasedShare
