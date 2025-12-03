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
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { permitTagSelector } from '../../utils/tagSelector'
import { useGetPatientDataPermitsQuery } from './PatientDataPermits.generated'
import * as styles from './Permits.css'

const PatientDataPermits: FC = () => {
  useNamespaces('sp.health')
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const [showExpiredPermits, setShowExpiredPermits] = useState(false)

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
                key="addNewPermit"
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
      {loading && !error && (
        <Box marginY={3}>
          <ActionCardLoader repeat={3} />
        </Box>
      )}

      {!loading && !error && dataLength === 0 && (
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
      {!loading && !error && dataLength > 0 && (
        <Box>
          <Box
            justifyContent="spaceBetween"
            alignItems="center"
            display="flex"
            marginBottom={2}
            className={styles.toggleBox}
          >
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
          {dataLength > 0 &&
            filteredData?.length === 0 &&
            !showExpiredPermits && (
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(messages.noData)}
                message={formatMessage(messages.noActivePermitsRegistered)}
                imgSrc="./assets/images/empty_flower.svg"
                imgAlt=""
              />
            )}
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
        </Box>
      )}
    </IntroWrapper>
  )
}

export default PatientDataPermits
