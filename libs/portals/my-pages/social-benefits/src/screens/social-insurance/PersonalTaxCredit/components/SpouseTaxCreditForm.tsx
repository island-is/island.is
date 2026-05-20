import { Box, Checkbox, Select, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PercentageInput } from './PercentageInput'
import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { m } from '../../../../lib/messages'
import { SpouseTaxCreditState } from '../PersonalTaxCredit'

interface Props {
  state: SpouseTaxCreditState
  setState: Dispatch<SetStateAction<SpouseTaxCreditState>>
  monthsAndYears: SocialInsuranceYearWithMonths[] | null | undefined
  spouseName?: string | null
  spouseNationalId?: string | null
  spouseIsDeceased?: boolean | null
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
          <Box style={{ maxWidth: 480 }}>
            <Stack space={3}>
              {(spouseName || spouseNationalId) && (
                <Box>
                  {spouseName && <Text>{spouseName}</Text>}
                  {spouseNationalId && (
                    <Text>kt. {spouseNationalId}</Text>
                  )}
                </Box>
              )}
              <Box display="flex" columnGap={3} alignItems="flexEnd">
                <Box flexGrow={1}>
                  <Select
                    name="grant-year"
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
                        action: GRANT,
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
                    name="grant-month"
                    label={formatMessage(m.month)}
                    placeholder={formatMessage(m.month)}
                    size="xs"
                    backgroundColor="blue"
                    options={grantMonthOptions}
                    value={
                      state.data.month != null
                        ? grantMonthOptions.find(
                            (o) => o.value === state.data.month,
                          )
                        : null
                    }
                    onChange={(opt) =>
                      setState({
                        action: GRANT,
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
          <Box style={{ maxWidth: 480 }}>
            <Stack space={3}>
              <Box display="flex" columnGap={3} alignItems="flexEnd">
                <Box flexGrow={1}>
                  <Select
                    name="deceased-year"
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
                        action: DECEASED,
                        data: {
                          year: opt ? (opt.value as number) : null,
                          month: null,
                          percentage: state.data.percentage,
                        },
                      })
                    }
                    required
                  />
                </Box>
                <Box flexGrow={1}>
                  <Select
                    name="deceased-month"
                    label={formatMessage(m.month)}
                    placeholder={formatMessage(m.month)}
                    size="xs"
                    backgroundColor="blue"
                    options={deceasedMonthOptions}
                    value={
                      state.data.month != null
                        ? deceasedMonthOptions.find(
                            (o) => o.value === state.data.month,
                          )
                        : null
                    }
                    onChange={(opt) =>
                      setState({
                        action: DECEASED,
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
