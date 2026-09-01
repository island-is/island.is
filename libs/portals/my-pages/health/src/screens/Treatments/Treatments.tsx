import { ActionCard, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetHealthTreatmentsOverviewQuery } from './TreatmentOverview.generated'

const Treatments: React.FC = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { data, loading, error } = useGetHealthTreatmentsOverviewQuery()

  const treatments = data?.healthDirectorateTreatments

  // A single treatment needs no chooser — go straight to it.
  if (!loading && !error && treatments?.length === 1) {
    return (
      <Navigate
        to={HealthPaths.HealthTreatment.replace(':id', treatments[0].id)}
        replace
      />
    )
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.treatments)}
      intro={messages.treatmentsIntro}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirTreatmentTooltip),
      }}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && loading && <CardLoader />}
      {!loading && !error && !treatments?.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noTreatmentsTitle)}
          message={formatMessage(messages.noTreatments)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      <Stack space={2}>
        {treatments && treatments.length > 1
          ? treatments.map((treatment) => (
              <ActionCard
                key={treatment.id}
                heading={treatment.name.trim() || formatMessage(messages.treatment)}
                headingVariant="h4"
                eyebrow={treatment.organizationName ?? undefined}
                text={treatment.departmentName ?? undefined}
                cta={{
                  onClick: () =>
                    navigate(
                      HealthPaths.HealthTreatment.replace(':id', treatment.id),
                    ),
                  label: formatMessage(messages.seeMore),
                  variant: 'text',
                }}
              />
            ))
          : null}
      </Stack>
    </IntroWrapper>
  )
}

export default Treatments
