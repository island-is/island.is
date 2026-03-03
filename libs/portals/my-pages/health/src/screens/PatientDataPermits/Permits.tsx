import { ActionCard, Box, Button, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCardLoader,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { permitTagSelector } from '../../utils/tagSelector'
import { useGetPatientDataPermitsQuery } from './PatientDataPermits.generated'

const PatientDataPermits: FC = () => {
  useNamespaces('sp.health')
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = useGetPatientDataPermitsQuery({
    variables: {
      locale: lang,
    },
  })

  const consent = data?.healthDirectoratePatientDataPermits?.consent
  const permits = consent ? [consent] : []

  return (
    <IntroWrapper
      title={formatMessage(messages.patientDataPermitTitle)}
      intro={formatMessage(messages.patientDataPermitDescription)}
      serviceProviderSlug="landlaeknir"
      loading={loading}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirPatientPermitsTooltip,
      )}
      buttonGroup={
        !loading && !error
          ? [
              <LinkButton
                variant="utility"
                size="small"
                to={formatMessage(messages.patientDataPermitsLink)}
                text={formatMessage(messages.patientDataPermitsLinkText)}
                icon="open"
              />,
              ...(!consent
                ? [
                    <Button
                      key="addNewPermit"
                      variant="primary"
                      icon="arrowForward"
                      iconType="outline"
                      size="small"
                      onClick={() =>
                        navigate(HealthPaths.HealthPatientDataPermitsAdd)
                      }
                    >
                      {formatMessage(messages.addPermit)}
                    </Button>,
                  ]
                : []),
            ]
          : undefined
      }
    >
      {loading && !error && (
        <Box marginY={3}>
          <ActionCardLoader repeat={3} />
        </Box>
      )}

      {!loading && !error && permits.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          imgAlt=""
          title={formatMessage(messages.noPermit)}
          message={formatMessage(messages.noPermitsRegistered)}
          imgSrc="./assets/images/empty_flower.svg"
        />
      )}
      {!loading && error && <Problem error={error} noBorder={false} />}
      {!loading && !error && permits.length > 0 && (
        <Stack space={2}>
          {permits.map((permit) => (
            <ActionCard
              key={permit.id}
              backgroundColor="white"
              eyebrow={formatMessage(messages.healthDirectorate)}
              eyebrowColor="purple400"
              heading={formatMessage(messages.patientDataPermit)}
              text={formatMessage(messages.patientDataSharedDescription)}
              tag={permitTagSelector(permit.status, formatMessage)}
              cta={{
                size: 'small',
                variant: 'text',
                label: formatMessage(messages.seeMore),
                onClick: () =>
                  navigate(
                    HealthPaths.HealthPatientDataPermitsDetail.replace(
                      ':id',
                      permit.id ?? '',
                    ),
                  ),
              }}
            />
          ))}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default PatientDataPermits
