import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages, Tooltip } from '@island.is/portals/my-pages/core'
import { PercentageInput } from './PercentageInput'
import { SocialInsuranceSpousalTaxCardEligibility } from '@island.is/api/schema'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { m } from '../../../../lib/messages'
import { SpouseState } from '../PersonalTaxCredit'

interface Props {
  state: SpouseState
  setState: Dispatch<SetStateAction<SpouseState>>
  spouseEligibility: SocialInsuranceSpousalTaxCardEligibility | null | undefined
  saving: boolean
  onSave: () => void
}

export const SpouseTaxCreditForm: FC<Props> = ({
  state,
  setState,
  spouseEligibility,
  saving,
  onSave,
}) => {
  const { formatMessage, lang } = useLocale()

  const spouseYearOptions = useMemo(
    () =>
      (spouseEligibility?.allowedYearMonths ?? [])
        .filter((ym): ym is typeof ym & { year: number } => ym.year != null)
        .map((ym) => ({ label: String(ym.year), value: ym.year })),
    [spouseEligibility],
  )

  const spouseMonthOptions = useMemo(() => {
    const yearMonths = spouseEligibility?.allowedYearMonths?.find(
      (ym) => ym.year === state.year,
    )
    return (yearMonths?.months ?? []).map((month) => ({
      label: new Intl.DateTimeFormat(lang, { month: 'long' }).format(
        new Date(2000, month - 1),
      ),
      value: month,
    }))
  }, [spouseEligibility, state.year, lang])

  return (
    <Box>
      <Stack space={2}>
        <Checkbox
          id="spouse-deceased-tax-credit"
          label={formatMessage(m.spouseDeceasedTaxCredit)}
          checked={state.deceased}
          disabled={!spouseEligibility?.canApply}
          onChange={(e) =>
            setState((s) => ({ ...s, deceased: e.target.checked }))
          }
        />
        {state.deceased && (
          <Box paddingLeft={7}>
            <Box style={{ maxWidth: 480 }}>
              <Stack space={3}>
                <Text>{formatMessage(m.spouseDeceasedInfo)}</Text>
                {spouseEligibility?.reasonNotAllowed ? (
                  <AlertMessage
                    type="warning"
                    message={spouseEligibility.reasonNotAllowed}
                  />
                ) : (
                  <>
                    <Box display="flex" columnGap={3} alignItems="flexEnd">
                      <Box flexGrow={1}>
                        <Select
                          name="spouse-deceased-year"
                          label={formatMessage(m.fromWhatTime)}
                          placeholder={formatMessage(m.theYear)}
                          size="xs"
                          backgroundColor="blue"
                          options={spouseYearOptions}
                          value={
                            state.year != null
                              ? spouseYearOptions.find(
                                  (o) => o.value === state.year,
                                )
                              : null
                          }
                          onChange={(opt) =>
                            setState((s) => ({
                              ...s,
                              year: opt ? (opt.value as number) : null,
                              month: null,
                            }))
                          }
                          isDisabled={!spouseEligibility?.canApply}
                        />
                      </Box>
                      <Box flexGrow={1}>
                        <Select
                          name="spouse-deceased-month"
                          label={formatMessage(m.month)}
                          placeholder={formatMessage(m.month)}
                          size="xs"
                          backgroundColor="blue"
                          options={spouseMonthOptions}
                          value={
                            state.month != null
                              ? spouseMonthOptions.find(
                                  (o) => o.value === state.month,
                                )
                              : null
                          }
                          onChange={(opt) =>
                            setState((s) => ({
                              ...s,
                              month: opt ? (opt.value as number) : null,
                            }))
                          }
                          isDisabled={
                            !spouseEligibility?.canApply || state.year == null
                          }
                        />
                      </Box>
                    </Box>
                    <PercentageInput
                      id="spouse-deceased-percentage"
                      name="spouse-deceased-percentage"
                      value={state.percentage}
                      onChange={(value) =>
                        setState((s) => ({ ...s, percentage: value }))
                      }
                      disabled={!spouseEligibility?.canApply}
                    />
                  </>
                )}
              </Stack>
            </Box>
          </Box>
        )}
        <Checkbox
          id="grant-spouse-tax-credit"
          label={
            <>
              {formatMessage(m.grantSpouseTaxCredit)}{' '}
              <Tooltip
                text={formatMessage(m.grantSpouseTaxCreditInfo)}
                variant="light"
                placement="right"
              />
            </>
          }
          checked={state.grant}
          onChange={(e) => setState((s) => ({ ...s, grant: e.target.checked }))}
        />
      </Stack>
      <Box marginTop={3}>
        <Button
          onClick={onSave}
          disabled={
            (!state.deceased && !state.grant) ||
            (state.deceased &&
              (!!spouseEligibility?.reasonNotAllowed ||
                state.year == null ||
                state.month == null)) ||
            saving
          }
          loading={saving}
          size="small"
        >
          {formatMessage(coreMessages.save)}
        </Button>
      </Box>
    </Box>
  )
}
