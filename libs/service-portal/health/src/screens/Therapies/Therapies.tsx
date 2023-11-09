import { RightsPortalTherapy as TherapiesType } from '@island.is/api/schema'
import { Box, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import TherapiesTabContent from '../../components/TherapiesTabContent/TherapiesTabContent'
import {
  OCCUPATIONAL_THERAPY,
  PHYSIO_ACCIDENT_THERAPY,
  PHYSIO_HOME_THERAPY,
  PHYSIO_THERAPY,
  SPEECH_THERAPY,
} from '../../utils/constants'
import { useGetTherapiesQuery } from './Therapies.generated'

const Therapies = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetTherapiesQuery()

  const therapiesData = data?.rightsPortalPaginatedTherapies?.data ?? []

  const physicalTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === PHYSIO_THERAPY,
  )
  const physioHomeTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === PHYSIO_HOME_THERAPY,
  )
  const physioAccidentTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === PHYSIO_ACCIDENT_THERAPY,
  )
  const speechTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === SPEECH_THERAPY,
  )

  const occupationalTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === OCCUPATIONAL_THERAPY,
  )

  // Combine all types of physio therapy together, display options in select box under "physio" tab
  const physioTherapyData = physicalTherapyData.concat(
    physioAccidentTherapyData,
    physioHomeTherapyData,
  )

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.therapies).toLowerCase(),
        })}
      />
    )
  }
  // Construct tabs array and filter out empty arrays
  const tabs = [
    {
      label: formatMessage(messages.physicalTherapy),
      content: (
        <TherapiesTabContent
          data={physioTherapyData}
          link={formatMessage(messages.physioDescriptionLink)}
          linkText={formatMessage(messages.physioLink)}
        />
      ),
    },
    {
      label: formatMessage(messages.speechTherapy),
      content: (
        <TherapiesTabContent
          data={speechTherapyData}
          link={formatMessage(messages.speechDescriptionLink)}
          linkText={formatMessage(messages.speechLink)}
        />
      ),
    },
    {
      label: formatMessage(messages.occupationalTherapy),
      content: (
        <TherapiesTabContent
          data={occupationalTherapyData}
          link={formatMessage(messages.occupationalDescriptionLink)}
          linkText={formatMessage(messages.occupationalLink)}
        />
      ),
    },
  ]

  const tabsElement =
    tabs.length === 1 ? (
      <>
        <Text variant="h5">{tabs[0].label}</Text>
        <Box>{tabs[0].content}</Box>
      </>
    ) : (
      <Tabs
        label={formatMessage(messages.chooseTherapy)}
        tabs={tabs}
        contentBackground="transparent"
        selected="0"
        size="xs"
      />
    )

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.therapyTitle)}
        intro={formatMessage(messages.therapyDescription)}
        serviceProviderID={SJUKRATRYGGINGAR_ID}
        serviceProviderTooltip={formatMessage(m.healthTooltip)}
      />
      {!loading && !error && tabs.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}

      {!loading && !error && tabs.length > 0 && (
        <Box marginTop={[6]}>{tabsElement}</Box>
      )}
    </Box>
  )
}

export default Therapies
