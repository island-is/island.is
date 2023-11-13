import { RightsPortalTherapy as TherapiesType } from '@island.is/api/schema'

import { useLocale, useNamespaces } from '@island.is/localization'

import { messages } from '../../lib/messages'
import TherapiesTabContent from '../../components/TherapiesTabContent/TherapiesTabContent'
import {
  PHYSIO_ACCIDENT_THERAPY,
  PHYSIO_HOME_THERAPY,
  PHYSIO_THERAPY,
} from '../../utils/constants'
import { useGetTherapiesQuery } from './Therapies.generated'
import { TherapiesWrapper } from './wrapper/TherapiesWrapper'

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

  // Combine all types of physio therapy together, display options in select box under "physio" tab
  const physioTherapyData = physicalTherapyData.concat(
    physioAccidentTherapyData,
    physioHomeTherapyData,
  )

  return (
    <TherapiesWrapper loading={loading} error={!!error}>
      <TherapiesTabContent
        data={physioTherapyData}
        link={formatMessage(messages.physioDescriptionLink)}
        linkText={formatMessage(messages.physioLink)}
      />
    </TherapiesWrapper>
  )
}

export default Therapies
