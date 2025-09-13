import React, { useState } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Select,
  AsyncSearch,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export type CategoryFormOption = {
  label: string
  value: string
}

export type TypeFormOption = {
  label: string
  value: string
}

export interface StatisticsSearchData {
  fileName: string
  category: CategoryFormOption
  type: TypeFormOption
  dateFrom: string
  dateTo: string
}

export const StatisticsSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [options] = useState([
    { label: 'label1', value: 'value1' },
    { label: 'label2', value: 'value2' },
    { label: 'label2', value: 'value3' },
  ])

  const { formatMessage } = useLocale()
  return (
    <Box>
      <GridRow>
        <GridColumn span="12/12">
          <AsyncSearch
            options={options}
            filter={(option) => option.label.includes(searchTerm)}
            size="large"
            placeholder={formatMessage(m.StatisticsSearchPlaceholder)}
            inputValue={searchTerm}
            onInputValueChange={setSearchTerm}
            colored={true}
          />
        </GridColumn>
      </GridRow>
      <Box marginBottom={2} />
      <GridRow>
        <GridColumn span="6/12">
          <Select
            name="select-left"
            placeholder={formatMessage(
              m.DashBoardStatisticsCategoryPlaceHolder,
            )}
            label={formatMessage(m.DashBoardStatisticsCategory)}
            //   need translations for this when implemented
            options={[
              { label: 'Fjármál', value: 'fjarmal' },
              { label: 'Annað', value: 'annad' },
            ]}
            size="xs"
          />
        </GridColumn>
        <GridColumn span="6/12">
          <Select
            name="select-right"
            onChange={(...args) => {
              console.log(args)
            }}
            placeholder={formatMessage(
              m.DashBoardStatisticsCategoryPlaceHolder,
            )}
            label={formatMessage(m.DashBoardStatisticsCategory)}
            //   need translations for this when implemented
            options={[
              { label: 'Fjármál', value: 'fjarmal' },
              { label: 'Annað', value: 'annad' },
            ]}
            size="xs"
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
