import {
  Box,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoCardGrid,
  amountFormat,
  formatDate,
  isDateAfterToday,
} from '@island.is/portals/my-pages/core'
import subYears from 'date-fns/subYears'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP_LG } from '../../utils/constants'
import {
  useGetDentistOverviewQuery,
  useGetDonorStatusOverviewQuery,
  useGetHealthCenterOverviewQuery,
  useGetInsuranceOverviewQuery,
  useGetMedicinePaymentOverviewQuery,
  useGetPaymentsOverviewQuery,
} from './HealthOverview.generated'
import Appointments from './components/Appointments'
import PaymentsAndMedicine from './components/PaymentsAndMedicine'
import BasicInformation from './components/BasicInformation'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

export const HealthOverview = () => {
  useNamespaces('sp.health')
  const { formatMessage, locale } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

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
  } = useGetPaymentsOverviewQuery({})

  const {
    data: medicinePaymentOverviewData,
    loading: medicinePaymentOverviewLoading,
    error: medicinePaymentOverviewError,
  } = useGetMedicinePaymentOverviewQuery({})

  const currentMedicinePeriod =
    medicinePaymentOverviewData?.rightsPortalDrugPeriods[0] ?? null

  return (
    <>
      <GridRow marginBottom={CONTENT_GAP_LG}>
        <GridColumn span={isMobile ? '8/8' : '5/8'}>
          <>
            <Text variant="h3" as={'h1'}>
              {formatMessage(messages.healthOverview)}
            </Text>

            <Text variant="default" paddingTop={1}>
              {formatMessage(messages.overviewIntro)}
            </Text>
          </>
        </GridColumn>
      </GridRow>
      {/* Appointments - just temp for displaying */}
      <Appointments />
      <Box>
        <Text
          variant="eyebrow"
          color="foregroundBrandSecondary"
          marginBottom={2}
        >
          Empty state - TESTING ONLY
        </Text>

        <InfoCardGrid
          empty={{
            title: 'Engir tímar',
            description: 'Engar tímabókanir framundan.',
          }}
          cards={[]}
          size="small"
        />
        <InfoCardGrid
          empty={{
            title: 'Engir tímar',
            description: 'Engar tímabókanir framundan.',
          }}
          cards={[]}
          size="large"
        />
      </Box>
      {/* Payments and medicine payments */}
      <PaymentsAndMedicine
        paymentsData={paymentOverviewData?.rightsPortalCopaymentStatus}
        paymentsLoading={paymentOverviewLoading}
        paymentsError={!!paymentOverviewError}
        medicineData={currentMedicinePeriod}
        medicineLoading={medicinePaymentOverviewLoading}
        medicineError={!!medicinePaymentOverviewError}
      />
      {/* Temp for empty screen display */}
      <Box>
        <Text
          variant="eyebrow"
          color="foregroundBrandSecondary"
          marginBottom={2}
        >
          {formatMessage(messages.myPregnancy)}
        </Text>
        <InfoCardGrid
          empty={{
            title: 'Engar upplýsingar um meðgöngu',
            description: 'Engar upplýsingar um meðgöngu fundust.',
          }}
          cards={[
            {
              title: 'Meðgangan mín ',
              description:
                'Hér getur þú séð fundið allar upplýsingar sem tengjast meðgöngu þinni',
              size: 'large',
              to: HealthPaths.HealthOrganDonation,
              detail: [
                { label: 'Lengd meðgöngu', value: '19 vikur + 2 dagar' },
                { label: 'Væntanlegur fæðingardagur.', value: '08.07.2025' },
              ],
              img: './assets/images/baby.svg',
            },
          ]}
          size="large"
        />
      </Box>
      {/* Displaying basic information like healthcenter, dentist, */}
      <BasicInformation
        healthCenterData={
          healthCenterData?.rightsPortalHealthCenterRegistrationHistory
        }
        healthCenterLoading={healthCenterLoading}
        healthCenterError={!!healthCenterError}
        dentistsData={
          dentistsData?.rightsPortalUserDentistRegistration?.dentist?.name
        }
        dentistsLoading={dentistsLoading}
        dentistError={!!dentistsError}
        insuranceData={data?.rightsPortalInsuranceOverview}
        insuranceLoading={loading}
        insuranceError={!!error}
        donorData={donorStatusData?.healthDirectorateOrganDonation.donor}
        donorLoading={donorStatusLoading}
        donorError={!!donorStatusError}
      />
    </>
  )
}

export default HealthOverview
