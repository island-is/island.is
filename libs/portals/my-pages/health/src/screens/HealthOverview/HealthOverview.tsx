import {
  AlertMessage,
  Box,
  Button,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  SkeletonLoader,
  Stack,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
  StackWithBottomDivider,
  UserInfoLine,
  amountFormat,
  downloadLink,
  formatDate,
  isDateAfterToday,
  m,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  CONTENT_GAP,
  CONTENT_GAP_LG,
  CONTENT_GAP_SM,
  SECTION_GAP,
} from '../../utils/constants'
import {
  useGetInsuranceConfirmationLazyQuery,
  useGetInsuranceOverviewQuery,
  useGetHealthCenterQuery,
  useGetDentistsQuery,
  useGetDonorStatusQuery,
} from './HealthOverview.generated'
import subYears from 'date-fns/subYears'
import InfoBox from '../../components/InfoBox/InfoBox'
import InfoBoxItem from '../../components/InfoBox/InfoBoxItem'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

export const HealthOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns, locale } = useLocale()
  const user = useUserInfo()

  const { data, error, loading } = useGetInsuranceOverviewQuery()

  const [displayConfirmationErrorAlert, setDisplayConfirmationErrorAlert] =
    useState(false)

  const [
    getInsuranceConfirmationLazyQuery,
    { loading: confirmationLoading, error: confirmationError },
  ] = useGetInsuranceConfirmationLazyQuery()

  const getInsuranceConfirmation = async () => {
    const { data: fetchedData } = await getInsuranceConfirmationLazyQuery()
    const downloadData = fetchedData?.rightsPortalInsuranceConfirmation

    if (downloadData?.data && downloadData.fileName) {
      downloadLink(downloadData.data, 'application/pdf', downloadData.fileName)
    }
  }

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
    if (confirmationError) {
      setDisplayConfirmationErrorAlert(true)
    }
  }, [confirmationError])

  useEffect(() => {
    if (!loading && displayConfirmationErrorAlert) {
      toast.warning(
        formatMessage(messages.healthInsuranceConfirmationTransferError),
      )
      setTimeout(() => setDisplayConfirmationErrorAlert(false), 5000)
    }
  }, [displayConfirmationErrorAlert, loading, formatMessage])

  const insurance = data?.rightsPortalInsuranceOverview

  const isEhicValid = isDateAfterToday(
    insurance?.ehicCardExpiryDate ?? undefined,
  )

  return (
    <IntroWrapper
      marginBottom={CONTENT_GAP_LG}
      title={formatMessage(messages.myHealthOverview)}
      intro={formatMessage(messages.overviewIntro)}
      buttonGroup={[
        <Button
          variant="utility"
          disabled={displayConfirmationErrorAlert}
          size="small"
          icon="fileTrayFull"
          loading={confirmationLoading}
          iconType="outline"
          onClick={() => getInsuranceConfirmation()}
        >
          {formatMessage(messages.healthInsuranceConfirmation)}
        </Button>,
      ]}
      img="./assets/images/jobs.svg"
    >
      {error ? (
        <Problem error={error} noBorder={false} />
      ) : (
        <InfoLineStack space={1} label={formatMessage(m.baseInfo)}>
          <InfoLine
            label={formatMessage(messages.healthCenter)}
            content={healthCenterName ?? ''}
            loading={healthCenterLoading}
          />
          <InfoLine
            label={formatMessage(messages.dentist)}
            content={dentistName ?? ''}
            loading={dentistsLoading}
          />
          <InfoLine
            label={formatMessage(messages.organDonation)}
            content={formatMessage(
              isOrganDonor ? messages.iAmOrganDonor : messages.iAmNotOrganDonor,
            )}
            loading={donorStatusLoading}
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
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        columnGap="gutter"
        marginBottom={4}
      >
        <InfoBox
          button={{
            action: () => console.log('action'),
            label: 'Sjá allar tímabókanir',
          }}
          title="Næstu tímabókanir"
          icon={{ icon: 'calendar' }}
        >
          <InfoBoxItem
            title="Skimun fyrir leghálskrabbameini"
            data={[
              {
                label: 'Fimmtudagur, 09.01.2025',
                content: (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    columnGap="p1"
                  >
                    <Icon
                      icon="time"
                      color="blue400"
                      type="outline"
                      size="small"
                    />
                    <Text variant="small">13:00</Text>
                  </Box>
                ),
              },
              {
                label: 'Heilsugæslan Hlíðum',
              },
            ]}
          />
          <InfoBoxItem
            title="Brjóstarannsókn"
            data={[
              {
                label: 'Miðvikudagur, 27.11.2024',
                content: (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    columnGap="p1"
                  >
                    <Icon
                      icon="time"
                      color="blue400"
                      type="outline"
                      size="small"
                    />
                    <Text variant="small">13:00</Text>
                  </Box>
                ),
              },
              {
                label: 'Brjóstamiðstöð',
              },
            ]}
          />
        </InfoBox>
        <InfoBox
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
        </InfoBox>
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
    </IntroWrapper>
  )
}

export default HealthOverview
