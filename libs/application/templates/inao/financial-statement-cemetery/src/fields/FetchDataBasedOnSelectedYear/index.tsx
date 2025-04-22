import { useEffect } from 'react'
import {
  AlertMessage,
  ContentBlock,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { financialLimitQuery, taxInfoQuery } from '../../graphql'
import { CEMETERYOPERATIONIDS } from '../../utils/constants'
import { FSIUSERTYPE, TaxInfoData } from '../../types/types'
import {
  getCareIncomeAndBurialRevenueAndGrant,
  getTaxInfoFromAnswers,
} from '../../utils/helpers'
import { m } from '../../lib/messages'

export const FetchDataBasedOnSelectedYear = () => {
  const { getValues, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const values = getValues()
  const year: string = values?.conditionalAbout?.operatingYear

  const { data, error, loading } = useQuery(financialLimitQuery, {
    variables: { input: { year, clientType: `${FSIUSERTYPE.CEMETRY}` } },
  })

  const { data: taxInfoData, loading: taxInfoLoading } = useQuery<TaxInfoData>(
    taxInfoQuery,
    {
      variables: { year },
    },
  )

  const {
    careIncomeFromAnswers,
    burialRevenueFromAnswers,
    grantFromTheCemeteryFundFromAnswers,
    donationsToCemeteryFundFromAnswers,
  } = getTaxInfoFromAnswers(values)

  useEffect(() => {
    const limit = data?.financialStatementsInaoClientFinancialLimit?.toString()

    if (limit) {
      setValue(CEMETERYOPERATIONIDS.incomeLimit, limit)
    }
  }, [data, setValue])

  useEffect(() => {
    if (!taxInfoData) return

    const {
      careIncome,
      burialRevenue,
      grantFromTheCemeteryFund,
      donationsToCemeteryFund,
    } = getCareIncomeAndBurialRevenueAndGrant(
      taxInfoData.financialStatementsInaoTaxInfo,
    )

    const updates = [
      {
        id: CEMETERYOPERATIONIDS.careIncome,
        value: careIncome,
        exists: careIncomeFromAnswers,
      },
      {
        id: CEMETERYOPERATIONIDS.burialRevenue,
        value: burialRevenue,
        exists: burialRevenueFromAnswers,
      },
      {
        id: CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
        value: grantFromTheCemeteryFund,
        exists: grantFromTheCemeteryFundFromAnswers,
      },
      {
        id: CEMETERYOPERATIONIDS.donationsToCemeteryFund,
        value: donationsToCemeteryFund,
        exists: donationsToCemeteryFundFromAnswers,
      },
    ]

    updates.forEach((update) => {
      if (!update.exists) {
        setValue(update.id, update.value)
      }
    })
  }, [
    taxInfoData,
    setValue,
    careIncomeFromAnswers,
    burialRevenueFromAnswers,
    grantFromTheCemeteryFundFromAnswers,
    donationsToCemeteryFundFromAnswers,
  ])

  if (loading || taxInfoLoading) {
    return (
      <ContentBlock>
        <LoadingDots />
      </ContentBlock>
    )
  }

  if (error) {
    return (
      <ContentBlock>
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchErrorTitle)}
          message={formatMessage(m.fetchCemetryLimitErrorMsg)}
        />
      </ContentBlock>
    )
  }

  return null
}
