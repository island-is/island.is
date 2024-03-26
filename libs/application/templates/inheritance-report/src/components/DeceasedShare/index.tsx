import cn from 'classnames'
import {
  GridColumnProps,
  GridColumn,
  Checkbox,
  Text,
  GridRow,
  Box,
} from '@island.is/island-ui/core'
import ShareInput from '../ShareInput'
import { useState } from 'react'
import * as styles from '../../fields/styles.css'
import { useFormContext } from 'react-hook-form'
import { CheckboxController } from '@island.is/shared/form-fields'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'
import { useLocale } from '@island.is/localization'

export const DeceasedShare = ({
  id,
}: {
  id: string
} & GridColumnProps) => {
  const [checked, setChecked] = useState(false)
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const checkboxFieldName = `${id}.deceasedShareEnabled`
  const inputFieldName = `${id}.deceasedShare`

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
          <CheckboxController
            name={checkboxFieldName}
            large={false}
            id={checkboxFieldName}
            options={[
              {
                label: formatMessage(m.share),
                value: YES,
              },
            ]}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <ShareInput
            name={inputFieldName}
            onAfterChange={(val) => {
              setValue(inputFieldName, String(val))
            }}
            disabled={!checked}
            label="Hlutfall séreignar"
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default DeceasedShare
