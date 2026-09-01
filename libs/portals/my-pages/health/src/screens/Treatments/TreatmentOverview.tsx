import { Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { useGetHealthTreatmentsOverviewQuery } from './TreatmentOverview.generated'

type UseParams = {
  id: string
}

const TreatmentOverview: React.FC = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetHealthTreatmentsOverviewQuery()

  const treatment = data?.healthDirectorateTreatments?.find(
    (item) => item.id === id,
  )

  return (
    <IntroWrapper
      title={treatment?.name ?? formatMessage(messages.treatment)}
      intro={messages.treatmentIntro}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirTreatmentTooltip),
      }}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <CardLoader />
      ) : !treatment ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        // TODO: replace stub with the full overview in PR 3
        <Stack space={1}>
          {treatment.organizationName && (
            <Text>{treatment.organizationName}</Text>
          )}
          {treatment.departmentName && <Text>{treatment.departmentName}</Text>}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default TreatmentOverview
