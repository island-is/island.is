import { Therapies as TherapiesType } from '@island.is/api/schema'
import { Box, Tabs, TabType } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
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
import LinkButton from '../../components/LinkButton/LinkButton'

const Therapies = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetTherapiesQuery()
  console.log(data)

  const therapiesData = data?.getRightsPortalTherapies ?? []

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
    physicalTherapyData.length > 0 && {
      label: formatMessage(messages.physicalTherapy),
      content: <TherapiesTabContent data={physioTherapyData} />,
    },
    speechTherapyData.length > 0 && {
      label: formatMessage(messages.speechTherapy),
      content: <TherapiesTabContent data={speechTherapyData} />,
    },
    occupationalTherapyData.length > 0 && {
      label: formatMessage(messages.occupationalTherapy),
      content: <TherapiesTabContent data={occupationalTherapyData} />,
    },
  ].filter((x) => x !== false) as TabType[]

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.therapyTitle)}
        intro={formatMessage(messages.therapyDescription)}
      />
      {!loading && !error && tabs.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}

      {!loading && !error && tabs.length > 0 && (
        <Box marginTop={[0, 0, 5]}>
          <Tabs
            label={formatMessage(messages.chooseTherapy)}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />

          <LinkButton
            to="https://island.is/s/sjukratryggingar/thjalfun"
            text={formatMessage(messages.physioLink)}
          />
        </Box>
      )}
    </Box>
  )
}

export default Therapies
