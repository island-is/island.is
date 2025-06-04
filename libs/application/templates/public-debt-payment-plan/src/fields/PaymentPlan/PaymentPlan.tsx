import {
  GetScheduleDistributionInput,
  PaymentScheduleDistribution,
} from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AccordionItem,
  AlertMessage,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'
import React, { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import HtmlParser from 'react-html-parser'
import { useLazyDistribution } from '../../hooks/useLazyDistribution'
import { shared } from '../../lib/messages'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { formatIsk, isApplicantPerson } from '../../lib/paymentPlanUtils'
import { AMOUNT, MONTHS } from '../../shared/constants'
import {
  getEmptyPaymentPlanEntryKey,
  getPaymentPlanKeyById,
} from '../../shared/utils'
import {
  PaymentModeState,
  PaymentPlans,
  PrerequisitesResult,
} from '../../types'
import { PaymentPlanTable } from '../components/PaymentPlanTable/PaymentPlanTable'
import { PlanSlider } from '../components/PlanSlider/PlanSlider'
import { PaymentPlanCard } from '../PaymentPlanList/PaymentPlanCard/PaymentPlanCard'
import * as styles from './PaymentPlan.css'
import { useDebouncedSliderValues } from './useDebouncedSliderValues'

// An array might not work for this schema
// Might need to define specific fields for each one
export const PaymentPlan = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { register, setValue } = useFormContext()
  const getDistribution = useLazyDistribution()

  const [isLoading, setIsLoading] = useState(false)
  const [distributionData, setDistributionData] =
    useState<PaymentScheduleDistribution | null>(null)
  const [displayInfo, setDisplayInfo] = useState(false)

  const index = field.defaultValue as number

  const paymentPlans = getValueViaPath(
    application.answers,
    'paymentPlans',
  ) as PaymentPlans

  const paymentPlanPrerequisites = getValueViaPath(
    application.externalData,
    'paymentPlanPrerequisites',
  ) as PrerequisitesResult

  // Assign a payment to this screen by using the index of the step
  const payment = paymentPlanPrerequisites?.data?.debts[index]

  // Geta min/max month and min/max payment data
  const initialMinMaxData =
    paymentPlanPrerequisites?.data?.allInitialSchedules.find(
      (x) => x.scheduleType === payment?.type,
    )

  // Locate the entry of the payment plan in answers.
  const entryKey = getPaymentPlanKeyById(paymentPlans, payment?.type || '')

  // If no entry is found, find an empty entry to assign to this payment
  const answerKey = (entryKey ||
    getEmptyPaymentPlanEntryKey(paymentPlans)) as keyof typeof paymentPlans

  const entry = `paymentPlans.${answerKey}`
  const currentAnswers = paymentPlans ? paymentPlans[answerKey] : undefined
  const isPerson = isApplicantPerson(application)

  const [paymentMode, setPaymentMode] = useState<PaymentModeState | undefined>(
    isPerson ? currentAnswers?.paymentMode : MONTHS,
  )

  const getDistributionCallback = useCallback(
    async ({
      monthAmount = null,
      monthCount = null,
      totalAmount,
      scheduleType,
    }: GetScheduleDistributionInput) => {
      const { data } = await getDistribution({
        input: {
          monthAmount,
          monthCount,
          totalAmount,
          scheduleType,
        },
      })

      return data
    },
    [getDistribution],
  )

  const { debouncedAmount, debouncedMonths, setAmount, setMonths } =
    useDebouncedSliderValues(currentAnswers)

  useEffect(() => {
    if (payment && paymentMode !== undefined && initialMinMaxData) {
      setIsLoading(true)
      getDistributionCallback({
        monthAmount:
          paymentMode === AMOUNT
            ? debouncedAmount === undefined
              ? initialMinMaxData?.minPayment
              : debouncedAmount
            : initialMinMaxData?.minPayment,
        monthCount:
          paymentMode === MONTHS
            ? debouncedMonths === undefined
              ? initialMinMaxData?.maxCountMonth
              : debouncedMonths
            : null,
        totalAmount: payment.totalAmount,
        scheduleType: payment.type,
      })
        .then((response) => {
          setDistributionData(response?.paymentScheduleDistribution || null)
          setIsLoading(false)

          const monthlyPayments =
            response?.paymentScheduleDistribution.payments[0].payment
          const finalMonthPayment =
            response?.paymentScheduleDistribution.payments[
              response?.paymentScheduleDistribution.payments.length - 1
            ].payment

          if (monthlyPayments && finalMonthPayment)
            setDisplayInfo(monthlyPayments < finalMonthPayment)
        })
        .catch((error) => {
          console.error(
            'An error occured fetching payment distribution: ',
            error,
          )
        })
    }
  }, [
    debouncedAmount,
    debouncedMonths,
    getDistributionCallback,
    payment,
    paymentMode,
    initialMinMaxData,
  ])

  useEffect(() => {
    if (distributionData) {
      setValue(`${entry}.distribution`, distributionData.payments)
    }
  }, [distributionData, entry, setValue])

  const handleSelectPaymentMode = (mode: string) => {
    if (mode !== 'amount' && mode !== 'months') return

    setPaymentMode(mode)
  }

  const handleAmountChange = (value: number) => {
    setMonths(undefined)
    setAmount(value)
  }
  const handleMonthChange = (value: number) => {
    setMonths(value)
    setAmount(undefined)
  }

  if (!payment)
    // TODO: Better error message
    return (
      <div>Eitthvað fór úrskeiðis, núverandi greiðsludreifing fannst ekki</div>
    )

  const SliderDescriptor = () => {
    if (!distributionData || distributionData?.payments?.length < 1) return null

    const monthlyPayments = distributionData.payments[0].payment
    const lastMonthsPayment =
      distributionData.payments[distributionData.payments.length - 1].payment
    let count = 0

    if (monthlyPayments === lastMonthsPayment) {
      count = distributionData.payments.length === 1 ? 0 : 1
    } else {
      count = 2
    }

    return (
      <Box display="flex" justifyContent="flexEnd">
        <Text variant="small" fontWeight="semiBold">
          {formatMessage(paymentPlan.labels.sliderDescriptor, {
            count,
            monthlyPayments: HtmlParser(
              `<span class="${styles.valueLabel}">${formatIsk(
                monthlyPayments,
              )}</span>`,
            ),
            monthsAmount:
              count === 0 || count === 1
                ? distributionData.payments.length
                : distributionData.payments.length - 1,
            lastMonthsPayment: HtmlParser(
              `<span class="${styles.valueLabel}">${formatIsk(
                lastMonthsPayment,
              )}</span>`,
            ),
            lastMonth: distributionData.payments.length,
          })}
        </Text>
      </Box>
    )
  }
  return (
    <div>
      <input
        type="hidden"
        value={payment.type}
        {...register(`${entry}.id`, { required: true })}
      />
      <input
        type="hidden"
        value={payment.totalAmount}
        {...register(`${entry}.totalAmount`, { required: true })}
      />
      {isPerson && (
        <Text marginBottom={5}>
          {formatMessage(paymentPlan.general.paymentPlanDescription)}
        </Text>
      )}
      <Box marginBottom={[5, 5, 8]} marginTop={isPerson ? 0 : 4}>
        <PaymentPlanCard payment={payment} />
      </Box>
      <Text variant="h4" marginBottom={3}>
        {formatMessage(paymentPlan.labels.paymentModeTitle)}
      </Text>
      {isPerson ? (
        <RadioController
          id={`${entry}.paymentMode`}
          disabled={false}
          name={`${entry}.paymentMode`}
          largeButtons={true}
          defaultValue={paymentMode}
          onSelect={handleSelectPaymentMode}
          options={[
            {
              value: AMOUNT,
              label: formatMessage(paymentPlan.labels.payByAmount),
            },
            {
              value: MONTHS,
              label: formatMessage(paymentPlan.labels.payByMonths),
            },
          ]}
        />
      ) : (
        <input
          type="hidden"
          {...register(`${entry}.paymentMode`, { required: true })}
          value={paymentMode}
        />
      )}
      {paymentMode === AMOUNT && (
        <PlanSlider
          id={`${entry}.amountPerMonth`}
          minValue={initialMinMaxData?.minPayment || 5000}
          maxValue={initialMinMaxData?.maxPayment || 10000}
          currentValue={initialMinMaxData?.minPayment || 5000}
          multiplier={10000}
          heading={paymentPlan.labels.chooseAmountPerMonth}
          onChange={handleAmountChange}
          label={{
            singular: 'kr.',
            plural: 'kr.',
          }}
          descriptor={<SliderDescriptor />}
        />
      )}
      {paymentMode === MONTHS && (
        <PlanSlider
          id={`${entry}.numberOfMonths`}
          minValue={initialMinMaxData?.minCountMonth || 1}
          maxValue={initialMinMaxData?.maxCountMonth || 12}
          currentValue={initialMinMaxData?.maxCountMonth || 12}
          heading={paymentPlan.labels.chooseNumberOfMonths}
          onChange={handleMonthChange}
          label={{
            singular: formatMessage(shared.month),
            plural: formatMessage(shared.months),
          }}
          descriptor={<SliderDescriptor />}
        />
      )}
      {distributionData && (
        <Box marginTop={5}>
          <AccordionItem
            id="payment-plan-table"
            label={formatMessage(paymentPlan.labels.distributionDataMainTitle)}
            visibleContent={formatMessage(
              paymentPlan.labels.distributionDataTitle,
            )}
            startExpanded
          >
            <PaymentPlanTable
              isLoading={isLoading}
              data={distributionData}
              totalAmount={payment.totalAmount}
            />
          </AccordionItem>
        </Box>
      )}
      {displayInfo && (
        <Box marginTop={3}>
          <AlertMessage
            type="info"
            title={formatMessage(paymentPlan.labels.infoTitle)}
            message={formatMessage(paymentPlan.labels.infoDescription)}
          />
        </Box>
      )}
    </div>
  )
}
