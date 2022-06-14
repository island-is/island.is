import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import { getTotal } from '../../lib/utils/helpers'
import { EQUITIESANDLIABILITIESIDS } from '../../lib/constants'

export const PersonalElectionEquities = (): JSX.Element => {
  const { getValues, clearErrors } = useFormContext()
  const [totalAssets, setTotalAssets] = useState(0)
  const [totalEquity, setTotalEquity] = useState(0)
  const [totalLiabilities, setTotalLiabilities] = useState(0)
  const { formatMessage } = useLocale()

  const getTotalEquity = () => {
    const values = getValues()
    const equity: number = getTotal(values, 'equity')
    setTotalEquity(equity)
    return equity
  }

  const getTotalAssets = () => {
    const values = getValues()
    const assets: number = getTotal(values, 'asset')
    setTotalAssets(assets)
    return assets
  }

  const getTotalLiabilities = () => {
    const values = getValues()
    const liabilities: number = getTotal(values, 'liability')
    setTotalLiabilities(liabilities)
    return liabilities
  }

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.properties)}
          </Text>
          <Box paddingY={1}>
            <Controller
              name={EQUITIESANDLIABILITIESIDS.current}
              render={({ value, onChange }) => {
                return (
                  <Input
                    id={EQUITIESANDLIABILITIESIDS.current}
                    name={EQUITIESANDLIABILITIESIDS.current}
                    label={formatMessage(m.currentAssets)}
                    value={value}
                    onBlur={() => getTotalAssets()}
                    backgroundColor="blue"
                    onChange={(e) => {
                      clearErrors(EQUITIESANDLIABILITIESIDS.current)
                      onChange(e.target.value)
                    }}
                  />
                )
              }}
            />
          </Box>
          <Box paddingY={1}>
            <Controller
              name={EQUITIESANDLIABILITIESIDS.tangible}
              render={({ value, onChange }) => {
                return (
                  <Input
                    id={EQUITIESANDLIABILITIESIDS.tangible}
                    name={EQUITIESANDLIABILITIESIDS.tangible}
                    label={formatMessage(m.tangibleAssets)}
                    value={value}
                    onBlur={() => getTotalAssets()}
                    backgroundColor="blue"
                    onChange={(e) => {
                      clearErrors(EQUITIESANDLIABILITIESIDS.tangible)
                      onChange(e.target.value)
                    }}
                  />
                )
              }}
            />
          </Box>
          <Total total={totalAssets} label={formatMessage(m.totalAssets)} />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <Box paddingY={1}>
            <Controller
              name={EQUITIESANDLIABILITIESIDS.longTerm}
              render={({ value, onChange }) => {
                return (
                  <Input
                    id={EQUITIESANDLIABILITIESIDS.longTerm}
                    name={EQUITIESANDLIABILITIESIDS.longTerm}
                    label={formatMessage(m.longTerm)}
                    value={value}
                    onBlur={() => getTotalLiabilities()}
                    backgroundColor="blue"
                    onChange={(e) => {
                      clearErrors(EQUITIESANDLIABILITIESIDS.longTerm)
                      onChange(e.target.value)
                    }}
                  />
                )
              }}
            />
          </Box>
          <Box paddingY={1}>
            <Controller
              name={EQUITIESANDLIABILITIESIDS.shortTerm}
              render={({ value, onChange }) => {
                return (
                  <Input
                    id={EQUITIESANDLIABILITIESIDS.shortTerm}
                    name={EQUITIESANDLIABILITIESIDS.shortTerm}
                    label={formatMessage(m.shortTerm)}
                    value={value}
                    onBlur={() => getTotalLiabilities()}
                    backgroundColor="blue"
                    onChange={(e) => {
                      clearErrors(EQUITIESANDLIABILITIESIDS.shortTerm)
                      onChange(e.target.value)
                    }}
                  />
                )
              }}
            />
          </Box>
          <Total total={totalLiabilities} label={formatMessage(m.totalAssets)} />
          <Box paddingY={1}>
            <Controller
              name={EQUITIESANDLIABILITIESIDS.equity}
              render={({ value, onChange }) => {
                return (
                  <Input
                    id={EQUITIESANDLIABILITIESIDS.equity}
                    name={EQUITIESANDLIABILITIESIDS.equity}
                    label={formatMessage(m.equity)}
                    value={value}
                    onBlur={() => getTotalEquity()}
                    backgroundColor="blue"
                    onChange={(e) => {
                      clearErrors(EQUITIESANDLIABILITIESIDS.equity)
                      onChange(e.target.value)
                    }}
                  />
                )
              }}
            />
          </Box>
          <Total
            total={totalEquity - totalLiabilities}
            label={formatMessage(m.totalExpenses)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
