import { Box, Checkbox, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PercentageInput } from './PercentageInput'
import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { m } from '../../../../lib/messages'
import { MyTaxCreditState } from '../PersonalTaxCredit'
import { YearMonthSelect } from './YearMonthSelect'
import {
  toYearOptions,
  toMonthOptions,
  FORM_MAX_WIDTH,
} from './taxCreditFormUtils'

interface Props {
  state: MyTaxCreditState
  setState: Dispatch<SetStateAction<MyTaxCreditState>>
  monthsAndYears: SocialInsuranceYearWithMonths[] | null | undefined
  discontinuingMonthsAndYears:
    | SocialInsuranceYearWithMonths[]
    | null
    | undefined
  isAlreadyRegistered: boolean
  canDiscontinue: boolean
}

export const MyTaxCreditForm: FC<Props> = ({
  state,
  setState,
  monthsAndYears,
  discontinuingMonthsAndYears,
  isAlreadyRegistered,
  canDiscontinue,
}) => {
  const { formatMessage, lang } = useLocale()

  const yearOptions = useMemo(
    () => toYearOptions(monthsAndYears),
    [monthsAndYears],
  )
  const registerMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        state.action === 'register' ? state.data.year : null,
        lang,
      ),
    [monthsAndYears, state, lang],
  )
  const discontinueYearOptions = useMemo(
    () => toYearOptions(discontinuingMonthsAndYears),
    [discontinuingMonthsAndYears],
  )
  const discontinueMonthOptions = useMemo(
    () =>
      toMonthOptions(
        discontinuingMonthsAndYears,
        state.action === 'discontinue' ? state.data.year : null,
        lang,
      ),
    [discontinuingMonthsAndYears, state, lang],
  )

  return (
    <Stack space={2}>
      {!isAlreadyRegistered && (
        <Box
          border="standard"
          borderRadius="large"
          background="blue100"
          padding={3}
        >
          <Stack space={3}>
            <Checkbox
              id="register-personal-tax-credit"
              label={
                <Text
                  as="span"
                  fontWeight={
                    state.action === 'register' ? 'semiBold' : undefined
                  }
                >
                  {formatMessage(m.registerPersonalTaxCredit)}
                </Text>
              }
              checked={state.action === 'register'}
              disabled={!monthsAndYears?.length}
              onChange={(e) =>
                setState(
                  e.target.checked
                    ? {
                        action: 'register',
                        data: { year: null, month: null, percentage: '' },
                      }
                    : { action: null },
                )
              }
            />
            {state.action === 'register' && (
              <Box style={FORM_MAX_WIDTH}>
                <Stack space={3}>
                  <YearMonthSelect
                    yearOptions={yearOptions}
                    monthOptions={registerMonthOptions}
                    selectedYear={state.data.year}
                    selectedMonth={state.data.month}
                    onYearChange={(year) =>
                      setState({
                        action: 'register',
                        data: { ...state.data, year, month: null },
                      })
                    }
                    onMonthChange={(month) =>
                      setState({
                        action: 'register',
                        data: { ...state.data, month },
                      })
                    }
                    yearName="register-year"
                    monthName="register-month"
                    yearRequired
                    backgroundColor="white"
                  />
                  <PercentageInput
                    id="register-percentage"
                    name="register-percentage"
                    value={state.data.percentage}
                    onChange={(value) =>
                      setState({
                        action: 'register',
                        data: { ...state.data, percentage: value },
                      })
                    }
                    required
                    backgroundColor="white"
                  />
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {isAlreadyRegistered && (
        <>
          <Box
            border="standard"
            borderRadius="large"
            background="white"
            padding={3}
          >
            <Stack space={3}>
              <Checkbox
                id="edit-personal-tax-credit"
                label={
                  <Text
                    as="span"
                    fontWeight={
                      state.action === 'update' ? 'semiBold' : undefined
                    }
                  >
                    {formatMessage(m.editPersonalTaxCredit)}
                  </Text>
                }
                checked={state.action === 'update'}
                onChange={(e) =>
                  setState(
                    e.target.checked
                      ? { action: 'update', data: { percentage: '' } }
                      : { action: null },
                  )
                }
              />
              {state.action === 'update' && (
                <Box style={FORM_MAX_WIDTH}>
                  <PercentageInput
                    id="edit-percentage"
                    name="edit-percentage"
                    value={state.data.percentage}
                    onChange={(value) =>
                      setState({
                        action: 'update',
                        data: { percentage: value },
                      })
                    }
                  />
                </Box>
              )}
            </Stack>
          </Box>

          <Box
            border="standard"
            borderRadius="large"
            background="white"
            padding={3}
          >
            <Stack space={3}>
              <Checkbox
                id="discontinue-personal-tax-credit"
                label={
                  <Text
                    as="span"
                    fontWeight={
                      state.action === 'discontinue' ? 'semiBold' : undefined
                    }
                  >
                    {formatMessage(m.discontinuePersonalTaxCredit)}
                  </Text>
                }
                checked={state.action === 'discontinue'}
                disabled={
                  !canDiscontinue || !discontinuingMonthsAndYears?.length
                }
                onChange={(e) =>
                  setState(
                    e.target.checked
                      ? {
                          action: 'discontinue',
                          data: { year: null, month: null },
                        }
                      : { action: null },
                  )
                }
              />
              {state.action === 'discontinue' && (
                <Box style={FORM_MAX_WIDTH}>
                  <YearMonthSelect
                    yearOptions={discontinueYearOptions}
                    monthOptions={discontinueMonthOptions}
                    selectedYear={state.data.year}
                    selectedMonth={state.data.month}
                    onYearChange={(year) =>
                      setState({
                        action: 'discontinue',
                        data: { year, month: null },
                      })
                    }
                    onMonthChange={(month) =>
                      setState({
                        action: 'discontinue',
                        data: { ...state.data, month },
                      })
                    }
                    yearName="discontinue-year"
                    monthName="discontinue-month"
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  )
}
