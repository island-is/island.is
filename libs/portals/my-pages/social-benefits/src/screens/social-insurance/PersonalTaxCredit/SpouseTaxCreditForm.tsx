import {
  AlertMessage,
  Box,
  Checkbox,
  Column,
  Columns,
  GridColumn,
  GridRow,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PercentageInput } from './components/PercentageInput'
import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { FC, useMemo } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { m } from '../../../lib/messages'
import {
  SpouseFormValues,
  toYearOptions,
  toMonthOptions,
  DECEASED_SPOUSE_ERROR_CODES,
} from './taxCreditFormUtils'

interface Props {
  form: UseFormReturn<SpouseFormValues>
  monthsAndYears: SocialInsuranceYearWithMonths[] | null | undefined
  deceasedMonthsAndYears: SocialInsuranceYearWithMonths[] | null | undefined
  deceasedReasonNotAllowedCode?: string | null
  spouseName?: string | null
  spouseNationalId?: string | null
  spouseIsDeceased?: boolean | null
}

export const SpouseTaxCreditForm: FC<Props> = ({
  form,
  monthsAndYears,
  deceasedMonthsAndYears,
  deceasedReasonNotAllowedCode,
  spouseName,
  spouseNationalId,
  spouseIsDeceased,
}) => {
  const { formatMessage } = useLocale()
  const action = form.watch('action')
  const year = form.watch('year')
  const errorMessage = form.formState.errors.root?.message

  const yearOptions = useMemo(
    () => toYearOptions(monthsAndYears),
    [monthsAndYears],
  )
  const deceasedYearOptions = useMemo(
    () => toYearOptions(deceasedMonthsAndYears),
    [deceasedMonthsAndYears],
  )
  const grantMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        action === 'grant' ? year : null,
        formatMessage,
      ),
    [monthsAndYears, action, year, formatMessage],
  )
  const deceasedMonthOptions = useMemo(
    () =>
      toMonthOptions(
        deceasedMonthsAndYears,
        action === 'deceased' ? year : null,
        formatMessage,
      ),
    [deceasedMonthsAndYears, action, year, formatMessage],
  )

  const setAction = (next: SpouseFormValues['action']) => {
    form.setValue('action', next, { shouldValidate: true })
    form.setValue('year', null)
    form.setValue('month', null)
    form.setValue('percentage', '')
  }

  return (
    <Stack space={3}>
      <Checkbox
        id="grant-spouse-tax-credit"
        label={
          <Text
            as="span"
            fontWeight={action === 'grant' ? 'semiBold' : undefined}
          >
            {formatMessage(m.grantSpouseTaxCredit)}
          </Text>
        }
        checked={action === 'grant'}
        onChange={(e) => setAction(e.target.checked ? 'grant' : null)}
      />
      {action === 'grant' && (
        <Box paddingLeft={5}>
          {spouseIsDeceased ? (
            <AlertMessage
              type="warning"
              message={formatMessage(m.grantSpouseNotAllowedDeceased)}
            />
          ) : spouseName || spouseNationalId ? (
            <Stack space={3}>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                  <Stack space={3}>
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
                    <Columns space={3} alignY="bottom">
                      <Column>
                        <Controller
                          control={form.control}
                          name="year"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              name="grant-year"
                              label={formatMessage(m.fromWhatTime)}
                              placeholder={formatMessage(m.theYear)}
                              size="xs"
                              backgroundColor="blue"
                              options={yearOptions}
                              value={
                                yearOptions.find(
                                  (o) => o.value === field.value,
                                ) ?? null
                              }
                              onChange={(opt) => {
                                field.onChange(opt?.value ?? null)
                                form.setValue('month', null)
                              }}
                              required
                            />
                          )}
                        />
                      </Column>
                      <Column>
                        <Controller
                          control={form.control}
                          name="month"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              name="grant-month"
                              label={formatMessage(m.month)}
                              placeholder={formatMessage(m.month)}
                              size="xs"
                              backgroundColor="blue"
                              options={grantMonthOptions}
                              value={
                                grantMonthOptions.find(
                                  (o) => o.value === field.value,
                                ) ?? null
                              }
                              onChange={(opt) =>
                                field.onChange(opt?.value ?? null)
                              }
                              isDisabled={year == null}
                              required
                            />
                          )}
                        />
                      </Column>
                    </Columns>
                    <GridRow>
                      <GridColumn span={['8/12', '9/12']}>
                        <Controller
                          control={form.control}
                          name="percentage"
                          rules={{ required: true, min: 1 }}
                          render={({ field }) => (
                            <PercentageInput
                              id="grant-percentage"
                              name="grant-percentage"
                              value={field.value}
                              onChange={field.onChange}
                              required
                            />
                          )}
                        />
                      </GridColumn>
                    </GridRow>
                  </Stack>
                </GridColumn>
              </GridRow>
              {errorMessage && (
                <AlertMessage type="error" message={errorMessage} />
              )}
            </Stack>
          ) : (
            <AlertMessage
              type="warning"
              message={formatMessage(m.spouseInfoNotFound)}
            />
          )}
        </Box>
      )}

      <Checkbox
        id="spouse-deceased-tax-credit"
        label={
          <Text
            as="span"
            fontWeight={action === 'deceased' ? 'semiBold' : undefined}
          >
            {formatMessage(m.spouseDeceasedTaxCredit)}
          </Text>
        }
        checked={action === 'deceased'}
        onChange={(e) => setAction(e.target.checked ? 'deceased' : null)}
      />
      {action === 'deceased' && (
        <Box paddingLeft={5}>
          {deceasedReasonNotAllowedCode || !deceasedMonthsAndYears?.length ? (
            <AlertMessage
              type="warning"
              message={formatMessage(
                deceasedReasonNotAllowedCode ===
                  DECEASED_SPOUSE_ERROR_CODES.DATE_OF_DEATH_NOT_WITHIN_VALID_RANGE
                  ? m.deceasedSpouseDateOfDeathOutOfRange
                  : m.deceasedSpouseNotRegistered,
              )}
            />
          ) : (
            <Stack space={3}>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                  <Stack space={3}>
                    <Columns space={3} alignY="bottom">
                      <Column>
                        <Controller
                          control={form.control}
                          name="year"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              name="deceased-year"
                              label={formatMessage(m.fromWhatTime)}
                              placeholder={formatMessage(m.theYear)}
                              size="xs"
                              backgroundColor="blue"
                              options={deceasedYearOptions}
                              value={
                                deceasedYearOptions.find(
                                  (o) => o.value === field.value,
                                ) ?? null
                              }
                              onChange={(opt) => {
                                field.onChange(opt?.value ?? null)
                                form.setValue('month', null)
                              }}
                              required
                            />
                          )}
                        />
                      </Column>
                      <Column>
                        <Controller
                          control={form.control}
                          name="month"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              name="deceased-month"
                              label={formatMessage(m.month)}
                              placeholder={formatMessage(m.month)}
                              size="xs"
                              backgroundColor="blue"
                              options={deceasedMonthOptions}
                              value={
                                deceasedMonthOptions.find(
                                  (o) => o.value === field.value,
                                ) ?? null
                              }
                              onChange={(opt) =>
                                field.onChange(opt?.value ?? null)
                              }
                              isDisabled={year == null}
                              required
                            />
                          )}
                        />
                      </Column>
                    </Columns>
                    <GridRow>
                      <GridColumn span={['8/12', '9/12']}>
                        <Controller
                          control={form.control}
                          name="percentage"
                          rules={{ required: true, min: 1 }}
                          render={({ field }) => (
                            <PercentageInput
                              id="deceased-percentage"
                              name="deceased-percentage"
                              value={field.value}
                              onChange={field.onChange}
                              required
                            />
                          )}
                        />
                      </GridColumn>
                    </GridRow>
                  </Stack>
                </GridColumn>
              </GridRow>
              {errorMessage && (
                <AlertMessage type="error" message={errorMessage} />
              )}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  )
}
