import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
import {
  ActionCard,
  Box,
  Button,
  Stack,
  Text,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCardLoader,
  formatDate,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetPatientDataPermitsQuery } from './PatientDataPermits.generated'
import * as styles from './Permits.css'
import { permitTagSelector } from '../../utils/tagSelector'

const PatientDataPermits: React.FC = () => {
  useNamespaces('sp.health')
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const [showExpiredPermits, setShowExpiredPermits] = React.useState(false)

  const { data, loading, error } = useGetPatientDataPermitsQuery({
    variables: {
      locale: lang,
      input: {
        status: [
          HealthDirectoratePermitStatus.active,
          HealthDirectoratePermitStatus.expired,
          HealthDirectoratePermitStatus.inactive,
          HealthDirectoratePermitStatus.unknown,
          HealthDirectoratePermitStatus.awaitingApproval,
        ],
      },
    },
  })

  const dataLength = data?.healthDirectoratePatientDataPermits.data.length ?? 0

  const filteredData = data?.healthDirectoratePatientDataPermits?.data?.filter(
    (item) =>
      showExpiredPermits
        ? item.status
        : item.status === HealthDirectoratePermitStatus.active ||
          item.status === HealthDirectoratePermitStatus.awaitingApproval,
  )

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
              <Button
                key="readAboutPermit"
                variant="utility"
                icon="open"
                iconType="outline"
              >
                {formatMessage(messages.readAboutPermit)}
              </Button>,
              <Button
                key={'addNewPermit'}
                variant="utility"
                colorScheme="primary"
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
          : undefined
      }
    >
      {!loading && showExpiredPermits && dataLength === 0 && !error && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noPermit)}
          message={formatMessage(messages.noPermitsRegistered)}
          imgSrc="./assets/images/empty_flower.svg"
        />
      )}
      {loading && <ActionCardLoader repeat={3} />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      <Box>
        <Box justifyContent="spaceBetween" alignItems="center" display="flex">
          <Text variant="medium">
            {filteredData?.length === 1
              ? formatMessage(messages.singlePermit)
              : formatMessage(messages.numberOfPermits, {
                  number: filteredData?.length,
                })}
          </Text>
          <ToggleSwitchButton
            className={styles.toggleButton}
            label={formatMessage(messages.showExpiredPermits)}
            onChange={() => setShowExpiredPermits(!showExpiredPermits)}
            checked={showExpiredPermits}
          />
        </Box>
        {!error && !loading && dataLength > 0 && (
          <Stack space={2}>
            {filteredData?.map((permit) => (
              <ActionCard
                key={permit.id}
                backgroundColor={
                  permit.status ===
                  HealthDirectoratePermitStatus.awaitingApproval
                    ? 'blue'
                    : 'white'
                }
                heading={formatMessage(messages.permit)}
                text={permit.countries
                  .map((country) => country.name)
                  .join(', ')}
                date={formatMessage(messages.validToFrom, {
                  fromDate: formatDate(permit.validFrom),
                  toDate: formatDate(permit.validTo),
                })}
                tag={permitTagSelector(permit.status, formatMessage)}
                cta={{
                  size: 'small',
                  variant: 'text',
                  label: formatMessage(messages.seeMore),
                  onClick: () =>
                    navigate(
                      HealthPaths.HealthPatientDataPermitsDetail.replace(
                        ':id',
                        permit.id.toString(),
                      ),
                    ),
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </IntroWrapper>
  )
}

export default PatientDataPermits
