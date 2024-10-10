import { Alert, Button, Heading, Input, InputRow, Typography } from '@ui'
import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components'

import {
  useGetHealthCenterQuery,
  useGetHealthInsuranceOverviewQuery,
  useGetPaymentOverviewQuery,
  useGetPaymentStatusQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import externalLinkIcon from '../../assets/icons/external-open.png'
import { getConfig } from '../../config'
import { useBrowser } from '../../lib/use-browser'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const ButtonWrapper = styled(View)`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.overview.screenTitle' }),
      },
    },
  }))

export const HealthOverviewScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  const origin = getConfig().apiUrl.replace(/api$/, '')
  const [refetching, setRefetching] = useState(false)

  const now = useMemo(() => new Date().toISOString(), [])
  const dayOfYesterday = useMemo(() => new Date().getDate() - 1, [])
  const yesterday = useMemo(
    () => new Date(new Date().setDate(dayOfYesterday)).toISOString(),
    [dayOfYesterday],
  )

  const healthInsuranceRes = useGetHealthInsuranceOverviewQuery()
  const healthCenterRes = useGetHealthCenterQuery()
  const paymentStatusRes = useGetPaymentStatusQuery()
  const paymentOverviewRes = useGetPaymentOverviewQuery({
    variables: {
      input: {
        dateFrom: yesterday,
        dateTo: now,
        serviceTypeCode: '',
      },
    },
  })

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [
      healthInsuranceRes,
      healthCenterRes,
      paymentStatusRes,
      paymentOverviewRes,
    ],
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      const promises = [
        healthInsuranceRes.refetch(),
        healthCenterRes.refetch(),
        paymentStatusRes.refetch(),
        paymentOverviewRes.refetch(),
      ].filter(Boolean)
      await Promise.all(promises)
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [
    healthInsuranceRes,
    healthCenterRes,
    paymentStatusRes,
    paymentOverviewRes,
  ])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          <Heading>
            <FormattedMessage
              id="health.overview.title"
              defaultMessage="Heilsan mín"
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id="health.overview.description"
              defaultMessage="Hér finnur þú þín heilsufarsgögn, heilsugæslu og sjúkratryggingar"
            />
          </Typography>
          <ButtonWrapper>
            <Button
              title={intl.formatMessage({ id: 'health.overview.therapy' })}
              isOutlined
              isUtilityButton
              icon={externalLinkIcon}
              iconStyle={{ tintColor: theme.color.dark300 }}
              style={{ flex: 1 }}
              ellipsis
              onPress={() =>
                openBrowser(
                  `${origin}minarsidur/heilsa/thjalfun/sjukrathjalfun`,
                  componentId,
                )
              }
            />
            <Button
              title={intl.formatMessage({
                id: 'health.overview.aidsAndNutrition',
              })}
              isOutlined
              isUtilityButton
              icon={externalLinkIcon}
              iconStyle={{ tintColor: theme.color.dark300 }}
              style={{ flex: 1 }}
              ellipsis
              onPress={() =>
                openBrowser(
                  `${origin}minarsidur/heilsa/hjalpartaeki-og-naering`,
                  componentId,
                )
              }
            />
          </ButtonWrapper>
          <TouchableOpacity
            onPress={() =>
              openBrowser(
                `${origin}minarsidur/heilsa/heilsugaesla`,
                componentId,
              )
            }
            style={{ marginTop: theme.spacing[1] }}
          >
            <Heading
              small
              button={
                <TouchableOpacity
                  onPress={() =>
                    openBrowser(
                      `${origin}minarsidur/heilsa/heilsugaesla`,
                      componentId,
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="heading5"
                    color={theme.color.blue400}
                    style={{ marginRight: 4 }}
                  >
                    <FormattedMessage id="button.seeAll" />
                  </Typography>
                  <Image source={externalLinkIcon} />
                </TouchableOpacity>
              }
            >
              <FormattedMessage id="health.overview.healthCenter" />
            </Heading>
          </TouchableOpacity>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.healthCenter',
              })}
              value={
                healthCenterRes.data
                  ?.rightsPortalHealthCenterRegistrationHistory?.current
                  ?.healthCenterName ??
                intl.formatMessage({
                  id: 'health.overview.noHealthCenterRegistered',
                })
              }
              loading={healthCenterRes.loading && !healthCenterRes.data}
              error={healthCenterRes.error && !healthCenterRes.data}
              blueberryBorder
            />
          </InputRow>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.physician',
              })}
              value={
                healthCenterRes.data
                  ?.rightsPortalHealthCenterRegistrationHistory?.current
                  ?.doctor ??
                intl.formatMessage({
                  id: 'health.overview.noPhysicianRegistered',
                })
              }
              loading={healthCenterRes.loading && !healthCenterRes.data}
              error={healthCenterRes.error && !healthCenterRes.data}
              noBorder
            />
          </InputRow>
          <TouchableOpacity
            onPress={() =>
              openBrowser(`${origin}minarsidur/heilsa/yfirlit`, componentId)
            }
            style={{ marginTop: theme.spacing[2] }}
          >
            <Heading
              small
              button={
                <TouchableOpacity
                  onPress={() =>
                    openBrowser(
                      `${origin}minarsidur/heilsa/yfirlit`,
                      componentId,
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="heading5"
                    color={theme.color.blue400}
                    style={{ marginRight: 4 }}
                  >
                    <FormattedMessage id="button.seeAll" />
                  </Typography>
                  <Image source={externalLinkIcon} />
                </TouchableOpacity>
              }
            >
              <FormattedMessage id="health.overview.statusOfRights" />
            </Heading>
          </TouchableOpacity>
          {healthInsuranceRes.data?.rightsPortalInsuranceOverview?.isInsured ||
          healthInsuranceRes.loading ? (
            <InputRow background>
              <Input
                label={intl.formatMessage({
                  id: 'health.overview.insuredFrom',
                })}
                value={
                  healthInsuranceRes.data?.rightsPortalInsuranceOverview?.from
                    ? intl.formatDate(
                        healthInsuranceRes.data?.rightsPortalInsuranceOverview
                          .from,
                      )
                    : null
                }
                loading={healthInsuranceRes.loading && !healthInsuranceRes.data}
                error={healthInsuranceRes.error && !healthInsuranceRes.data}
                noBorder
              />
              <Input
                label={intl.formatMessage({
                  id: 'health.overview.status',
                })}
                value={
                  healthInsuranceRes.data?.rightsPortalInsuranceOverview?.status
                    ?.display
                }
                loading={healthInsuranceRes.loading && !healthInsuranceRes.data}
                error={healthInsuranceRes.error && !healthInsuranceRes.data}
                noBorder
              />
            </InputRow>
          ) : (
            <Alert
              type="info"
              title={intl.formatMessage({ id: 'health.overview.notInsured' })}
              message={
                healthInsuranceRes.data?.rightsPortalInsuranceOverview
                  ?.explanation ?? ''
              }
              hasBorder
            />
          )}
          <TouchableOpacity
            onPress={() =>
              openBrowser(
                `${origin}minarsidur/heilsa/greidslur/greidsluthatttaka`,
                componentId,
              )
            }
            style={{ marginTop: theme.spacing[2] }}
          >
            <Heading
              small
              button={
                <TouchableOpacity
                  onPress={() =>
                    openBrowser(
                      `${origin}minarsidur/heilsa/greidslur/greidsluthatttaka`,
                      componentId,
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="heading5"
                    color={theme.color.blue400}
                    style={{ marginRight: 4 }}
                  >
                    <FormattedMessage id="button.seeAll" />
                  </Typography>
                  <Image source={externalLinkIcon} />
                </TouchableOpacity>
              }
            >
              <FormattedMessage id="health.overview.payments" />
            </Heading>
          </TouchableOpacity>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.maxMonthlyPayment',
              })}
              value={
                paymentStatusRes.data?.rightsPortalCopaymentStatus
                  ?.maximumMonthlyPayment
                  ? `${intl.formatNumber(
                      paymentStatusRes.data?.rightsPortalCopaymentStatus
                        ?.maximumMonthlyPayment,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentStatusRes.loading && !paymentStatusRes.data}
              error={paymentStatusRes.error && !paymentStatusRes.data}
              blueberryBorder
            />
          </InputRow>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.paymentLimit',
              })}
              value={
                paymentStatusRes.data?.rightsPortalCopaymentStatus
                  ?.maximumPayment
                  ? `${intl.formatNumber(
                      paymentStatusRes.data?.rightsPortalCopaymentStatus
                        ?.maximumPayment,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentStatusRes.loading && !paymentStatusRes.data}
              error={paymentStatusRes.error && !paymentStatusRes.data}
              blueberryBorder
            />
          </InputRow>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.paymentCredit',
              })}
              value={
                paymentOverviewRes.data?.rightsPortalPaymentOverview.items?.[0]
                  ?.credit
                  ? `${intl.formatNumber(
                      paymentOverviewRes.data?.rightsPortalPaymentOverview
                        .items?.[0]?.credit,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentOverviewRes.loading && !paymentOverviewRes.data}
              error={paymentOverviewRes.error && !paymentOverviewRes.data}
              noBorder
            />
            <Input
              label={intl.formatMessage({
                id: 'health.overview.paymentDebt',
              })}
              value={
                paymentOverviewRes.data?.rightsPortalPaymentOverview.items?.[0]
                  ?.debt
                  ? `${intl.formatNumber(
                      paymentOverviewRes.data?.rightsPortalPaymentOverview
                        .items?.[0]?.debt,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentOverviewRes.loading && !paymentOverviewRes.data}
              error={paymentOverviewRes.error && !paymentOverviewRes.data}
              noBorder
            />
          </InputRow>
        </Host>
      </ScrollView>
    </View>
  )
}

HealthOverviewScreen.options = getNavigationOptions
