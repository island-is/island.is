import React, { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { getDateRanges } from '@island.is/application/ui-components/annual-multi-range-calendar/utils'
import { useLocale } from '@island.is/localization'
import { applicationMessages as m, monthMessages } from '../lib/messages'
import {
  getAdvertisementUrls,
  getMonthlyRentalIncome,
  getOvernightDates,
  getSelectedHomeLodging,
  hasNoOvernightStays,
} from '../utils/homeLodgings'
import * as styles from './styles.css'

const currencyFormatter = new Intl.NumberFormat('is-IS', {
  style: 'currency',
  currency: 'ISK',
  maximumFractionDigits: 0,
})

export const OvernightStaysOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const { answers, externalData } = application
  const registration = getSelectedHomeLodging(answers, externalData)
  const year = getValueViaPath<string>(answers, 'year') ?? ''
  const dates = getValueViaPath<string[]>(answers, 'overnightDates') ?? []
  const overnightDates = getOvernightDates(dates)
  const monthlyAmounts =
    getValueViaPath<Record<string, string | number>>(
      answers,
      'pricing.monthlyAmounts',
    ) ?? {}
  const perVisitAmounts =
    getValueViaPath<Record<string, string | number>>(
      answers,
      'pricing.perVisitAmounts',
    ) ?? {}
  const pricingMethod =
    getValueViaPath<'monthly' | 'perVisit'>(answers, 'pricing.method') ??
    'monthly'
  const visitRanges = getDateRanges(dates)
  const comments = getValueViaPath<string>(answers, 'comments')
  const advertisementUrls = getAdvertisementUrls(answers)
  const noOvernightStays = hasNoOvernightStays(answers)

  const monthlySummary = monthMessages.flatMap((monthMessage, monthIndex) => {
    const numberOfNights = overnightDates.filter(
      (date) => Number(date.slice(5, 7)) === monthIndex + 1,
    ).length
    if (numberOfNights === 0) {
      return []
    }

    return [
      {
        monthName: formatMessage(monthMessage),
        numberOfNights,
        amount: getMonthlyRentalIncome({
          monthIndex,
          pricingMethod,
          monthlyAmounts,
          perVisitAmounts,
          visitRanges,
        }),
      },
    ]
  })
  const totalNights = overnightDates.length
  const totalAmount = monthlySummary.reduce(
    (total, month) => total + month.amount,
    0,
  )

  return (
    <Box>
      <ReviewGroup
        hideTopDivider
        editAction={() => goToScreen?.('firstSection')}
      >
        <Box marginBottom={4}>
          <Text variant="h3">
            {formatMessage(m.overviewHomeLodgingTitle, { year })}
          </Text>
        </Box>
        {registration && (
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '6/12']}>
              <Label>{formatMessage(m.propertyNameLabel)}</Label>
              <Text>{registration.name}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Label>{formatMessage(m.registrationNumberLabel)}</Label>
              <Text>{registration.id}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Label>{formatMessage(m.address)}</Label>
              <Text>{registration.address}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Label>{formatMessage(m.postalCodeAndCityLabel)}</Label>
              <Text>
                {registration.postalCode} {registration.city}
              </Text>
            </GridColumn>
            <GridColumn span="12/12">
              <Label>{formatMessage(m.advertisementTitle)}</Label>
              {advertisementUrls.length === 0 ? (
                <Text>{formatMessage(m.noActiveAdvertisementOverview)}</Text>
              ) : (
                advertisementUrls.map((url) => (
                  <Text key={url}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </Text>
                ))
              )}
            </GridColumn>
          </GridRow>
        )}
      </ReviewGroup>

      <ReviewGroup
        hideTopDivider
        isLast
        editAction={() =>
          goToScreen?.(noOvernightStays ? 'firstSection' : 'periodFields')
        }
      >
        <Box marginBottom={4}>
          <Text variant="h3">
            {formatMessage(m.overviewRegistrationTitle, { year })}
          </Text>
        </Box>
        {noOvernightStays && (
          <Text marginBottom={3}>{formatMessage(m.noStaysOverview)}</Text>
        )}
        <GridRow rowGap={3}>
          {monthlySummary.map(({ monthName, numberOfNights, amount }) => (
            <GridColumn key={monthName} span={['12/12', '6/12']}>
              <Text variant="h5">{monthName}</Text>
              <Text variant="small">
                {formatMessage(m.overviewNights, {
                  count: numberOfNights,
                })}
              </Text>
              <Text variant="small">
                {formatMessage(m.overviewAmount, {
                  amount: currencyFormatter.format(amount),
                })}
              </Text>
            </GridColumn>
          ))}
        </GridRow>
        <Box className={styles.totalBox} marginTop={4}>
          <Text variant="h4">{formatMessage(m.overviewTotal)}</Text>
          <Text>{formatMessage(m.overviewNights, { count: totalNights })}</Text>
          <Text color="blue400" fontWeight="semiBold">
            {formatMessage(m.overviewAmount, {
              amount: currencyFormatter.format(totalAmount),
            })}
          </Text>
        </Box>
        {comments && (
          <Box marginTop={4}>
            <Text variant="h4">{formatMessage(m.overviewComment)}</Text>
            <Text>{comments}</Text>
          </Box>
        )}
      </ReviewGroup>
    </Box>
  )
}
