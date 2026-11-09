import React, { FC, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  ModalBase,
  RadioButton,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { coreMessages, getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getDateRanges } from '@island.is/application/ui-components/annual-multi-range-calendar/utils'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Controller, useFormContext } from 'react-hook-form'
import { applicationMessages as m, monthMessages } from '../lib/messages'
import {
  formatDateRange,
  getDateRangeKey,
  getMonthlyAmountsFromVisits,
  getNegativePerVisitAmountKeys,
  getOvernightDates,
  hasNoOvernightStays,
  parseAmount,
} from '../utils/homeLodgings'
import * as styles from './styles.css'

type PricingMethod = 'monthly' | 'perVisit'

export const Pricing: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()
  const { clearErrors, formState, setError, unregister, watch, setValue } =
    useFormContext()
  const { errors } = formState
  const [pendingPricingMethod, setPendingPricingMethod] =
    useState<PricingMethod>('monthly')
  const [pricingModalVisible, setPricingModalVisible] = useState(false)
  const selectedDates = (watch('overnightDates') ?? []) as string[]
  const overnightDates = getOvernightDates(selectedDates)
  const pricingMethod =
    (watch('pricing.method') as PricingMethod | undefined) ?? 'monthly'
  const noOvernightStays = hasNoOvernightStays({
    noOvernightStays: watch('noOvernightStays'),
  })
  const year = Number(watch('year')) || new Date().getFullYear()

  const selectedMonths = monthMessages.flatMap((monthMessage, monthIndex) => {
    const numberOfNights = overnightDates.filter(
      (date) => Number(date.slice(5, 7)) === monthIndex + 1,
    ).length

    return numberOfNights > 0
      ? [
          {
            monthName: formatMessage(monthMessage),
            monthIndex,
            numberOfNights,
          },
        ]
      : []
  })
  const selectedVisits = getDateRanges(selectedDates)
  const monthBoundaryPairs = Array.from(
    new Map(
      selectedVisits
        .flatMap(({ from, to }) => {
          const fromMonth = Number(from.slice(5, 7)) - 1
          const toMonth = Number(to.slice(5, 7)) - 1

          return Array.from(
            { length: Math.max(0, toMonth - fromMonth) },
            (_, index) => {
              const monthIndex = fromMonth + index

              return {
                monthIndices: [monthIndex, monthIndex + 1],
                label: `${formatMessage(
                  monthMessages[monthIndex],
                ).toLocaleLowerCase('is-IS')}/${formatMessage(
                  monthMessages[monthIndex + 1],
                ).toLocaleLowerCase('is-IS')}`,
              }
            },
          )
        })
        .map((pair) => [pair.monthIndices.join('-'), pair]),
    ).values(),
  )
  const monthsCrossingBoundaries = new Set(
    monthBoundaryPairs.flatMap(({ monthIndices }) => monthIndices),
  )
  const perVisitAmounts =
    (watch('pricing.perVisitAmounts') as
      | Record<string, string | number>
      | undefined) ?? {}
  const monthlyAmounts =
    (watch('pricing.monthlyAmounts') as
      | Record<string, string | number>
      | undefined) ?? {}
  const hasPerVisitAmounts = Object.values(perVisitAmounts).some(
    (amount) => parseAmount(amount) > 0,
  )
  const hasMonthlyAmounts = Object.values(monthlyAmounts).some(
    (amount) => parseAmount(amount) > 0,
  )
  const monthlyAmountKeys = selectedMonths.map(
    ({ monthIndex }) => `month${monthIndex}`,
  )
  const perVisitAmountKeys = selectedVisits.map(getDateRangeKey)
  const staleAmountFields = [
    ...Object.keys(monthlyAmounts)
      .filter((key) => !monthlyAmountKeys.includes(key))
      .map((key) => `pricing.monthlyAmounts.${key}`),
    ...Object.keys(perVisitAmounts)
      .filter((key) => !perVisitAmountKeys.includes(key))
      .map((key) => `pricing.perVisitAmounts.${key}`),
  ]
  const staleAmountFieldKey = staleAmountFields.join()

  /**
   * Amounts are only required for the periods currently shown. Dropping a date range
   * from the calendar would otherwise leave behind an amount that can never be edited
   * but still fails validation.
   */
  useEffect(() => {
    if (staleAmountFieldKey.length > 0) {
      unregister(staleAmountFieldKey.split(','))
    }
  }, [staleAmountFieldKey, unregister])

  const setPricingMethod = (method: PricingMethod) => {
    setValue('pricing.method', method, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const clearPricingErrors = () => {
    clearErrors(['pricing.monthlyAmounts', 'pricing.perVisitAmounts'])
  }

  const convertVisitsToMonthlyAmounts = () => {
    const negativeAmountKeys = getNegativePerVisitAmountKeys({
      perVisitAmounts,
      visitRanges: selectedVisits,
    })

    if (negativeAmountKeys.length > 0) {
      negativeAmountKeys.forEach((key) => {
        setError(`pricing.perVisitAmounts.${key}`, {
          type: 'manual',
          message: formatMessage(m.pricingAmountInvalid),
        })
      })
      return
    }

    const convertedAmounts = getMonthlyAmountsFromVisits({
      perVisitAmounts,
      visitRanges: selectedVisits,
    })
    // Write back the same integer numeric string the amount inputs produce.
    // They run with `isNumericString`, so a grouped value such as "175.000"
    // would be read back as 175.
    const convertedAmountValues = Object.fromEntries(
      Object.entries(convertedAmounts).map(([key, amount]) => [
        key,
        String(amount),
      ]),
    )

    setValue('pricing.monthlyAmounts', convertedAmountValues, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue(
      'pricing.perVisitAmounts',
      {},
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
    setPricingMethod('monthly')
    clearPricingErrors()
  }

  const startPerVisitAmounts = () => {
    setValue(
      'pricing.monthlyAmounts',
      {},
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
    setValue(
      'pricing.perVisitAmounts',
      {},
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
    setPricingMethod('perVisit')
    clearPricingErrors()
  }

  const changePricingMethod = (method: PricingMethod) => {
    if (method === 'monthly') {
      convertVisitsToMonthlyAmounts()
      return
    }

    startPerVisitAmounts()
  }

  const confirmPricingMethodChange = () => {
    changePricingMethod(pendingPricingMethod)
  }

  const renderPricingOption = (
    method: PricingMethod,
    label: string,
    requiresConfirmation: boolean,
  ) => {
    return (
      <RadioButton
        id={`pricing-method-${method}`}
        name="pricing.method"
        value={method}
        label={label}
        checked={pricingMethod === method}
        large
        backgroundColor="blue"
        onChange={() => {
          if (requiresConfirmation) {
            setPendingPricingMethod(method)
            setPricingModalVisible(true)
          } else {
            changePricingMethod(method)
          }
        }}
      />
    )
  }

  if (noOvernightStays) {
    return <Text>{formatMessage(m.pricingNoStays, { year })}</Text>
  }

  if (selectedMonths.length === 0) {
    return <Text>{formatMessage(m.pricingSelectDatesFirst)}</Text>
  }

  return (
    <Box>
      <Text variant="h4" marginBottom={1}>
        {formatMessage(m.pricingTitle, { year })}
      </Text>
      <Text variant="small" marginBottom={3}>
        {formatMessage(m.pricingDescription)}
      </Text>
      <Controller
        name="pricing.method"
        defaultValue="monthly"
        render={() => (
          <GridRow>
            <GridColumn span={['1/1', '1/2']} paddingBottom={3}>
              {renderPricingOption(
                'monthly',
                formatMessage(m.monthlyPricingOption),
                pricingMethod === 'perVisit' && hasPerVisitAmounts,
              )}
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={3}>
              {renderPricingOption(
                'perVisit',
                formatMessage(m.perVisitPricingOption),
                pricingMethod === 'monthly' && hasMonthlyAmounts,
              )}
            </GridColumn>
          </GridRow>
        )}
      />
      {pricingMethod === 'monthly' && monthBoundaryPairs.length > 0 && (
        <Box marginBottom={4}>
          <AlertMessage
            type="warning"
            title={formatMessage(m.pricingNoticeTitle)}
            message={
              <Text variant="small">
                {formatMessage(m.pricingNoticeMessage)}{' '}
                {formatMessage(m.pricingNoticePeriods, {
                  periods: (
                    <Text as="span" variant="small" fontWeight="semiBold">
                      {monthBoundaryPairs
                        .map(({ label }) => label)
                        .join(' og ')}
                    </Text>
                  ),
                })}
              </Text>
            }
          />
        </Box>
      )}
      {pricingMethod === 'monthly' && hasPerVisitAmounts && (
        <Box marginBottom={4}>
          <AlertMessage
            type="info"
            title={formatMessage(m.pricingPrefillTitle)}
            message={
              <Box>
                <Text variant="small">
                  {formatMessage(m.pricingPrefillMessage)}
                </Text>
                <Box marginTop={2}>
                  <Button
                    variant="text"
                    size="small"
                    icon="arrowForward"
                    onClick={convertVisitsToMonthlyAmounts}
                  >
                    {formatMessage(m.pricingConvertButton)}
                  </Button>
                </Box>
              </Box>
            }
          />
        </Box>
      )}
      {pricingMethod === 'perVisit' && monthBoundaryPairs.length > 0 && (
        <Box marginBottom={4}>
          <AlertMessage
            type="info"
            title={formatMessage(m.pricingNoticeTitle)}
            message={
              <Text variant="small">
                {formatMessage(m.pricingPerVisitSplitMessage)}
              </Text>
            }
          />
        </Box>
      )}
      <Box className={styles.pricingRows}>
        {pricingMethod === 'monthly'
          ? selectedMonths.map(({ monthName, monthIndex, numberOfNights }) => (
              <GridRow key={monthName} rowGap={2}>
                <GridColumn span={['12/12', '4/12']}>
                  <Box className={styles.readOnlyInput}>
                    <Text variant="eyebrow" color="blue400">
                      {formatMessage(m.pricingPeriodLabel)}
                    </Text>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="spaceBetween"
                    >
                      <Text variant="medium" fontWeight="semiBold">
                        {monthName}
                      </Text>
                      <Icon icon="calendar" type="outline" color="blue400" />
                    </Box>
                  </Box>
                </GridColumn>
                <GridColumn span={['12/12', '3/12']}>
                  <Box className={styles.readOnlyInput}>
                    <Box display="flex" alignItems="center">
                      <Text variant="eyebrow" color="blue400">
                        {formatMessage(m.pricingNightsLabel)}
                      </Text>
                      {monthsCrossingBoundaries.has(monthIndex) && (
                        <Box marginLeft={1} display="flex">
                          <Tooltip
                            placement="top"
                            text={formatMessage(m.pricingMonthBoundaryTooltip)}
                          />
                        </Box>
                      )}
                    </Box>
                    <Text variant="medium" fontWeight="semiBold">
                      {numberOfNights}
                    </Text>
                  </Box>
                </GridColumn>
                <GridColumn span={['12/12', '5/12']}>
                  <InputController
                    id={`pricing.monthlyAmounts.month${monthIndex}`}
                    name={`pricing.monthlyAmounts.month${monthIndex}`}
                    label={formatMessage(m.pricingAmountLabel)}
                    backgroundColor="blue"
                    placeholder="kr."
                    type="number"
                    thousandSeparator
                    decimalScale={0}
                    suffix=" kr."
                    rightAlign
                    size="sm"
                    required
                    error={getErrorViaPath(
                      errors,
                      `pricing.monthlyAmounts.month${monthIndex}`,
                    )}
                    defaultValue={
                      monthlyAmounts[`month${monthIndex}`]?.toString() ?? ''
                    }
                  />
                </GridColumn>
              </GridRow>
            ))
          : selectedVisits.map((range) => {
              const rangeKey = getDateRangeKey(range)

              return (
                <GridRow key={rangeKey} rowGap={2}>
                  <GridColumn span={['12/12', '6/12']}>
                    <Box className={styles.readOnlyInput}>
                      <Text variant="eyebrow" color="blue400">
                        {formatMessage(m.pricingPeriodLabel)}
                      </Text>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="spaceBetween"
                      >
                        <Text variant="medium" fontWeight="semiBold">
                          {formatDateRange(range)}
                        </Text>
                        <Icon icon="calendar" type="outline" color="blue400" />
                      </Box>
                    </Box>
                  </GridColumn>
                  <GridColumn span={['12/12', '6/12']}>
                    <InputController
                      id={`pricing.perVisitAmounts.${rangeKey}`}
                      name={`pricing.perVisitAmounts.${rangeKey}`}
                      label={formatMessage(m.pricingAmountLabel)}
                      backgroundColor="blue"
                      placeholder="kr."
                      type="number"
                      thousandSeparator
                      decimalScale={0}
                      suffix=" kr."
                      allowNegative={false}
                      rightAlign
                      size="sm"
                      required
                      error={getErrorViaPath(
                        errors,
                        `pricing.perVisitAmounts.${rangeKey}`,
                      )}
                      defaultValue={perVisitAmounts[rangeKey]?.toString() ?? ''}
                    />
                  </GridColumn>
                </GridRow>
              )
            })}
      </Box>
      <ModalBase
        baseId="pricing-method-confirmation"
        isVisible={pricingModalVisible}
        modalLabel={formatMessage(
          pendingPricingMethod === 'monthly'
            ? m.pricingConvertTitle
            : m.pricingPerVisitSwitchTitle,
        )}
        onVisibilityChange={setPricingModalVisible}
        hideOnClickOutside
      >
        {({ closeModal }) => {
          const changingToMonthly = pendingPricingMethod === 'monthly'

          return (
            <Box
              background="white"
              paddingY={[3, 6, 12]}
              paddingX={[3, 6, 12, 15]}
            >
              <Text variant="h2" as="h2" marginBottom={1}>
                {formatMessage(
                  changingToMonthly
                    ? m.pricingConvertTitle
                    : m.pricingPerVisitSwitchTitle,
                )}
              </Text>
              <Text paddingTop={2}>
                {formatMessage(
                  changingToMonthly
                    ? m.pricingConvertMessage
                    : m.pricingPerVisitSwitchMessage,
                )}
              </Text>
              <Box
                marginTop={4}
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Button variant="ghost" size="small" onClick={closeModal}>
                  {formatMessage(coreMessages.buttonCancel)}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    confirmPricingMethodChange()
                    closeModal()
                  }}
                >
                  {formatMessage(
                    changingToMonthly
                      ? m.pricingConvertButton
                      : m.pricingPerVisitSwitchButton,
                  )}
                </Button>
              </Box>
            </Box>
          )
        }}
      </ModalBase>
    </Box>
  )
}
