import { Box, Checkbox, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PercentageInput } from './components/PercentageInput'
import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { m } from '../../../lib/messages'
import { SpouseTaxCreditState } from './PersonalTaxCredit'
import { YearMonthSelect } from './components/YearMonthSelect'
import {
  toYearOptions,
  toMonthOptions,
  FORM_MAX_WIDTH,
} from './taxCreditFormUtils'

interface Props {
  state: SpouseTaxCreditState
  setState: Dispatch<SetStateAction<SpouseTaxCreditState>>
  monthsAndYears: SocialInsuranceYearWithMonths[] | null | undefined
  spouseName?: string | null
  spouseNationalId?: string | null
  spouseIsDeceased?: boolean | null
}

export const SpouseTaxCreditForm: FC<Props> = ({
  state,
  setState,
  monthsAndYears,
  spouseName,
  spouseNationalId,
  spouseIsDeceased,
}) => {
  const { formatMessage } = useLocale()

  const yearOptions = useMemo(
    () => toYearOptions(monthsAndYears),
    [monthsAndYears],
  )

  const grantMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        state.action === 'grant' ? state.data.year : null,
        formatMessage,
      ),
    [monthsAndYears, state, formatMessage],
  )

  const deceasedMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        state.action === 'deceased' ? state.data.year : null,
        formatMessage,
      ),
    [monthsAndYears, state, formatMessage],
  )

  return (
    <Stack space={3}>
      <Checkbox
        id="grant-spouse-tax-credit"
        label={formatMessage(m.grantSpouseTaxCredit)}
        checked={state.action === 'grant'}
        disabled={!!spouseIsDeceased}
        onChange={(e) =>
          setState(
            e.target.checked
              ? {
                  action: 'grant',
                  data: { year: null, month: null, percentage: '' },
                }
              : { action: null },
          )
        }
      />
      {state.action === 'grant' && (
        <Box paddingLeft={7}>
          <Box style={FORM_MAX_WIDTH}>
            <Stack space={3}>
              {(spouseName || spouseNationalId) && (
                <Box>
                  {spouseName && <Text>{spouseName}</Text>}
                  {spouseNationalId && (
                    <Text>
                      {formatMessage(m.nationalIdWithValue, {
                        value: spouseNationalId,
                      })}
                    </Text>
                  )}
                </Box>
              )}
              <YearMonthSelect
                yearOptions={yearOptions}
                monthOptions={grantMonthOptions}
                selectedYear={state.data.year}
                selectedMonth={state.data.month}
                onYearChange={(year) =>
                  setState({
                    action: 'grant',
                    data: { ...state.data, year, month: null },
                  })
                }
                onMonthChange={(month) =>
                  setState({
                    action: 'grant',
                    data: { ...state.data, month },
                  })
                }
                yearName="grant-year"
                monthName="grant-month"
                yearRequired
              />
              <PercentageInput
                id="grant-percentage"
                name="grant-percentage"
                value={state.data.percentage}
                onChange={(value) =>
                  setState({
                    action: 'grant',
                    data: { ...state.data, percentage: value },
                  })
                }
                required
              />
            </Stack>
          </Box>
        </Box>
      )}

      <Checkbox
        id="spouse-deceased-tax-credit"
        label={formatMessage(m.spouseDeceasedTaxCredit)}
        checked={state.action === 'deceased'}
        disabled={!spouseIsDeceased}
        onChange={(e) =>
          setState(
            e.target.checked
              ? {
                  action: 'deceased',
                  data: { year: null, month: null, percentage: '' },
                }
              : { action: null },
          )
        }
      />
      {state.action === 'deceased' && (
        <Box paddingLeft={7}>
          <Box style={FORM_MAX_WIDTH}>
            <Stack space={3}>
              <YearMonthSelect
                yearOptions={yearOptions}
                monthOptions={deceasedMonthOptions}
                selectedYear={state.data.year}
                selectedMonth={state.data.month}
                onYearChange={(year) =>
                  setState({
                    action: 'deceased',
                    data: {
                      year,
                      month: null,
                      percentage: state.data.percentage,
                    },
                  })
                }
                onMonthChange={(month) =>
                  setState({
                    action: 'deceased',
                    data: { ...state.data, month },
                  })
                }
                yearName="deceased-year"
                monthName="deceased-month"
                yearRequired
              />
              <PercentageInput
                id="deceased-percentage"
                name="deceased-percentage"
                value={state.data.percentage}
                onChange={(value) =>
                  setState({
                    action: 'deceased',
                    data: { ...state.data, percentage: value },
                  })
                }
                required
              />
            </Stack>
          </Box>
        </Box>
      )}
    </Stack>
  )
}
