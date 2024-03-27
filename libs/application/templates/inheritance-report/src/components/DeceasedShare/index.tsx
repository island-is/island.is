import {
  GridColumnProps,
  GridColumn,
  GridRow,
  Box,
  Tooltip,
} from '@island.is/island-ui/core'
import ShareInput from '../ShareInput'
import { useEffect } from 'react'
import { useFormContext, useFormState } from 'react-hook-form'
import { CheckboxController } from '@island.is/shared/form-fields'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'
import { valueToNumber } from '../../lib/utils/helpers'

export const DeceasedShare = ({
  id,
}: {
  id: string
} & GridColumnProps) => {
  const { errors } = useFormState()
  const { setValue, watch } = useFormContext()
  const { formatMessage } = useLocale()

  const checkboxFieldName = `${id}.deceasedShareEnabled`
  const inputFieldName = `${id}.deceasedShare`

  const watchedCheckboxField = watch(checkboxFieldName)
  const watchedInputField = watch(inputFieldName)

  const hasError = getErrorViaPath(errors, `${id}.deceasedShare`)
  const checked = watchedCheckboxField?.[0] === YES

  useEffect(() => {
    if (!checked) {
      setValue(inputFieldName, '0')
    } else {
      if (valueToNumber(watchedInputField) > 0) {
        console.log('watchedInputField', watchedInputField)
      }
    }
  }, [checked, inputFieldName, setValue, watchedInputField])

  return (
    <Box
      marginBottom={2}
      paddingY={2}
      paddingX={2}
      borderRadius="large"
      border="standard"
    >
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={[2, 0]}>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="row"
            flexWrap="wrap"
            height="full"
          >
            <CheckboxController
              name={checkboxFieldName}
              split="1/2"
              large={false}
              id={checkboxFieldName}
              defaultValue={watchedCheckboxField}
              options={[
                {
                  label: formatMessage(m.share),
                  value: YES,
                },
              ]}
              spacing={0}
            />
            <Box marginLeft={1} paddingTop={1}>
              <Tooltip
                text={formatMessage(m.hadSeparateProperty)}
                placement="bottom"
                iconSize="medium"
              />
            </Box>
          </Box>
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <ShareInput
            name={inputFieldName}
            // onAfterChange={(val) => {
            //   setValue(inputFieldName, String(val))
            // }}
            errorMessage={hasError}
            disabled={!checked}
            label={formatMessage(m.deceasedShare)}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default DeceasedShare
