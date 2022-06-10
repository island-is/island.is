import React, { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: (key: string) => void
}

export const Expenses = ({ getSum }: PropTypes): JSX.Element => {
  const { clearErrors } = useFormContext()

  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.electionOffice}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.electionOffice}
                name={OPERATIONIDS.electionOffice}
                label={formatMessage(m.electionOffice)}
                value={value}
                onBlur={() => getSum('expense')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.electionOffice)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.advertisements}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.advertisements}
                name={OPERATIONIDS.advertisements}
                label={formatMessage(m.advertisements)}
                value={value}
                onBlur={() => getSum('expense')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.advertisements)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.travelCost}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.travelCost}
                name={OPERATIONIDS.travelCost}
                label={formatMessage(m.travelCost)}
                value={value}
                onBlur={() => getSum('expense')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.travelCost)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.otherCost}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.otherCost}
                name={OPERATIONIDS.otherCost}
                label={formatMessage(m.otherCost)}
                value={value}
                onBlur={() => getSum('expense')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.otherCost)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.capitalCost}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.capitalCost}
                name={OPERATIONIDS.capitalCost}
                label={formatMessage(m.capitalCost)}
                value={value}
                onBlur={() => getSum('expense')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.capitalCost)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </Fragment>
  )
}
