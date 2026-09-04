import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { DelegationPaths } from '@island.is/portals/shared-modules/delegations'
import subYears from 'date-fns/subYears'
import { useWindowSize } from 'react-use'
import { HealthPaths } from '../../lib/paths'
import { messages } from '../../lib/messages'
import {
  CONTENT_GAP_LG,
  DEFAULT_APPOINTMENTS_STATUS,
  SECTION_GAP,
} from '../../utils/constants'
import {
  useGetAppointmentsOverviewQuery,
  useGetBloodTypeOverviewQuery,
  useGetDentistOverviewQuery,
  useGetDonorStatusOverviewQuery,
  useGetHealthCenterOverviewQuery,
  useGetInsuranceOverviewQuery,
  useGetMedicinePaymentOverviewQuery,
  useGetPaymentsOverviewQuery,
} from './HealthOverview.generated'

import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import Appointments from './components/Appointments'
import BasicInformation from './components/BasicInformation'
import ContactLinks from './components/ContactLinks'
import HealthConversationsBox from './components/HealthConversationsBox/HealthConversationsBox'
import PaymentsAndRights from './components/PaymentsAndRights'
import SameDayHelpBox from './components/SameDayHelpBox'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import * as styles from './HealthOverview.css'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

export const HealthOverview = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage, locale } = useLocale()
  const { width } = useWindowSize()
  const isStackedLayout = width < theme.breakpoints.lg
  const { value: showAppointments } = useFeatureFlag(
    Features.isServicePortalHealthAppointmentsPageEnabled,
    false,
  )
  const { value: isNewHealthOverviewPageEnabled } = useFeatureFlag(
    Features.isNewHealthOverviewPageEnabled,
    false,
  )

  const { data, error, loading } = useGetInsuranceOverviewQuery()
  const {
    data: healthCenterData,
    loading: healthCenterLoading,
    error: healthCenterError,
  } = useGetHealthCenterOverviewQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
  })

  const {
    data: dentistsData,
    loading: dentistsLoading,
    error: dentistsError,
  } = useGetDentistOverviewQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
  })

  const {
    data: donorStatusData,
    loading: donorStatusLoading,
    error: donorStatusError,
  } = useGetDonorStatusOverviewQuery({
    variables: {
      locale: locale,
    },
  })

  const {
    data: paymentOverviewData,
    loading: paymentOverviewLoading,
    error: paymentOverviewError,
  } = useGetPaymentsOverviewQuery()

  const {
    data: medicinePaymentOverviewData,
    loading: medicinePaymentOverviewLoading,
    error: medicinePaymentOverviewError,
  } = useGetMedicinePaymentOverviewQuery()

  const {
    data: bloodTypeData,
    loading: bloodTypeLoading,
    error: bloodTypeError,
  } = useGetBloodTypeOverviewQuery()

  const {
    data: appointmentsData,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useGetAppointmentsOverviewQuery({
    variables: {
      status: DEFAULT_APPOINTMENTS_STATUS, // Empty will fetch all statuses
    },
    skip: !showAppointments,
  })

  const currentMedicinePeriod =
    medicinePaymentOverviewData?.rightsPortalDrugPeriods[0] ?? null

  const firstTwoAppointments =
    appointmentsData?.healthDirectorateAppointments?.data?.slice(0, 2) || []

  const quickLinks = [
    {
      href: HealthPaths.HealthMedicinePrescription,
      label: formatMessage(messages.quickLinkMedicinePrescription),
    },
    {
      href: DelegationPaths.Delegations,
      label: formatMessage(messages.quickLinkMedicineDelegation),
    },
    {
      href: HealthPaths.HealthWaitlists,
      label: formatMessage(messages.quickLinkWaitlists),
    },
    {
      href: HealthPaths.HealthQuestionnaires,
      label: formatMessage(messages.quickLinkQuestionnaires),
    },
  ]

  return (
    <>
      <GridRow
        marginBottom={isNewHealthOverviewPageEnabled ? 4 : CONTENT_GAP_LG}
      >
        <GridColumn span={isStackedLayout ? '8/8' : '5/8'}>
          <>
            <Text variant="h3" as={'h1'}>
              {formatMessage(messages.healthOverview)}
            </Text>
            <Text variant="default" paddingTop={2}>
              {formatMessage(messages.healthOverviewIntro)}
            </Text>
            {isNewHealthOverviewPageEnabled && (
              <Box marginTop={2}>
                <Inline space={[1, 2]}>
                  {quickLinks.map((link) => (
                    <LinkResolver key={link.href} href={link.href}>
                      <Tag variant="blue">{link.label}</Tag>
                    </LinkResolver>
                  ))}
                </Inline>
              </Box>
            )}
          </>
        </GridColumn>
        {isNewHealthOverviewPageEnabled && !isStackedLayout && (
          <GridColumn span="3/8">
            <Box display="flex" justifyContent="center">
              <img
                src="./assets/images/health.svg"
                alt=""
                className={styles.image}
              />
            </Box>
          </GridColumn>
        )}
      </GridRow>
      {isNewHealthOverviewPageEnabled && (
        <GridRow marginBottom={SECTION_GAP}>
          <GridColumn span={isStackedLayout ? '8/8' : '7/12'}>
            <Box marginBottom={isStackedLayout ? CONTENT_GAP_LG : 0}>
              <HealthConversationsBox limit={3} />
            </Box>
          </GridColumn>
          <GridColumn span={isStackedLayout ? '8/8' : '5/12'}>
            <ContactLinks />
            <Box marginTop={2}>
              <SameDayHelpBox />
            </Box>
          </GridColumn>
        </GridRow>
      )}
      {/* Appointments */}
      {showAppointments && (
        <Appointments
          data={{
            data: { data: firstTwoAppointments },
            loading: appointmentsLoading,
            error: !!appointmentsError,
          }}
          showLinkButton
        />
      )}
      {/* Payments, medicine and insurance overview */}
      <PaymentsAndRights
        payments={{
          data: paymentOverviewData?.rightsPortalCopaymentStatus,
          loading: paymentOverviewLoading,
          error: !!paymentOverviewError,
        }}
        medicine={{
          data: currentMedicinePeriod,
          loading: medicinePaymentOverviewLoading,
          error: !!medicinePaymentOverviewError,
        }}
        insurance={{
          data: data?.rightsPortalInsuranceOverview,
          loading: loading,
          error: !!error,
        }}
      />
      {/* Displaying basic information like healthcenter, dentist etc, */}
      <BasicInformation
        healthCenter={{
          data: healthCenterData?.rightsPortalHealthCenterRegistrationHistory,
          loading: healthCenterLoading,
          error: !!healthCenterError,
        }}
        dentists={{
          data:
            dentistsData?.rightsPortalUserDentistRegistration?.dentist?.name,
          loading: dentistsLoading,
          error: !!dentistsError,
        }}
        donor={{
          data: donorStatusData?.healthDirectorateOrganDonation.donor,
          loading: donorStatusLoading,
          error: !!donorStatusError,
        }}
        blood={{
          data: bloodTypeData?.rightsPortalBloodType,
          loading: bloodTypeLoading,
          error: !!bloodTypeError,
        }}
      />
    </>
  )
}

export default HealthOverview
