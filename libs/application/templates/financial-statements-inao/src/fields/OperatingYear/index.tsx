import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ABOUTIDS } from '../../lib/constants'
import * as styles from './styles.css'
import { SelectController } from '@island.is/shared/form-fields'

export const OperatingYear = () => {
  const { formatMessage } = useLocale()
  return (
    <Box width="half" className={styles.selectSpace}>
      <SelectController
        id={ABOUTIDS.operatingYear}
        name={ABOUTIDS.operatingYear}
        backgroundColor="blue"
        label={formatMessage(m.operatingYear)}
        placeholder={formatMessage(m.selectOperatingYear)}
        options={[
          { label: '2020', value: '2020' },
          { label: '2021', value: '2021' },
        ]}
      />
      {/* <Controller
        name={ABOUTIDS.operatingYear}
        defaultValue=""
        render={({ onChange, value }) => {
          return (
            <Select
              id={ABOUTIDS.operatingYear}
              name={ABOUTIDS.operatingYear}
              label={formatMessage(m.operatingYear)}
              placeholder={formatMessage(m.selectOperatingYear)}
              value={value}
              onChange={onChange}
            />
          )
        }}
      /> */}
    </Box>
  )
}
