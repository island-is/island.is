import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ABOUTIDS } from '../../lib/constants'
import * as styles from './styles.css'
import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { possibleOperatingYears } from '../../lib/utils/helpers'

export const OperatingYear = () => {
  const { formatMessage } = useLocale()
  const { errors } = useFormContext()
  const operatingYear = possibleOperatingYears()

  return (
    <Box width="half" className={styles.selectSpace}>
      <SelectController
        id={ABOUTIDS.operatingYear}
        name={ABOUTIDS.operatingYear}
        backgroundColor="blue"
        label={formatMessage(m.operatingYear)}
        placeholder={formatMessage(m.selectOperatingYear)}
        error={errors && getErrorViaPath(errors, ABOUTIDS.operatingYear)}
        options={operatingYear}
        defaultValue={operatingYear[0]}
      />
    </Box>
  )
}
