import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import subYears from 'date-fns/subYears'
import { useWindowSize } from 'react-use'
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

import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import Appointments from './components/Appointments'
import BasicInformation from './components/BasicInformation'
import ContactLinks from './components/ContactLinks'
import PaymentsAndRights from './components/PaymentsAndRights'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import * as styles from './HealthOverview.css'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

export const HealthOverview = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage, locale } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  const [showAppointments, setShowAppointments] = useState(false)

  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.isServicePortalHealthAppointmentsPageEnabled,
        false,
      )
      if (ffEnabled) {
        setShowAppointments(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const upcomingAppointment =
    appointmentsData?.healthDirectorateAppointments?.data?.slice(0, 1) || []

  return (
    <>
      <GridRow marginBottom={CONTENT_GAP_LG} alignItems="stretch">
        <GridColumn span={isMobile ? '12/12' : '7/12'}>
          <div className={styles.leftColumn}>
            <Box marginBottom={SECTION_GAP}>
              <Text variant="h3" as={'h1'}>
                {formatMessage(messages.healthOverview)}
              </Text>

              <Text variant="default" paddingTop={1}>
                {formatMessage(messages.healthOverviewIntro)}
              </Text>
            </Box>
            {isMobile && (
              <Box marginBottom={CONTENT_GAP_LG}>
                <ContactLinks />
              </Box>
            )}
            {!isMobile && showAppointments && <Box flexGrow={1} />}
            {showAppointments && (
              <Box marginRight={[0, 0, 0, 0, 12]}>
                <Appointments
                  data={{
                    data: { data: upcomingAppointment },
                    loading: appointmentsLoading,
                    error: !!appointmentsError,
                  }}
                  showLinkButton
                  cardSize="large"
                />
              </Box>
            )}
          </div>
        </GridColumn>
        {!isMobile && (
          <GridColumn span="5/12">
            <div className={styles.imageWrapper}>
              <img
                src="./assets/images/jobs.svg"
                alt=""
                aria-hidden="true"
                className={styles.decorativeImage}
              />
              <div className={styles.contactLinksWrapper}>
                <ContactLinks />
              </div>
            </div>
          </GridColumn>
        )}
      </GridRow>
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
          data: dentistsData?.rightsPortalUserDentistRegistration?.dentist
            ?.name,
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
