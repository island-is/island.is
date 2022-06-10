import React, { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: (key: string) => void
}

export const Income = ({ getSum }: PropTypes): JSX.Element => {
  const { clearErrors } = useFormContext()

  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.corporateDonations}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.corporateDonations}
                name={OPERATIONIDS.corporateDonations}
                label={formatMessage(m.corporateDonation)}
                value={value}
                onBlur={() => getSum('income')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.corporateDonations)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.individualDonations}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.individualDonations}
                name={OPERATIONIDS.individualDonations}
                label={formatMessage(m.individualDonations)}
                value={value}
                onBlur={() => getSum('income')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.individualDonations)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.personalDonations}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.personalDonations}
                name={OPERATIONIDS.personalDonations}
                label={formatMessage(m.personalDonations)}
                value={value}
                onBlur={() => getSum('income')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.personalDonations)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.otherIncome}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.otherIncome}
                name={OPERATIONIDS.otherIncome}
                label={formatMessage(m.otherIncome)}
                value={value}
                onBlur={() => getSum('income')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.otherIncome)
                  onChange(e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
      <Box paddingY={1}>
        <Controller
          name={OPERATIONIDS.capitalIncome}
          render={({ value, onChange }) => {
            return (
              <Input
                id={OPERATIONIDS.capitalIncome}
                name={OPERATIONIDS.capitalIncome}
                label={formatMessage(m.capitalIncome)}
                value={value}
                onBlur={() => getSum('income')}
                backgroundColor="blue"
                onChange={(e) => {
                  clearErrors(OPERATIONIDS.capitalIncome)
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
