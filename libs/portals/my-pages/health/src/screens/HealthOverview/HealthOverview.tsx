import {
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoCard,
  InfoCardGrid,
  InfoLine,
  InfoLineStack,
  formatDate,
  isDateAfterToday,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import subYears from 'date-fns/subYears'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP_LG } from '../../utils/constants'
import * as styles from './HealthOverview.css'
import {
  useGetDentistsQuery,
  useGetDonorStatusQuery,
  useGetHealthCenterQuery,
  useGetInsuranceOverviewQuery,
} from './HealthOverview.generated'
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

export const HealthOverview = () => {
  useNamespaces('sp.health')
  const { formatMessage, locale } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  const { data, error, loading } = useGetInsuranceOverviewQuery()
  const [displayConfirmationErrorAlert, setDisplayConfirmationErrorAlert] =
    useState(false)

  const {
    data: healthCenterData,
    loading: healthCenterLoading,
    error: healthCenterError,
  } = useGetHealthCenterQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const {
    data: dentistsData,
    loading: dentistsLoading,
    error: dentistsError,
  } = useGetDentistsQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const {
    data: donorStatusData,
    loading: donorStatusLoading,
    error: donorStatusError,
  } = useGetDonorStatusQuery({
    variables: {
      locale: locale,
    },
    fetchPolicy: 'no-cache',
  })

  const healthCenterName =
    healthCenterData?.rightsPortalHealthCenterRegistrationHistory?.current
      ?.healthCenterName

  const dentistName =
    dentistsData?.rightsPortalUserDentistRegistration?.dentist?.name

  const donor = donorStatusData?.healthDirectorateOrganDonation.donor

  console.log(donorStatusData?.healthDirectorateOrganDonation.donor)

  useEffect(() => {
    if (!loading && displayConfirmationErrorAlert) {
      toast.warning(
        formatMessage(messages.healthInsuranceConfirmationTransferError),
      )
      setTimeout(() => setDisplayConfirmationErrorAlert(false), 5000)
    }
  }, [displayConfirmationErrorAlert, loading, formatMessage])

  const doctor =
    healthCenterData?.rightsPortalHealthCenterRegistrationHistory?.current
      ?.doctor

  const insurance = data?.rightsPortalInsuranceOverview
  const isInsuranceCardValid = isDateAfterToday(
    insurance?.ehicCardExpiryDate ?? undefined,
  )
  const insuranceCardExpirationDate = insurance?.ehicCardExpiryDate
  const isInsured = insurance?.isInsured
  const insuredFrom = formatDate(insurance?.from)

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
      <Box>
        {/* If no appointments, hide */}
        <Text
          variant="eyebrow"
          color="foregroundBrandSecondary"
          marginBottom={2}
        >
          {formatMessage(messages.myAppointments)}
        </Text>

        <InfoCardGrid
          size="small"
          variant="appointment"
          empty={{
            title: 'Engir tímar',
            description: 'Engar tímabókanir framundan.',
          }}
          cards={[
            {
              title: 'Mæðravernd',
              description: 'Tími hjá: Sigríður Gunnarsdóttir',
              appointment: {
                date: 'Fimmtudaginn, 03.04.2025',
                time: '11:40',
                location: {
                  label: 'Heilsugæslan við Ásbrú',
                  href: HealthPaths.HealthCenter,
                },
              },
            },
            {
              title: 'Mæðravernd',
              description: 'Tími hjá: Sigríður Gunnarsdóttir',
              appointment: {
                date: 'Fimmtudaginn, 03.04.2025',
                time: '11:40',
                location: {
                  label: 'Heilsugæslan við Ásbrú',
                  href: HealthPaths.HealthCenter,
                },
              },
            },
          ]}
        />
      </Box>
      <Box>
        <Text
          variant="eyebrow"
          color="foregroundBrandSecondary"
          marginBottom={2}
        >
          Empty state
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
      <Box>
        <Text
          variant="eyebrow"
          color="foregroundBrandSecondary"
          marginBottom={2}
        >
          {formatMessage(messages.basicInformation)}
        </Text>
        <InfoCardGrid
          cards={[
            {
              title: 'Heilsugæslan Kirkjusandi',
              description: 'Heimilislæknir: Sigríður Gunnarsdóttir',
              to: HealthPaths.HealthCenter,
            },
            {
              title: formatMessage(messages.hasHealthInsurance),
              description: `${formatMessage(messages.from)} ${formatDate(
                insurance?.from,
              )}`,
              to: HealthPaths.HealthCenter, // TODO -> Hvert fer þessi síða
              icon: {
                color: isInsured ? 'mint600' : 'red400',
                type: isInsured ? 'checkmarkCircle' : 'closeCircle',
              },
            },
            {
              title: formatMessage(messages.ehic),
              description: `${formatMessage(
                isInsuranceCardValid
                  ? messages.medicineValidTo
                  : messages.medicineIsExpiredCertificate,
              )} ${formatDate(insurance?.ehicCardExpiryDate)}`,
              to: HealthPaths.HealthCenter, // TODO -> Hvert fer þessi síða
              icon: {
                color: isInsuranceCardValid ? 'mint600' : 'red400',
                type: isInsuranceCardValid ? 'checkmarkCircle' : 'closeCircle',
              },
            },
            {
              title: formatMessage(messages.organDonation),
              description: donor?.isDonor
                ? formatMessage(messages.youAreOrganDonor)
                : donor?.limitations?.hasLimitations
                ? formatMessage(messages.youAreOrganDonorWithExceptions)
                : formatMessage(messages.youAreNotOrganDonor),

              to: HealthPaths.HealthOrganDonation,
            },
            // TODO: Kemur inn þegar blóðflokka pull requestan er komin inn
            // {
            //   title: 'Blóðflokkur',
            //   description: 'Þú ert í blóðflokki A+',
            //   to: HealthPaths.HealthCenter,
            // },
            // TODO: Kemur inn þegar ofnæmisþjónustan er ready
            // {
            //   title: 'Ofnæmi',
            //   description: 'Ekkert skráð ofnæmi',
            //   to: HealthPaths.HealthCenter,
            // },
          ]}
          empty={{
            title: 'Engar grunnupplýsingar fundust',
            description: 'Engar grunnupplýsingar fundust um þig.',
          }}
          variant="link"
        />
      </Box>
    </>
  )
}

export default HealthOverview
