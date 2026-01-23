import { ApolloError } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Animated,
  Image,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '../../assets/icons/external-link.png'
import { getConfig } from '../../config'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  useGetBloodTypeOverviewQuery,
  useGetDentistOverviewQuery,
  useGetHealthCenterQuery,
  useGetHealthInsuranceOverviewQuery,
  useGetMedicineDataQuery,
  useGetOrganDonorStatusQuery,
  useGetPaymentOverviewQuery,
  useGetPaymentStatusQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { navigateTo } from '../../lib/deep-linking'
import { useBrowser } from '../../lib/use-browser'
import {
  Alert,
  Button,
  Heading,
  Input,
  InputRow,
  Problem,
  Skeleton,
  TopLine,
  Typography,
} from '../../ui'

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
  onPress?: () => void
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  title,
  onPress,
  linkTextId,
}) => {
  const theme = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginTop: theme.spacing[2] }}
      disabled={!onPress}
    >
      <Heading
        small
        button={
          <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {onPress && (
              <>
                <Typography
                  variant="heading5"
                  color={theme.color.blue400}
                  style={{ marginRight: 4 }}
                >
                  <FormattedMessage id={linkTextId ?? 'button.seeAll'} />
                </Typography>
                <Image source={externalLinkIcon} />
              </>
            )}
          </TouchableOpacity>
        }
      >
        {title}
      </Heading>
    </TouchableOpacity>
  )
}

interface ExternalLinkProps {
  onPress: () => void
  text: string
  topAlign?: boolean
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  onPress,
  text,
  topAlign = false,
}) => {
  const theme = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: topAlign ? 'flex-start' : 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: theme.color.dark300,
        }}
      >
        <Typography
          variant="eyebrow"
          color={theme.color.blue400}
          style={{ marginRight: 4 }}
        >
          <FormattedMessage id={text} />
        </Typography>
        <Image source={externalLinkIcon} />
      </View>
    </TouchableOpacity>
  )
}

const showErrorComponent = (error: ApolloError) => {
  return <Problem error={error} size="small" />
}

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((_, intl) => ({
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

  const [isLoadingFeatureFlags, setIsLoadingFeatureFlags] = useState(true)

  const { width } = useWindowDimensions()
  const buttonStyle = { flex: 1, minWidth: width * 0.5 - theme.spacing[3] }
  const scrollY = useRef(new Animated.Value(0)).current
  const isVaccinationsEnabled = useFeatureFlag('isVaccinationsEnabled', false, null)
  const isMedicineDelegationEnabled = useFeatureFlag(
    'isMedicineDelegationEnabled',
    false,
    null,
  )
  const isPrescriptionsEnabled = useFeatureFlag('isPrescriptionsEnabled', false, null)
  const isOrganDonationEnabled = useFeatureFlag('isOrganDonationEnabled', false, null)
  const isQuestionnaireFeatureEnabled = useFeatureFlag(
    'isQuestionnaireEnabled',
    false,
    null,
  )

  useEffect(() => {
    setIsLoadingFeatureFlags(isVaccinationsEnabled === null || isMedicineDelegationEnabled === null || isPrescriptionsEnabled === null || isOrganDonationEnabled === null || isQuestionnaireFeatureEnabled === null)
  }, [isVaccinationsEnabled, isMedicineDelegationEnabled, isPrescriptionsEnabled, isOrganDonationEnabled, isQuestionnaireFeatureEnabled])

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
  const bloodTypeRes = useGetBloodTypeOverviewQuery()
  const dentistRes = useGetDentistOverviewQuery({
    variables: {
      input: {
        dateFrom: now,
        dateTo: now,
      },
    },
  })
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

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [
      medicinePurchaseRes,
      healthInsuranceRes,
      healthCenterRes,
      paymentStatusRes,
      paymentOverviewRes,
      organDonationRes,
      dentistRes,
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
        dentistRes.refetch(),
        isOrganDonationEnabled && organDonationRes.refetch(),
        bloodTypeRes.refetch(),
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
    dentistRes,
    bloodTypeRes,
  ])

  return (
    <>
      <Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: theme.spacing[2],
          paddingBottom: theme.spacing[4],
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
      >
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
          {isLoadingFeatureFlags ? (
            <>
              <Skeleton
                active
                height={40}
                style={{ ...buttonStyle, borderRadius: 8 }}
              />
              <Skeleton
                active
                height={40}
                style={{ ...buttonStyle, borderRadius: 8 }}
              />
              <Skeleton
                active
                height={40}
                style={{ ...buttonStyle, borderRadius: 8 }}
              />
              <Skeleton
                active
                height={40}
                style={{ ...buttonStyle, borderRadius: 8 }}
              />
            </>
          ) : (
            <>
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
              {isQuestionnaireFeatureEnabled && (
                <Button
                  title={intl.formatMessage({
                    id: 'health.overview.questionnaires',
                  })}
                  isOutlined
                  isUtilityButton
                  iconStyle={{ tintColor: theme.color.dark300 }}
                  style={buttonStyle}
                  ellipsis
                  onPress={() => navigateTo('/questionnaires', componentId)}
                />
              )}
              {isPrescriptionsEnabled && (
                <Button
                  title={intl.formatMessage({
                    id: isPrescriptionsEnabled
                      ? 'health.prescriptionsAndCertificates.screenTitle'
                      : 'health.drugCertificates.title',
                  })}
                  isOutlined
                  isUtilityButton
                  iconStyle={{ tintColor: theme.color.dark300 }}
                  style={buttonStyle}
                  ellipsis
                  onPress={() => navigateTo('/prescriptions', componentId)}
                />
              )}
              {isMedicineDelegationEnabled && (
                <Button
                  title={intl.formatMessage({
                    id: 'health.overview.medicineDelegation',
                  })}
                  isOutlined
                  isUtilityButton
                  iconStyle={{ tintColor: theme.color.dark300 }}
                  style={buttonStyle}
                  ellipsis
                  onPress={() => navigateTo('/medicine-delegation', componentId)}
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
            </>
          )}
        </ButtonWrapper>
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
                loading={paymentOverviewRes.loading && !paymentOverviewRes.data}
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
                loading={paymentOverviewRes.loading && !paymentOverviewRes.data}
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
                  medicinePurchaseData?.dateFrom && medicinePurchaseData?.dateTo
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
        <HeadingSection
          title={intl.formatMessage({ id: 'health.overview.statusOfRights' })}
          onPress={() =>
            openBrowser(
              `${origin}/minarsidur/heilsa/greidslur/rettindi`,
              componentId,
            )
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
        {/** General health information */}
        <HeadingSection
          title={intl.formatMessage({
            id: 'health.overview.basicInformation',
          })}
        />
        <InputRow background>
          <Input
            label={intl.formatMessage({
              id: 'health.overview.healthCenter',
            })}
            value={
              healthCenterRes.error
                ? ''
                : healthCenterRes.data
                  ?.rightsPortalHealthCenterRegistrationHistory?.current
                  ?.healthCenterName ??
                intl.formatMessage({
                  id: 'health.overview.noHealthCenterRegistered',
                })
            }
            loading={healthCenterRes.loading}
            fullWidthWarning
            allowEmptyValue={healthCenterRes.error ? true : false}
            warningText={
              healthCenterRes.error
                ? intl.formatMessage({
                  id: 'problem.thirdParty.message',
                })
                : ''
            }
            rightElement={
              <ExternalLink
                onPress={() =>
                  openBrowser(
                    `${origin}/minarsidur/heilsa/grunnupplysingar/heilsugaesla`,
                    componentId,
                  )
                }
                text="button.open"
                topAlign={healthCenterRes.error ? true : false}
              />
            }
          />
        </InputRow>
        <InputRow background>
          <Input
            label={intl.formatMessage({
              id: 'health.overview.physician',
            })}
            value={
              healthCenterRes.error
                ? ''
                : healthCenterRes.data
                  ?.rightsPortalHealthCenterRegistrationHistory?.current
                  ?.doctor ??
                intl.formatMessage({
                  id: 'health.overview.noPhysicianRegistered',
                })
            }
            loading={healthCenterRes.loading}
            fullWidthWarning
            allowEmptyValue={healthCenterRes.error ? true : false}
            warningText={
              healthCenterRes.error
                ? intl.formatMessage({
                  id: 'problem.thirdParty.message',
                })
                : ''
            }
            rightElement={
              <ExternalLink
                onPress={() =>
                  openBrowser(
                    `${origin}/minarsidur/heilsa/grunnupplysingar/heilsugaesla/skraning`,
                    componentId,
                  )
                }
                text="button.change"
                topAlign={healthCenterRes.error ? true : false}
              />
            }
          />
        </InputRow>
        <InputRow background>
          <Input
            label={intl.formatMessage({
              id: 'health.overview.dentist',
            })}
            value={
              dentistRes.error
                ? ''
                : dentistRes.data?.rightsPortalUserDentistRegistration?.dentist
                  ?.name ??
                intl.formatMessage({
                  id: 'health.overview.noDentistRegistered',
                })
            }
            allowEmptyValue={dentistRes.error ? true : false}
            loading={dentistRes.loading}
            fullWidthWarning
            warningText={
              dentistRes.error
                ? intl.formatMessage({
                  id: 'problem.thirdParty.message',
                })
                : ''
            }
            rightElement={
              <ExternalLink
                onPress={() =>
                  openBrowser(
                    `${origin}/minarsidur/heilsa/grunnupplysingar/tannlaeknar`,
                    componentId,
                  )
                }
                text="button.open"
                topAlign={dentistRes.error ? true : false}
              />
            }
          />
        </InputRow>
        {isOrganDonationEnabled && (
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.organDonation',
              })}
              value={`${organDonationRes.error
                ? ''
                : intl.formatMessage({
                  id: isOrganDonor
                    ? 'health.organDonation.isDonorDescription'
                    : 'health.organDonation.isNotDonorDescription',
                }) ?? ''
                }`}
              loading={organDonationRes.loading && !organDonationRes.data}
              fullWidthWarning
              warningText={
                organDonationRes.error
                  ? intl.formatMessage({
                    id: 'problem.thirdParty.message',
                  })
                  : ''
              }
              allowEmptyValue
              rightElement={
                <ExternalLink
                  onPress={() =>
                    openBrowser(
                      `${origin}/minarsidur/heilsa/grunnupplysingar/liffaeragjof`,
                      componentId,
                    )
                  }
                  text="button.open"
                  topAlign={organDonationRes.error ? true : false}
                />
              }
            />
          </InputRow>
        )}
        <InputRow background>
          <Input
            label={intl.formatMessage({
              id: 'health.overview.bloodType',
            })}
            value={
              bloodTypeRes.error
                ? ''
                : bloodTypeRes.data?.rightsPortalBloodType?.registered
                  ? intl.formatMessage(
                    {
                      id: 'health.overview.bloodTypeDescription',
                    },
                    {
                      bloodType:
                        bloodTypeRes.data?.rightsPortalBloodType?.type ?? '',
                    },
                  )
                  : intl.formatMessage({
                    id: 'health.overview.noBloodTypeRegistered',
                  })
            }
            loading={bloodTypeRes.loading}
            fullWidthWarning
            warningText={
              bloodTypeRes.error
                ? intl.formatMessage({
                  id: 'problem.thirdParty.message',
                })
                : ''
            }
            allowEmptyValue
            rightElement={
              <ExternalLink
                onPress={() =>
                  openBrowser(
                    `${origin}/minarsidur/heilsa/blodflokkur`,
                    componentId,
                  )
                }
                text="button.open"
                topAlign={bloodTypeRes.error ? true : false}
              />
            }
            noBorder
          />
        </InputRow>
      </Animated.ScrollView >
      <TopLine scrollY={scrollY} />
    </>
  )
}

HealthOverviewScreen.options = getNavigationOptions
