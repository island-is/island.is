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
  PersonalFormValues,
  toYearOptions,
  toMonthOptions,
} from './taxCreditFormUtils'

interface Props {
  form: UseFormReturn<PersonalFormValues>
  monthsAndYears: SocialInsuranceYearWithMonths[] | null | undefined
  discontinuingMonthsAndYears:
    | SocialInsuranceYearWithMonths[]
    | null
    | undefined
  isAlreadyRegistered: boolean
  canDiscontinue: boolean
}

export const PersonalTaxCreditForm: FC<Props> = ({
  form,
  monthsAndYears,
  discontinuingMonthsAndYears,
  isAlreadyRegistered,
  canDiscontinue,
}) => {
  const { formatMessage } = useLocale()
  const action = form.watch('action')
  const year = form.watch('year')
  const errorMessage = form.formState.errors.root?.message

  const yearOptions = useMemo(
    () => toYearOptions(monthsAndYears),
    [monthsAndYears],
  )
  const registerMonthOptions = useMemo(
    () =>
      toMonthOptions(
        monthsAndYears,
        action === 'register' ? year : null,
        formatMessage,
      ),
    [monthsAndYears, action, year, formatMessage],
  )
  const discontinueYearOptions = useMemo(
    () => toYearOptions(discontinuingMonthsAndYears),
    [discontinuingMonthsAndYears],
  )
  const discontinueMonthOptions = useMemo(
    () =>
      toMonthOptions(
        discontinuingMonthsAndYears,
        action === 'discontinue' ? year : null,
        formatMessage,
      ),
    [discontinuingMonthsAndYears, action, year, formatMessage],
  )

  const setAction = (next: PersonalFormValues['action']) => {
    form.setValue('action', next, { shouldValidate: true })
    form.setValue('year', null)
    form.setValue('month', null)
    form.setValue('percentage', '')
  }

  return (
    <Stack space={2}>
      {errorMessage && <AlertMessage type="error" message={errorMessage} />}

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
                  fontWeight={action === 'register' ? 'semiBold' : undefined}
                >
                  {formatMessage(m.registerPersonalTaxCredit)}
                </Text>
              }
              checked={action === 'register'}
              disabled={!monthsAndYears?.length}
              onChange={(e) => setAction(e.target.checked ? 'register' : null)}
            />
            {action === 'register' && (
              <Box paddingLeft={5}>
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
                                name="register-year"
                                label={formatMessage(m.fromWhatTime)}
                                placeholder={formatMessage(m.theYear)}
                                size="xs"
                                backgroundColor="white"
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
                                name="register-month"
                                label={formatMessage(m.month)}
                                placeholder={formatMessage(m.month)}
                                size="xs"
                                backgroundColor="white"
                                options={registerMonthOptions}
                                value={
                                  registerMonthOptions.find(
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
                        <GridColumn span={['9/12', '10/12', '10/12', '11/12']}>
                          <Controller
                            control={form.control}
                            name="percentage"
                            rules={{ required: true, min: 1 }}
                            render={({ field }) => (
                              <PercentageInput
                                id="register-percentage"
                                name="register-percentage"
                                value={field.value}
                                onChange={field.onChange}
                                required
                                backgroundColor="white"
                              />
                            )}
                          />
                        </GridColumn>
                      </GridRow>
                    </Stack>
                  </GridColumn>
                </GridRow>
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
                    fontWeight={action === 'update' ? 'semiBold' : undefined}
                  >
                    {formatMessage(m.editPersonalTaxCredit)}
                  </Text>
                }
                checked={action === 'update'}
                onChange={(e) => setAction(e.target.checked ? 'update' : null)}
              />
              {action === 'update' && (
                <Box paddingLeft={5}>
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                      <Controller
                        control={form.control}
                        name="percentage"
                        rules={{ required: true, min: 1 }}
                        render={({ field }) => (
                          <PercentageInput
                            id="edit-percentage"
                            name="edit-percentage"
                            value={field.value}
                            onChange={field.onChange}
                            required
                          />
                        )}
                      />
                    </GridColumn>
                  </GridRow>
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
                      action === 'discontinue' ? 'semiBold' : undefined
                    }
                  >
                    {formatMessage(m.discontinuePersonalTaxCredit)}
                  </Text>
                }
                checked={action === 'discontinue'}
                disabled={
                  !canDiscontinue || !discontinuingMonthsAndYears?.length
                }
                onChange={(e) =>
                  setAction(e.target.checked ? 'discontinue' : null)
                }
              />
              {action === 'discontinue' && (
                <Box paddingLeft={5}>
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                      <Columns space={3} alignY="bottom">
                        <Column>
                          <Controller
                            control={form.control}
                            name="year"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                name="discontinue-year"
                                label={formatMessage(m.fromWhatTime)}
                                placeholder={formatMessage(m.theYear)}
                                size="xs"
                                backgroundColor="blue"
                                options={discontinueYearOptions}
                                value={
                                  discontinueYearOptions.find(
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
                                name="discontinue-month"
                                label={formatMessage(m.month)}
                                placeholder={formatMessage(m.month)}
                                size="xs"
                                backgroundColor="blue"
                                options={discontinueMonthOptions}
                                value={
                                  discontinueMonthOptions.find(
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
                    </GridColumn>
                  </GridRow>
                </Box>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  )
}
