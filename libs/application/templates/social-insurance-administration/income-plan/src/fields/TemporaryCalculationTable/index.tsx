import { useQuery } from '@apollo/client'
import { coreErrorMessages, YES } from '@island.is/application/core'
import {
  INCOME,
  MONTHS,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { TemporaryCalculationQuery } from '../../graphql/queries'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../lib/incomePlanUtils'
import { incomePlanFormMessage } from '../../lib/messages'
import { SocialInsuranceTemporaryCalculation } from '@island.is/api/schema'

export const TemporaryCalculationTable: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()

  const { incomePlan } = getApplicationAnswers(application.answers)
  const { watch, setValue } = useFormContext()
  useEffect(() => {
    setValue('temporaryCalculation.show', false)
  }, [setValue])
  const temporaryCalculationMonth = watch('temporaryCalculation.month')
  const monthIndex = Math.max(
    0,
    MONTHS.findIndex((month) => month.value === temporaryCalculationMonth),
  )
  const { categorizedIncomeTypes, incomePlanConditions } =
    getApplicationExternalData(application.externalData)

  const input = {
    incomeYear: incomePlanConditions.incomePlanYear,
    incomeTypes: incomePlan.map((income) => {
      const incomeType = categorizedIncomeTypes.find(
        (item) => item.incomeTypeName === income.incomeType,
      )

      return {
        incomeTypeNumber: incomeType?.incomeTypeNumber,
        incomeTypeCode: incomeType?.incomeTypeCode,
        incomeTypeName: income.incomeType,
        currencyCode: income.currency,
        incomeCategoryNumber: incomeType?.categoryNumber,
        incomeCategoryCode: incomeType?.categoryCode,
        incomeCategoryName: income.incomeCategory,
        ...(income.income === RatioType.MONTHLY &&
        income?.incomeCategory === INCOME &&
        income?.unevenIncomePerYear?.[0] === YES
          ? {
              amountJan: Number(income.january),
              amountFeb: Number(income.february),
              amountMar: Number(income.march),
              amountApr: Number(income.april),
              amountMay: Number(income.may),
              amountJun: Number(income.june),
              amountJul: Number(income.july),
              amountAug: Number(income.august),
              amountSep: Number(income.september),
              amountOct: Number(income.october),
              amountNov: Number(income.november),
              amountDec: Number(income.december),
            }
          : {
              amountJan: Math.round(Number(income.incomePerYear) / 12),
              amountFeb: Math.round(Number(income.incomePerYear) / 12),
              amountMar: Math.round(Number(income.incomePerYear) / 12),
              amountApr: Math.round(Number(income.incomePerYear) / 12),
              amountMay: Math.round(Number(income.incomePerYear) / 12),
              amountJun: Math.round(Number(income.incomePerYear) / 12),
              amountJul: Math.round(Number(income.incomePerYear) / 12),
              amountAug: Math.round(Number(income.incomePerYear) / 12),
              amountSep: Math.round(Number(income.incomePerYear) / 12),
              amountOct: Math.round(Number(income.incomePerYear) / 12),
              amountNov: Math.round(Number(income.incomePerYear) / 12),
              amountDec: Math.round(Number(income.incomePerYear) / 12),
            }),
      }
    }),
  }

  const { data, loading, error } = useQuery<{
    getTemporaryCalculations: SocialInsuranceTemporaryCalculation
  }>(TemporaryCalculationQuery, {
    variables: {
      input,
    },
    skip: !incomePlanConditions.showTemporaryCalculations,
  })

  if (!incomePlanConditions.showTemporaryCalculations) {
    return (
      <Box marginY={3}>
        <AlertMessage
          type="warning"
          title={formatMessage(
            socialInsuranceAdministrationMessage.shared.alertTitle,
          )}
          message={formatMessage(
            incomePlanFormMessage.info.noAvailablePrerequisites,
            {
              incomePlanYear: incomePlanConditions.incomePlanYear,
            },
          )}
        />
      </Box>
    )
  }

  if (loading) {
    return (
      <Box marginY={3}>
        <Stack space={3}>
          <SkeletonLoader height={50} />
          <SkeletonLoader height={150} />
          <SkeletonLoader height={50} />
        </Stack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box marginY={3}>
        <AlertMessage
          type="error"
          title={formatMessage(
            socialInsuranceAdministrationMessage.shared.alertTitle,
          )}
          message={formatMessage(coreErrorMessages.failedDataProvider)}
        />
      </Box>
    )
  }

  if (!data?.getTemporaryCalculations?.paidOut) {
    return (
      <Box marginY={3}>
        <AlertMessage
          type="warning"
          title={formatMessage(
            socialInsuranceAdministrationMessage.shared.alertTitle,
          )}
          message={formatMessage(incomePlanFormMessage.info.noPayments)}
        />
      </Box>
    )
  }
  setValue('temporaryCalculation.show', true)

  const paidOutMonths = data?.getTemporaryCalculations?.groups
    ?.find(({ group }) => group === 'Frádráttur')
    ?.rows?.find(({ name }) => name === 'Útborgað')?.months
  const paidOutSelectedMonth = paidOutMonths?.[monthIndex]?.amount

  return (
    <Box>
      <Box marginY={3}>
        <Stack space={3}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData width="50%">
                  {formatMessage(
                    incomePlanFormMessage.info.tableHeaderPaymentTypes,
                  )}
                </T.HeadData>
                <T.HeadData width="25%" align="right" box={{ paddingRight: 0 }}>
                  {formatMessage(
                    MONTHS.find(
                      ({ value }) => value === temporaryCalculationMonth,
                    )?.label ?? MONTHS[0].label,
                  )}
                </T.HeadData>
                <T.HeadData width="25%" align="right">
                  {formatMessage(incomePlanFormMessage.info.tableHeaderTotal, {
                    year: incomePlanConditions.incomePlanYear,
                  })}
                </T.HeadData>
              </T.Row>
            </T.Head>
          </T.Table>
          {data?.getTemporaryCalculations?.groups?.map(
            (group, index: number) => (
              <T.Table key={index}>
                <T.Head>
                  <T.Row>
                    <T.HeadData width="50%">{group.group}</T.HeadData>
                    <T.HeadData
                      width="25%"
                      align="right"
                      box={{ paddingRight: 0 }}
                    >
                      {formatCurrency(
                        String(group.monthTotals?.[monthIndex]?.amount),
                      )}
                    </T.HeadData>
                    <T.HeadData width="25%" align="right">
                      {group.total && formatCurrency(group.total.toString())}
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {group?.rows
                    ?.filter(({ name }) => name !== 'Útborgað')
                    .map((row, rowIndex) => (
                      <T.Row key={`row-${rowIndex}`}>
                        <T.Data>{row.name}</T.Data>
                        <T.Data align="right" box={{ paddingRight: 0 }}>
                          {formatCurrency(
                            String(row.months?.[monthIndex]?.amount),
                          )}
                        </T.Data>
                        <T.Data align="right">
                          {row.total && formatCurrency(row.total.toString())}
                        </T.Data>
                      </T.Row>
                    ))}
                </T.Body>
              </T.Table>
            ),
          )}
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData width="50%">
                  {formatMessage(incomePlanFormMessage.info.paidTableHeader)}
                </T.HeadData>
                <T.HeadData width="25%" align="right" box={{ paddingRight: 0 }}>
                  {formatCurrency(String(paidOutSelectedMonth))}
                </T.HeadData>
                <T.HeadData width="25%" align="right">
                  {formatCurrency(
                    data?.getTemporaryCalculations?.paidOut.toString(),
                  )}
                </T.HeadData>
              </T.Row>
            </T.Head>
          </T.Table>
        </Stack>
      </Box>
    </Box>
  )
}
