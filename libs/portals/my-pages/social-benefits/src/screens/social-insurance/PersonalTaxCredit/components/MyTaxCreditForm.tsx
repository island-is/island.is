import { Box, Checkbox, Select, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PercentageInput } from './PercentageInput'
import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { m } from '../../../../lib/messages'
import { MyTaxCreditState } from '../PersonalTaxCredit'

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

const toYearOptions = (
  data: SocialInsuranceYearWithMonths[] | null | undefined,
) =>
  (data ?? [])
    .filter((ym): ym is typeof ym & { year: number } => ym.year != null)
    .map((ym) => ({ label: String(ym.year), value: ym.year }))

const toMonthOptions = (
  data: SocialInsuranceYearWithMonths[] | null | undefined,
  year: number | null,
  lang: string,
) =>
  (data?.find((ym) => ym.year === year)?.months ?? []).map((month) => ({
    label: new Intl.DateTimeFormat(lang, { month: 'long' }).format(
      new Date(2000, month - 1),
    ),
    value: month,
  }))

const REGISTER = 'register' as const
const UPDATE = 'update' as const
const DISCONTINUE = 'discontinue' as const

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
        state.action === REGISTER ? state.data.year : null,
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
        state.action === DISCONTINUE ? state.data.year : null,
        lang,
      ),
    [discontinuingMonthsAndYears, state, lang],
  )

  return (
    <Stack space={3}>
      {!isAlreadyRegistered && (
        <Box border="standard" borderRadius="large" background="white" padding={3}>
          <Stack space={3}>
            <Checkbox
              id="register-personal-tax-credit"
              label={<span style={{ fontWeight: state.action === REGISTER ? 600 : undefined }}>{formatMessage(m.registerPersonalTaxCredit)}</span>}
              checked={state.action === REGISTER}
              disabled={!monthsAndYears?.length}
              onChange={(e) =>
                setState(
                  e.target.checked
                    ? {
                        action: REGISTER,
                        data: { year: null, month: null, percentage: '' },
                      }
                    : { action: null },
                )
              }
            />
            {state.action === REGISTER && (
              <Box style={{ maxWidth: 480 }}>
                <Stack space={3}>
                  <Box display="flex" columnGap={3} alignItems="flexEnd">
                    <Box flexGrow={1}>
                      <Select
                        name="register-year"
                        label={formatMessage(m.fromWhatTime)}
                        placeholder={formatMessage(m.theYear)}
                        size="xs"
                        backgroundColor="blue"
                        options={yearOptions}
                        value={
                          state.data.year != null
                            ? yearOptions.find((o) => o.value === state.data.year)
                            : null
                        }
                        onChange={(opt) =>
                          setState({
                            action: REGISTER,
                            data: {
                              ...state.data,
                              year: opt ? (opt.value as number) : null,
                              month: null,
                            },
                          })
                        }
                        required
                      />
                    </Box>
                    <Box flexGrow={1}>
                      <Select
                        name="register-month"
                        label={formatMessage(m.month)}
                        placeholder={formatMessage(m.month)}
                        size="xs"
                        backgroundColor="blue"
                        options={registerMonthOptions}
                        value={
                          state.data.month != null
                            ? registerMonthOptions.find(
                                (o) => o.value === state.data.month,
                              )
                            : null
                        }
                        onChange={(opt) =>
                          setState({
                            action: REGISTER,
                            data: {
                              ...state.data,
                              month: opt ? (opt.value as number) : null,
                            },
                          })
                        }
                        isDisabled={state.data.year == null}
                      />
                    </Box>
                  </Box>
                  <PercentageInput
                    id="register-percentage"
                    name="register-percentage"
                    value={state.data.percentage}
                    onChange={(value) =>
                      setState({
                        action: REGISTER,
                        data: { ...state.data, percentage: value },
                      })
                    }
                    required
                  />
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {isAlreadyRegistered && (
        <>
          <Box border="standard" borderRadius="large" background="white" padding={3}>
            <Stack space={3}>
              <Checkbox
                id="edit-personal-tax-credit"
                label={<span style={{ fontWeight: state.action === UPDATE ? 600 : undefined }}>{formatMessage(m.editPersonalTaxCredit)}</span>}
                checked={state.action === UPDATE}
                onChange={(e) =>
                  setState(
                    e.target.checked
                      ? { action: UPDATE, data: { percentage: '' } }
                      : { action: null },
                  )
                }
              />
              {state.action === UPDATE && (
                <Box style={{ maxWidth: 480 }}>
                  <PercentageInput
                    id="edit-percentage"
                    name="edit-percentage"
                    value={state.data.percentage}
                    onChange={(value) =>
                      setState({ action: UPDATE, data: { percentage: value } })
                    }
                  />
                </Box>
              )}
            </Stack>
          </Box>

          <Box border="standard" borderRadius="large" background="white" padding={3}>
            <Stack space={3}>
              <Checkbox
                id="discontinue-personal-tax-credit"
                label={<span style={{ fontWeight: state.action === DISCONTINUE ? 600 : undefined }}>{formatMessage(m.discontinuePersonalTaxCredit)}</span>}
                checked={state.action === DISCONTINUE}
                disabled={!canDiscontinue || !discontinuingMonthsAndYears?.length}
                onChange={(e) =>
                  setState(
                    e.target.checked
                      ? { action: DISCONTINUE, data: { year: null, month: null } }
                      : { action: null },
                  )
                }
              />
              {state.action === DISCONTINUE && (
                <Box style={{ maxWidth: 480 }}>
                  <Box display="flex" columnGap={3} alignItems="flexEnd">
                    <Box flexGrow={1}>
                      <Select
                        name="discontinue-year"
                        label={formatMessage(m.fromWhatTime)}
                        placeholder={formatMessage(m.theYear)}
                        size="xs"
                        backgroundColor="blue"
                        options={discontinueYearOptions}
                        value={
                          state.data.year != null
                            ? discontinueYearOptions.find(
                                (o) => o.value === state.data.year,
                              )
                            : null
                        }
                        onChange={(opt) =>
                          setState({
                            action: DISCONTINUE,
                            data: {
                              year: opt ? (opt.value as number) : null,
                              month: null,
                            },
                          })
                        }
                      />
                    </Box>
                    <Box flexGrow={1}>
                      <Select
                        name="discontinue-month"
                        label={formatMessage(m.month)}
                        placeholder={formatMessage(m.month)}
                        size="xs"
                        backgroundColor="blue"
                        options={discontinueMonthOptions}
                        value={
                          state.data.month != null
                            ? discontinueMonthOptions.find(
                                (o) => o.value === state.data.month,
                              )
                            : null
                        }
                        onChange={(opt) =>
                          setState({
                            action: DISCONTINUE,
                            data: {
                              ...state.data,
                              month: opt ? (opt.value as number) : null,
                            },
                          })
                        }
                        isDisabled={state.data.year == null}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  )
}
