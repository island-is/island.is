import { ApolloError } from '@apollo/client'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Animated,
  Image,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { Href, useRouter } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import categoriesIcon from '@/assets/icons/categories.png'
import externalLinkIcon from '@/assets/icons/external-link.png'
import medicineIcon from '@/assets/icons/medicine.png'
import readerIcon from '@/assets/icons/reader.png'
import vaccinationsIcon from '@/assets/icons/vaccinations.png'
import { getConfig } from '@/config'
import { BaseAppointmentStatuses } from '@/constants/base-appointment-statuses'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import {
  useGetAppointmentsQuery,
  useGetBloodTypeOverviewQuery,
  useGetDentistOverviewQuery,
  useGetHealthCenterQuery,
  useGetHealthInsuranceOverviewQuery,
  useGetMedicineDataQuery,
  useGetOrganDonorStatusQuery,
  useGetPaymentOverviewQuery,
  useGetPaymentStatusQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { useBrowser } from '@/lib/use-browser'
import {
  Alert,
  GeneralCardSkeleton,
  Heading,
  Input,
  InputRow,
  MoreCard,
  Problem,
  Skeleton,
  Typography,
} from '@/ui'
import { AppointmentCard } from '../../../../components/appointment-card'

const Row = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing.smallGutter}px;
  column-gap: ${({ theme }) => theme.spacing[1]}px;
  flex-direction: row;
`

const AppointmentsContainer = styled.View`
  row-gap: ${({ theme }) => theme.spacing[1]}px;
`

type HealthCard = {
  id: string
  titleId: string
  icon: any
  route?: Href
  enabled: boolean
  filled?: boolean
}

interface HeadingSectionProps {
  title: string
  linkTextId?: string
  onPress?: () => void
  showIcon?: boolean
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  title,
  onPress,
  linkTextId,
  showIcon = true,
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
                {showIcon && <Image source={externalLinkIcon} />}
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

export default function HealthOverviewScreen() {
  const router = useRouter()
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  const origin = getConfig().apiUrl.replace(/\/api$/, '')
  const [refetching, setRefetching] = useState(false)

  const [itemsPerRow, setItemsPerRow] = useState(3)

  const { width } = useWindowDimensions()
  const horizontalPadding = theme.spacing[2] * 2
  const columnGaps = theme.spacing[1] * (itemsPerRow - 1)
  const cardWidth = (width - horizontalPadding - columnGaps) / itemsPerRow

  const scrollY = useRef(new Animated.Value(0)).current
  const isVaccinationsEnabled = useFeatureFlag(
    'isVaccinationsEnabled',
    false,
    null,
  )
  const isMedicineDelegationEnabled = useFeatureFlag(
    'isMedicineDelegationEnabled',
    false,
    null,
  )
  const isPrescriptionsEnabled = useFeatureFlag(
    'isPrescriptionsEnabled',
    false,
    null,
  )
  const isOrganDonationEnabled = useFeatureFlag(
    'isOrganDonationEnabled',
    false,
    null,
  )
  const isQuestionnaireFeatureEnabled = useFeatureFlag(
    'isQuestionnaireEnabled',
    false,
    null,
  )
  const isAppointmentsEnabled = useFeatureFlag(
    'isAppointmentsEnabled',
    false,
    null,
  )

  const isLoadingFeatureFlags =
    isVaccinationsEnabled === null ||
    isMedicineDelegationEnabled === null ||
    isPrescriptionsEnabled === null ||
    isOrganDonationEnabled === null ||
    isQuestionnaireFeatureEnabled === null ||
    isAppointmentsEnabled === null

  const now = useMemo(() => new Date().toISOString(), [])

  const healthCardRows = useMemo(() => {
    const allHealthCards: HealthCard[] = [
      {
        id: 'medicine',
        titleId:
          !isPrescriptionsEnabled && !isMedicineDelegationEnabled
            ? 'health.drugCertificates.title'
            : 'health.overview.medicine',
        icon: medicineIcon,
        route: '/health/medicine/prescriptions',
        enabled: true,
      },
      {
        id: 'questionnaires',
        titleId: 'health.overview.questionnaires',
        icon: readerIcon,
        route: '/health/questionnaires',
        enabled: !!isQuestionnaireFeatureEnabled,
      },
      {
        id: 'vaccinations',
        titleId: 'health.overview.vaccinations',
        icon: vaccinationsIcon,
        route: '/health/vaccinations',
        enabled: !!isVaccinationsEnabled,
      },
      {
        id: 'seeAllCategories',
        titleId: 'health.overview.seeAllCategories',
        icon: categoriesIcon,
        route: '/health/categories',
        enabled: true,
        filled: true,
      },
    ]

    const healthCards = allHealthCards.filter((card) => card.enabled)

    if (healthCards.filter((card) => card.enabled).length === 4) {
      setItemsPerRow(2)
    } else {
      setItemsPerRow(3)
    }

    const rows = []
    for (let i = 0; i < healthCards.length; i += itemsPerRow) {
      rows.push(healthCards.slice(i, i + itemsPerRow))
    }

    return rows
  }, [
    isPrescriptionsEnabled,
    isMedicineDelegationEnabled,
    isQuestionnaireFeatureEnabled,
    isVaccinationsEnabled,
    itemsPerRow,
  ])

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
        dateFrom: now,
        dateTo: now,
        serviceTypeCode: '',
      },
    },
  })
  const appointmentsRes = useGetAppointmentsQuery({
    variables: {
      from: undefined,
      status: BaseAppointmentStatuses,
    },
    skip: !isAppointmentsEnabled,
    notifyOnNetworkStatusChange: true,
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
  const appointments =
    appointmentsRes.data?.healthDirectorateAppointments.data ?? []

  const isMedicinePeriodActive =
    medicinePurchaseData?.active ||
    (medicinePurchaseData?.dateTo &&
      new Date(medicinePurchaseData.dateTo) > new Date())

  const isOrganDonor = organDonationData?.isDonor ?? false

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
        isAppointmentsEnabled && appointmentsRes.refetch(),
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
    isAppointmentsEnabled,
    appointmentsRes,
  ])

  const handleAppointmentPress = useCallback(
    (appointmentId: string) => {
      router.navigate({
        pathname: '/health/appointments',
        params: { appointmentId },
      })
    },
    [router],
  )

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
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
      {isLoadingFeatureFlags ? (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <Row key={index}>
              {Array.from({ length: itemsPerRow }).map((_, index) => (
                <Skeleton
                  height={70}
                  style={{ width: cardWidth, borderRadius: 16 }}
                  key={index}
                />
              ))}
            </Row>
          ))}
        </>
      ) : (
        healthCardRows.map((row, rowIndex) => (
          <Row key={`health-card-row-${rowIndex}`}>
            {row.map((card) => (
              <MoreCard
                key={card.id}
                title={intl.formatMessage({ id: card.titleId })}
                icon={card.icon}
                onPress={
                  card.route
                    ? () => router.navigate(card.route as any)
                    : () => {
                        // noop
                      }
                }
                small
                filled={card.filled}
                style={{ flex: 0, width: cardWidth }}
              />
            ))}
          </Row>
        ))
      )}
      {isAppointmentsEnabled && (
        <>
          <HeadingSection
            title={intl.formatMessage({
              id: 'health.appointments.screenTitle',
            })}
            showIcon={false}
            onPress={() =>
              router.navigate('/(auth)/(tabs)/health/appointments')
            }
          />
          {appointmentsRes.loading && (
            <AppointmentsContainer>
              {Array.from({ length: 2 }).map((_, index) => (
                <GeneralCardSkeleton height={100} key={index} />
              ))}
            </AppointmentsContainer>
          )}
          {appointmentsRes.error && !appointmentsRes.data && (
            <AppointmentsContainer>
              <Problem error={appointmentsRes.error} size="small" />
            </AppointmentsContainer>
          )}
          {!appointmentsRes.loading &&
            !appointmentsRes.error &&
            appointments.length === 0 && (
              <AppointmentsContainer>
                <Problem type="no_data" size="small" />
              </AppointmentsContainer>
            )}
          {!appointmentsRes.loading &&
            !appointmentsRes.error &&
            appointments.length > 0 && (
              <AppointmentsContainer>
                {appointments.slice(0, 2).map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    title={appointment.title ?? ''}
                    practitioners={appointment.practitioners}
                    date={appointment.date ?? ''}
                    location={appointment.location?.name ?? ''}
                    onPress={handleAppointmentPress}
                  />
                ))}
              </AppointmentsContainer>
            )}
        </>
      )}
      <HeadingSection
        title={intl.formatMessage({
          id: 'health.overview.coPayments',
        })}
        onPress={() =>
          openBrowser(`${origin}/minarsidur/heilsa/greidslur/greidsluthatttaka`)
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
          openBrowser(`${origin}/minarsidur/heilsa/lyf/greidsluthatttaka`)
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
              loading={medicinePurchaseRes.loading && !medicinePurchaseRes.data}
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
              loading={medicinePurchaseRes.loading && !medicinePurchaseRes.data}
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
          openBrowser(`${origin}/minarsidur/heilsa/greidslur/rettindi`)
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
            value={`${
              organDonationRes.error
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
                openBrowser(`${origin}/minarsidur/heilsa/blodflokkur`)
              }
              text="button.open"
              topAlign={bloodTypeRes.error ? true : false}
            />
          }
          noBorder
        />
      </InputRow>
    </Animated.ScrollView>
  )
}
