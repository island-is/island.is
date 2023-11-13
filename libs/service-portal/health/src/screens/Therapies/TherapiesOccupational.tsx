import { RightsPortalTherapy as TherapiesType } from '@island.is/api/schema'

import { useLocale, useNamespaces } from '@island.is/localization'

import { messages } from '../../lib/messages'
import TherapiesTabContent from '../../components/TherapiesTabContent/TherapiesTabContent'
import { OCCUPATIONAL_THERAPY } from '../../utils/constants'
import { useGetTherapiesQuery } from './Therapies.generated'
import { TherapiesWrapper } from './TherapiesWrapper'

const Therapies = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetTherapiesQuery()

  const therapiesData = data?.rightsPortalPaginatedTherapies?.data ?? []

  const occupationalTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === OCCUPATIONAL_THERAPY,
  )

  return (
    <TherapiesWrapper loading={loading} error={!!error}>
      <TherapiesTabContent
        data={occupationalTherapyData}
        link={formatMessage(messages.occupationalDescriptionLink)}
        linkText={formatMessage(messages.occupationalLink)}
      />
    </TherapiesWrapper>
  )
}

export default Therapies
