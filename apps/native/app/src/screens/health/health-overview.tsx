import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'
import { ApolloError } from '@apollo/client'

import {
  Alert,
  Button,
  Heading,
  Input,
  InputRow,
  Problem,
  Typography,
} from '../../ui'
import {
  useGetHealthCenterQuery,
  useGetHealthInsuranceOverviewQuery,
  useGetMedicineDataQuery,
  useGetOrganDonorStatusQuery,
  useGetPaymentOverviewQuery,
  useGetPaymentStatusQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import externalLinkIcon from '../../assets/icons/external-link.png'
import { getConfig } from '../../config'
import { useBrowser } from '../../lib/use-browser'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import { useLocale } from '../../hooks/use-locale'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  margin-bottom: ${({ theme }) => -theme.spacing[1]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
  flex-wrap: wrap;
`

interface HeadingSectionProps {
  title: string
  linkTextId?: string
  onPress: () => void
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  title,
  onPress,
  linkTextId,
}) => {
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: theme.spacing[2] }}>
      <Heading
        small
        button={
          <TouchableOpacity
            onPress={onPress}
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
              <FormattedMessage id={linkTextId ?? 'button.seeAll'} />
            </Typography>
            <Image source={externalLinkIcon} />
          </TouchableOpacity>
        }
      >
        {title}
      </Heading>
    </TouchableOpacity>
  )
}

const showErrorComponent = (error: ApolloError) => {
  return <Problem error={error} size="small" />
}

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
  const origin = getConfig().apiUrl.replace(/\/api$/, '')
  const [refetching, setRefetching] = useState(false)
  const { width } = useWindowDimensions()
  const buttonStyle = { flex: 1, minWidth: width * 0.5 - theme.spacing[3] }
  const isVaccinationsEnabled = useFeatureFlag('isVaccinationsEnabled', false)
  const isPrescriptionsEnabled = useFeatureFlag('isPrescriptionsEnabled', false)
  const isOrganDonationEnabled = useFeatureFlag('isOrganDonationEnabled', false)

  const now = useMemo(() => new Date().toISOString(), [])

  const medicinePurchaseRes = useGetMedicineDataQuery()
  const organDonationRes = useGetOrganDonorStatusQuery({
    variables: {
      locale: useLocale(),
    },
    skip: !isOrganDonationEnabled,
  })
  const healthInsuranceRes = useGetHealthInsuranceOverviewQuery()
  const healthCenterRes = useGetHealthCenterQuery()
  const paymentStatusRes = useGetPaymentStatusQuery()
  const paymentOverviewRes = useGetPaymentOverviewQuery({
    variables: {
      input: {
        // The items we are fethcing are static and are not using the dates for calculation,
        // it is though not allowed to skip them or send and empty string so we send current date for both
        dateFrom: now,
        dateTo: now,
        serviceTypeCode: '',
      },
    },
  })

  const medicinePurchaseData =
    medicinePurchaseRes.data?.rightsPortalDrugPeriods?.[0]
  const healthInsuranceData =
    healthInsuranceRes.data?.rightsPortalInsuranceOverview
  const paymentStatusData = paymentStatusRes.data?.rightsPortalCopaymentStatus
  const paymentOverviewData =
    paymentOverviewRes.data?.rightsPortalPaymentOverview?.items?.[0]
  const organDonationData =
    organDonationRes.data?.healthDirectorateOrganDonation.donor

  const isMedicinePeriodActive =
    medicinePurchaseData?.active ||
    (medicinePurchaseData?.dateTo &&
      new Date(medicinePurchaseData.dateTo) > new Date())

  const isOrganDonor = organDonationData?.isDonor ?? false

  const isOrganDonorWithLimitations =
    isOrganDonor && (organDonationData?.limitations?.hasLimitations ?? false)

  const organLimitations = isOrganDonorWithLimitations
    ? organDonationData?.limitations?.limitedOrgansList?.map(
        (organ) => organ.name,
      ) ?? []
    : []

  // Make sure to list both selected organs and the comment if it exists
  const organLimitationsIncludingComment = [
    Array.isArray(organLimitations) ? organLimitations.join(', ') : '',
    organDonationData?.limitations?.comment,
  ]
    .filter(Boolean)
    .join(', ')

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [
      medicinePurchaseRes,
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
        medicinePurchaseRes.refetch(),
        healthInsuranceRes.refetch(),
        healthCenterRes.refetch(),
        paymentStatusRes.refetch(),
        paymentOverviewRes.refetch(),
        isOrganDonationEnabled && organDonationRes.refetch(),
      ].filter(Boolean)
      await Promise.all(promises)
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [
    medicinePurchaseRes,
    healthInsuranceRes,
    healthCenterRes,
    paymentStatusRes,
    paymentOverviewRes,
    organDonationRes,
    isOrganDonationEnabled,
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
            {isVaccinationsEnabled && (
              <Button
                title={intl.formatMessage({
                  id: 'health.overview.vaccinations',
                })}
                isOutlined
                isUtilityButton
                iconStyle={{ tintColor: theme.color.dark300 }}
                style={buttonStyle}
                ellipsis
                onPress={() => navigateTo('/vaccinations', componentId)}
              />
            )}
            {isPrescriptionsEnabled && (
              <Button
                title={intl.formatMessage({
                  id: 'health.overview.prescriptions',
                })}
                isOutlined
                isUtilityButton
                iconStyle={{ tintColor: theme.color.dark300 }}
                style={buttonStyle}
                ellipsis
                onPress={() => navigateTo('/prescriptions', componentId)}
              />
            )}
            <Button
              title={intl.formatMessage({ id: 'health.overview.therapy' })}
              isOutlined
              isUtilityButton
              icon={externalLinkIcon}
              iconStyle={{ tintColor: theme.color.dark300 }}
              style={buttonStyle}
              ellipsis
              onPress={() =>
                openBrowser(
                  `${origin}/minarsidur/heilsa/thjalfun/sjukrathjalfun`,
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
              style={{
                ...buttonStyle,
                maxWidth: width * 0.5 - theme.spacing[3],
              }}
              ellipsis
              onPress={() =>
                openBrowser(
                  `${origin}/minarsidur/heilsa/hjalpartaeki-og-naering`,
                  componentId,
                )
              }
            />
          </ButtonWrapper>
          <HeadingSection
            title={intl.formatMessage({ id: 'health.overview.healthCenter' })}
            onPress={() =>
              openBrowser(
                `${origin}/minarsidur/heilsa/heilsugaesla`,
                componentId,
              )
            }
          />
          {(healthCenterRes.data || healthCenterRes.loading) && (
            <>
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
                  darkBorder
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
            </>
          )}
          {healthCenterRes.error &&
            !healthCenterRes.data &&
            showErrorComponent(healthCenterRes.error)}
          <HeadingSection
            title={intl.formatMessage({ id: 'health.overview.statusOfRights' })}
            onPress={() =>
              openBrowser(`${origin}/minarsidur/heilsa/yfirlit`, componentId)
            }
          />
          {(healthInsuranceRes.data && healthInsuranceData?.isInsured) ||
          healthInsuranceRes.loading ? (
            <InputRow background>
              <Input
                label={intl.formatMessage({
                  id: 'health.overview.insuredFrom',
                })}
                value={
                  healthInsuranceData?.from
                    ? intl.formatDate(healthInsuranceData.from)
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
                value={healthInsuranceData?.status?.display}
                loading={healthInsuranceRes.loading && !healthInsuranceRes.data}
                error={healthInsuranceRes.error && !healthInsuranceRes.data}
                noBorder
              />
            </InputRow>
          ) : (
            !healthInsuranceRes.error &&
            healthInsuranceRes.data && (
              <Alert
                type="info"
                title={intl.formatMessage({ id: 'health.overview.notInsured' })}
                message={healthInsuranceData?.explanation ?? ''}
                hasBorder
              />
            )
          )}
          {healthInsuranceRes.error &&
            !healthInsuranceRes.data &&
            showErrorComponent(healthInsuranceRes.error)}
          <HeadingSection
            title={intl.formatMessage({
              id: 'health.overview.coPayments',
            })}
            onPress={() =>
              openBrowser(
                `${origin}/minarsidur/heilsa/greidslur/greidsluthatttaka`,
                componentId,
              )
            }
          />
          {(paymentOverviewRes.loading || paymentOverviewRes.data) && (
            <>
              <InputRow background>
                <Input
                  label={intl.formatMessage({
                    id: 'health.overview.maxMonthlyPayment',
                  })}
                  value={
                    paymentStatusData?.maximumMonthlyPayment
                      ? `${intl.formatNumber(
                          paymentStatusData?.maximumMonthlyPayment,
                        )} kr.`
                      : '0 kr.'
                  }
                  loading={paymentStatusRes.loading && !paymentStatusRes.data}
                  error={paymentStatusRes.error && !paymentStatusRes.data}
                  darkBorder
                />
              </InputRow>
              <InputRow background>
                <Input
                  label={intl.formatMessage({
                    id: 'health.overview.paymentLimit',
                  })}
                  value={
                    paymentStatusData?.maximumPayment
                      ? `${intl.formatNumber(
                          paymentStatusData?.maximumPayment,
                        )} kr.`
                      : '0 kr.'
                  }
                  loading={paymentStatusRes.loading && !paymentStatusRes.data}
                  error={paymentStatusRes.error && !paymentStatusRes.data}
                  darkBorder
                />
              </InputRow>
              <InputRow background>
                <Input
                  label={intl.formatMessage({
                    id: 'health.overview.paymentCredit',
                  })}
                  value={
                    paymentOverviewData?.credit
                      ? `${intl.formatNumber(paymentOverviewData?.credit)} kr.`
                      : '0 kr.'
                  }
                  loading={
                    paymentOverviewRes.loading && !paymentOverviewRes.data
                  }
                  error={paymentOverviewRes.error && !paymentOverviewRes.data}
                  noBorder
                />
                <Input
                  label={intl.formatMessage({
                    id: 'health.overview.paymentDebt',
                  })}
                  value={
                    paymentOverviewData?.debt
                      ? `${intl.formatNumber(paymentOverviewData?.debt)} kr.`
                      : '0 kr.'
                  }
                  loading={
                    paymentOverviewRes.loading && !paymentOverviewRes.data
                  }
                  error={paymentOverviewRes.error && !paymentOverviewRes.data}
                  noBorder
                />
              </InputRow>
            </>
          )}
          {paymentOverviewRes.error &&
            !paymentOverviewRes.data &&
            paymentStatusRes.error &&
            !paymentStatusRes.data &&
            showErrorComponent(paymentOverviewRes.error)}
          <HeadingSection
            title={intl.formatMessage({
              id: 'health.overview.medicinePurchase',
            })}
            onPress={() =>
              openBrowser(
                `${origin}/minarsidur/heilsa/lyf/greidsluthatttaka`,
                componentId,
              )
            }
          />
          {(medicinePurchaseRes.loading || medicinePurchaseRes.data) && (
            <>
              <InputRow background>
                <Input
                  label={intl.formatMessage({
                    id: 'health.overview.period',
                  })}
                  value={
                    medicinePurchaseData?.dateFrom &&
                    medicinePurchaseData?.dateTo
                      ? `${intl.formatDate(
                          medicinePurchaseData.dateFrom,
                        )} - ${intl.formatDate(medicinePurchaseData.dateTo)}`
                      : ''
                  }
                  loading={
                    medicinePurchaseRes.loading && !medicinePurchaseRes.data
                  }
                  error={medicinePurchaseRes.error && !medicinePurchaseRes.data}
                  darkBorder
                />
              </InputRow>
              <InputRow background>
                <Input
                  label={intl.formatMessage({
                    id: 'health.overview.levelStatus',
                  })}
                  value={
                    medicinePurchaseData?.levelNumber &&
                    medicinePurchaseData?.levelPercentage !== undefined
                      ? intl.formatMessage(
                          {
                            id: 'health.overview.levelStatusValue',
                          },
                          {
                            level: medicinePurchaseData?.levelNumber,
                            percentage: medicinePurchaseData?.levelPercentage,
                          },
                        )
                      : ''
                  }
                  loading={
                    medicinePurchaseRes.loading && !medicinePurchaseRes.data
                  }
                  error={medicinePurchaseRes.error && !medicinePurchaseRes.data}
                  noBorder
                  warningText={
                    !isMedicinePeriodActive
                      ? intl.formatMessage({
                          id: 'health.overview.medicinePurchaseNoActivePeriodWarning',
                        })
                      : ''
                  }
                />
              </InputRow>
            </>
          )}
          {medicinePurchaseRes.error &&
            !medicinePurchaseRes.data &&
            showErrorComponent(medicinePurchaseRes.error)}
          {isOrganDonationEnabled && (
            <HeadingSection
              title={intl.formatMessage({
                id: 'health.organDonation',
              })}
              linkTextId="health.organDonation.change"
              onPress={() =>
                openBrowser(
                  `${origin}/minarsidur/heilsa/liffaeragjof/skraning`,
                  componentId,
                )
              }
            />
          )}
          {isOrganDonationEnabled &&
            (organDonationRes.loading || organDonationRes.data) && (
              <InputRow background>
                <Input
                  label={intl.formatMessage({
                    id: isOrganDonorWithLimitations
                      ? 'health.organDonation.isDonorWithLimitations'
                      : isOrganDonor
                      ? 'health.organDonation.isDonor'
                      : 'health.organDonation.isNotDonor',
                  })}
                  value={`${intl.formatMessage(
                    {
                      id: isOrganDonorWithLimitations
                        ? 'health.organDonation.isDonorWithLimitationsDescription'
                        : isOrganDonor
                        ? 'health.organDonation.isDonorDescription'
                        : 'health.organDonation.isNotDonorDescription',
                    },
                    {
                      limitations: isOrganDonorWithLimitations
                        ? organLimitationsIncludingComment
                        : '',
                    },
                  )}`}
                  loadLabel={true}
                  loading={organDonationRes.loading && !organDonationRes.data}
                  error={organDonationRes.error && !organDonationRes.data}
                  noBorder
                />
              </InputRow>
            )}
          {isOrganDonationEnabled &&
            organDonationRes.error &&
            !organDonationRes.data &&
            showErrorComponent(organDonationRes.error)}
        </Host>
      </ScrollView>
    </View>
  )
}

HealthOverviewScreen.options = getNavigationOptions
