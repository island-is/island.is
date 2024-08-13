import { useQuery } from '@apollo/client'
import { coreErrorMessages } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { TemporaryCalculationQuery } from '../../graphql/queries'
import { RatioType, YES } from '../../lib/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../lib/incomePlanUtils'
import { incomePlanFormMessage } from '../../lib/messages'
import { SocialInsuranceTemporaryCalculationGroup } from '../../types/schema'

export const TemporaryCalculationTable: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()

  const { income } = getApplicationAnswers(application.answers)
  const { latestIncomePlan, categorizedIncomeTypes } =
    getApplicationExternalData(application.externalData)

  const input = {
    incomeYear: latestIncomePlan.year,
    incomeTypes: income.map((income) => {
      const incomeType = categorizedIncomeTypes.filter(
        (item) => item.incomeTypeName === income.incomeTypes,
      )

      return {
        incomeTypeNumber: incomeType[0]?.incomeTypeNumber,
        incomeTypeCode: incomeType[0]?.incomeTypeCode,
        incomeTypeName: income.incomeTypes,
        currencyCode: income.currency,
        incomeCategoryNumber: incomeType[0]?.categoryNumber,
        incomeCategoryCode: incomeType[0]?.categoryCode,
        incomeCategoryName: income.incomeCategories,
        ...(income.income === RatioType.MONTHLY &&
        income?.unevenIncomePerYear?.[0] === YES
          ? {
              amountJan: income.january,
              amountFeb: income.february,
              amountMar: income.march,
              amountApr: income.april,
              amountMay: income.may,
              amountJun: income.june,
              amountJul: income.july,
              amountAug: income.august,
              amountSep: income.september,
              amountOct: income.october,
              amountNov: income.november,
              amountDec: income.december,
            }
          : {}),
      }
    }),
  }

  const { data, loading, error } = useQuery(TemporaryCalculationQuery, {
    variables: {
      input,
    },
  })

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

  return (
    <Box>
      <Box display="flex" justifyContent="flexEnd">
        <Button
          variant="utility"
          icon="print"
          onClick={(e) => {
            e.preventDefault()
            window.print()
          }}
        />
      </Box>
      <Box marginY={3}>
        <Stack space={3}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData width="50%">
                  {formatMessage(incomePlanFormMessage.info.tableHeaderOne)}
                </T.HeadData>
                <T.HeadData width="25%" align="right" box={{ paddingRight: 0 }}>
                  {formatMessage(incomePlanFormMessage.info.tableHeaderTwo)}
                </T.HeadData>
                <T.HeadData width="25%" align="right">
                  {formatMessage(incomePlanFormMessage.info.tableHeaderThree)}
                </T.HeadData>
              </T.Row>
            </T.Head>
          </T.Table>
          {data?.getTemporaryCalculations?.groups.map(
            (
              group: SocialInsuranceTemporaryCalculationGroup,
              index: number,
            ) => (
              <T.Table key={index}>
                <T.Head>
                  <T.Row>
                    <T.HeadData width="50%">{group.group}</T.HeadData>
                    <T.HeadData
                      width="25%"
                      align="right"
                      box={{ paddingRight: 0 }}
                    >
                      {group.total &&
                        formatCurrency(Math.round(group.total / 12).toString())}
                    </T.HeadData>
                    <T.HeadData width="25%" align="right">
                      {group.total && formatCurrency(group.total.toString())}
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {group?.rows?.map((row, rowIndex) => (
                    <T.Row key={`row-${rowIndex}`}>
                      <T.Data>{row.name}</T.Data>
                      <T.Data align="right" box={{ paddingRight: 0 }}>
                        {row.total &&
                          formatCurrency(Math.round(row.total / 12).toString())}
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
                  {formatCurrency(
                    Math.round(
                      data?.getTemporaryCalculations?.paidOut / 12,
                    ).toString(),
                  )}
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
