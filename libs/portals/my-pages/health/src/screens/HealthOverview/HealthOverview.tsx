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

  const isOrganDonor =
    donorStatusData?.healthDirectorateOrganDonation.donor?.isDonor

  useEffect(() => {
    if (!loading && displayConfirmationErrorAlert) {
      toast.warning(
        formatMessage(messages.healthInsuranceConfirmationTransferError),
      )
      setTimeout(() => setDisplayConfirmationErrorAlert(false), 5000)
    }
  }, [displayConfirmationErrorAlert, loading, formatMessage])

  const insurance = data?.rightsPortalInsuranceOverview
  const doctor =
    healthCenterData?.rightsPortalHealthCenterRegistrationHistory?.current
      ?.doctor

  const isEhicValid = isDateAfterToday(
    insurance?.ehicCardExpiryDate ?? undefined,
  )
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

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
      {/* If no appontments, hide */}
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.myAppointments)}
      </Text>
      <Box
        display="flex"
        rowGap={2}
        columnGap={2}
        flexWrap="wrap"
        flexDirection="row"
      >
        <AppointmentCard
          size="small"
          title="Mæðravernd"
          date="Fimmtudaginn, 03.04.2025"
          time="11:40"
          description="Tími hjá: Sigríður Gunnarsdóttir"
          location={{
            label: 'Heilsugæslan við Ásbrú',
            href: HealthPaths.HealthCenter,
          }}
        />
        <AppointmentCard
          size="small"
          title="Mæðravernd"
          date="Fimmtudaginn, 03.04.2025"
          time="11:40"
          description="Tími hjá: Sigríður Gunnarsdóttir"
          location={{
            label: 'Heilsugæslan við Ásbrú',
            href: HealthPaths.HealthCenter,
          }}
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
      <Box marginTop={6}>
        {error ? (
          <Problem error={error} noBorder={false} />
        ) : (
          <InfoLineStack space={1} label={formatMessage(m.baseInfo)}>
            <InfoLine
              label={formatMessage(messages.healthCenter)}
              content={healthCenterName ?? ''}
              loading={healthCenterLoading}
              button={{
                to: HealthPaths.HealthCenter,
                label: formatMessage(messages.seeMore),
                type: 'link',
                icon: 'arrowForward',
              }}
            />
            {doctor && (
              <InfoLine
                label={formatMessage(messages.chooseDoctorPlaceholder)}
                content={doctor}
                loading={healthCenterLoading}
              />
            )}
            <InfoLine
              label={formatMessage(messages.dentist)}
              content={dentistName ?? ''}
              loading={dentistsLoading}
              button={{
                to: HealthPaths.HealthDentists,
                label: formatMessage(messages.seeMore),
                type: 'link',
                icon: 'arrowForward',
              }}
            />
            <InfoLine
              label={formatMessage(messages.organDonation)}
              content={formatMessage(
                isOrganDonor
                  ? messages.iAmOrganDonor
                  : messages.iAmNotOrganDonor,
              )}
              loading={donorStatusLoading}
              button={{
                to: HealthPaths.HealthOrganDonation,
                label: formatMessage(messages.seeMore),
                type: 'link',
                icon: 'arrowForward',
              }}
            />
            <InfoLine
              label={formatMessage(messages.hasHealthInsurance)}
              content={
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  columnGap="p1"
                >
                  <Text>
                    {insurance?.isInsured &&
                      formatMessage(messages.medicineValidFrom)}{' '}
                    {formatDate(insurance?.from, 'dd.MM.yyyy')}
                  </Text>
                  <Icon
                    icon={
                      insurance?.isInsured ? 'checkmarkCircle' : 'closeCircle'
                    }
                    color={insurance?.isInsured ? 'mint600' : 'red600'}
                    type="filled"
                  />
                  <Text fontWeight="semiBold" variant="small">
                    {formatMessage(insurance?.isInsured ? m.valid : m.expired)}
                  </Text>
                </Box>
              }
              loading={loading}
              button={{
                to: HealthPaths.HealthInsurance,
                label: formatMessage(messages.seeMore),
                type: 'link',
                icon: 'arrowForward',
              }}
            />
            <InfoLine
              label={formatMessage(messages.ehic)}
              content={
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  columnGap="p1"
                >
                  <Text>
                    {insurance?.ehicCardExpiryDate &&
                      formatMessage(
                        isEhicValid
                          ? messages.medicineValidFrom
                          : messages.medicineValidTo,
                      )}{' '}
                    {formatDate(insurance?.ehicCardExpiryDate, 'dd.MM.yyyy')}
                  </Text>
                  <Icon
                    icon={isEhicValid ? 'checkmarkCircle' : 'closeCircle'}
                    color={isEhicValid ? 'mint600' : 'red600'}
                    type="filled"
                  />
                  <Text fontWeight="semiBold" variant="small">
                    {formatMessage(isEhicValid ? m.valid : m.expired)}
                  </Text>
                </Box>
              }
              loading={loading}
            />
          </InfoLineStack>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        columnGap="gutter"
        marginBottom={4}
      >
        {/* <InfoBox
          button={{
            action: () => console.log('action'),
            label: 'Sjá allt',
          }}
          title="Biðlistar"
          icon={{ icon: 'document' }}
        >
          <InfoBoxItem
            title="Liðaskiptaaðgerð á hné"
            data={[
              {
                label: 'Landspítalinn',
              },
            ]}
          />
          <InfoBoxItem
            title="Hjúkrunarheimili"
            data={[
              {
                label: 'Sóltún hjúkrunarheimili',
                content: (
                  <Tag variant="blueberry" outlined>
                    Umsókn í vinnslu
                  </Tag>
                ),
              },
            ]}
          />
        </InfoBox> */}
      </Box>
      {/* FLÝTILEIÐIR TODO: Add correct path to each card */}
      <Box>
        <Text variant="eyebrow" color="purple400" marginBottom={2}>
          Flýtileiðir
        </Text>
        <GridContainer>
          <GridRow marginBottom={2}>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Krabbameinsmeðferð"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Lyfjaávísanir"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Lyfjaskírteini"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
          </GridRow>
          <GridRow marginBottom={2}>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Greiðslur og réttindi"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Þjálfun"
                text="Staða beiðna þinna í sjúkraþjálfun, talþjálfun eða iðjuþjálfun."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Hjálpartæki og næring"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
          </GridRow>
          <GridRow marginBottom={2}>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Bólusetningar"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
            <GridColumn span={'4/12'}>
              <CategoryCard
                hyphenate
                heading="Bólusetningarvottorð"
                text="Torem ipsum dolor sit amet, consectetur adipiscing elit interdum, ac aliquet odio mattis."
                headingVariant="h4"
                textVariant="small"
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

export default HealthOverview
