import {
  Box,
  Button,
  Inline,
  SkeletonLoader,
  Tabs,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
  Modal,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { messages as m } from '../../lib/messages'
import { SECTION_GAP } from '../../utils/constants'
import { useGetVaccinationsQuery } from './Vaccinations.generated'
import { SortedVaccinationsTable } from './tables/SortedVaccinationsTable'
import { useState } from 'react'
import StatusModal from './StatusModal'

export const VaccinationsWrapper = () => {
  useNamespaces('sp.health')
  const { formatMessage, locale } = useLocale()
  const { data, loading, error } = useGetVaccinationsQuery({
    variables: {
      locale: locale,
    },
  })

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const vaccinations = data?.healthDirectorateVaccinations.vaccinations

  const general = vaccinations?.filter((x) => x.isFeatured)
  const other = vaccinations?.filter((x) => !x.isFeatured)

  const tabs = [
    {
      label: formatMessage(m.generalVaccinations),
      content: <SortedVaccinationsTable data={general} />,
    },
    {
      label: formatMessage(m.otherVaccinations),
      content: <SortedVaccinationsTable data={other} />,
    },
  ].filter(isDefined)

  return (
    <IntroWrapper
      title={formatMessage(m.vaccinations)}
      intro={formatMessage(m.vaccinationsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(m.landlaeknirVaccinationsTooltip)}
      buttonGroup={[
        <LinkButton
          key="vaccinations-read-about"
          to={formatMessage(m.readAboutVaccinationsLink)}
          icon="open"
          variant="utility"
          text={formatMessage(m.readAboutVaccinations)}
        />,
        <LinkButton
          key="vaccinations-make-appointment"
          to={formatMessage(m.makeVaccinationAppointmentLink)}
          icon="open"
          variant="utility"
          text={formatMessage(m.makeVaccinationAppointment)}
        />,
        <Button
          icon="informationCircle"
          variant="utility"
          iconType="outline"
          onClick={() => setIsStatusModalOpen(true)}
        >
          {formatMessage(m.vaccinationStatusDesc)}
        </Button>,
      ]}
    >
      <Box>
        {loading && (
          <SkeletonLoader
            repeat={3}
            space={2}
            height={24}
            borderRadius="standard"
          />
        )}
        {!error && vaccinations?.length === 0 && (
          <EmptyTable message={formatMessage(m.noVaccinesRegistered)} />
        )}

        {!loading && error && <Problem error={error} noBorder={false} />}
      </Box>
      {/* Tabs content */}
      {!loading && !error && (
        <Box paddingY={SECTION_GAP}>
          <Box display="flex" flexWrap="wrap" marginBottom={3}>
            <Box width="half">
              <Inline>
                <Tag variant="blue" outlined disabled>
                  {formatMessage(m.vaccineUnfinished)}
                </Tag>
                <Text fontWeight="medium" variant="medium">
                  'bleblebleb'
                </Text>
              </Inline>
            </Box>
            <Box width="half">
              <Text fontWeight="medium" variant="medium">
                {formatMessage(m.vaccineExpired) + ': '}
              </Text>
            </Box>
            <Box width="half">
              <Text fontWeight="medium" variant="medium">
                {formatMessage(m.vaccineUnvaccined) + ': '}
              </Text>
            </Box>
            <Box width="half">
              <Text fontWeight="medium" variant="medium">
                {formatMessage(m.vaccineValid) + ': '}
              </Text>
            </Box>
            <Box width="half">
              <Text fontWeight="medium" variant="medium">
                {formatMessage(m.vaccineFinished) + ': '}
              </Text>
            </Box>
            <Box width="half">
              <Text fontWeight="medium" variant="medium">
                {formatMessage(m.vaccineUncertain) + ': '}
              </Text>
            </Box>
            <Box width="half">
              <Text fontWeight="medium" variant="medium">
                {formatMessage(m.vaccineUnregistered) + ': '}
              </Text>
            </Box>
          </Box>
          <Tabs
            label={''}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />
        </Box>
      )}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
        }}
      />
    </IntroWrapper>
  )
}
export default VaccinationsWrapper
