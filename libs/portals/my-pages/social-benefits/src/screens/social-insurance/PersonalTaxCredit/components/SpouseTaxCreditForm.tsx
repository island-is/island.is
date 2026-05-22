import { Box, Checkbox, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PercentageInput } from './PercentageInput'
import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { m } from '../../../../lib/messages'
import { SpouseTaxCreditState } from '../PersonalTaxCredit'
import { YearMonthSelect } from './YearMonthSelect'
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

const GRANT = 'grant' as const
const DECEASED = 'deceased' as const

export const SpouseTaxCreditForm: FC<Props> = ({
  state,
  setState,
  monthsAndYears,
  spouseName,
  spouseNationalId,
  spouseIsDeceased,
}) => {
  const { formatMessage, lang } = useLocale()

  const yearOptions = useMemo(
    () => toYearOptions(monthsAndYears),
    [monthsAndYears],
  )

  const grantMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        state.action === GRANT ? state.data.year : null,
        lang,
      ),
    [monthsAndYears, state, lang],
  )

  const deceasedMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        state.action === DECEASED ? state.data.year : null,
        lang,
      ),
    [monthsAndYears, state, lang],
  )

  return (
    <Stack space={3}>
      <Checkbox
        id="grant-spouse-tax-credit"
        label={formatMessage(m.grantSpouseTaxCredit)}
        checked={state.action === GRANT}
        disabled={!!spouseIsDeceased}
        onChange={(e) =>
          setState(
            e.target.checked
              ? {
                  action: GRANT,
                  data: { year: null, month: null, percentage: '' },
                }
              : { action: null },
          )
        }
      />
      {state.action === GRANT && (
        <Box paddingLeft={7}>
          <Box style={FORM_MAX_WIDTH}>
            <Stack space={3}>
              {(spouseName || spouseNationalId) && (
                <Box>
                  {spouseName && <Text>{spouseName}</Text>}
                  {spouseNationalId && (
                    <Text>
                      {formatMessage(m.nationalIdWithValue, { value: spouseNationalId })}
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
                    action: GRANT,
                    data: { ...state.data, year, month: null },
                  })
                }
                onMonthChange={(month) =>
                  setState({
                    action: GRANT,
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
                    action: GRANT,
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
        checked={state.action === DECEASED}
        disabled={!spouseIsDeceased}
        onChange={(e) =>
          setState(
            e.target.checked
              ? {
                  action: DECEASED,
                  data: { year: null, month: null, percentage: '' },
                }
              : { action: null },
          )
        }
      />
      {state.action === DECEASED && (
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
                    action: DECEASED,
                    data: {
                      year,
                      month: null,
                      percentage: state.data.percentage,
                    },
                  })
                }
                onMonthChange={(month) =>
                  setState({
                    action: DECEASED,
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
                    action: DECEASED,
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
