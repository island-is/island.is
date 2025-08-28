import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
import {
  Box,
  Button,
  Stack,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  ActionCardLoader,
  formatDate,
  IntroWrapper,
  NoDataScreen,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetPatientDataPermitsQuery } from './PatientDataPermits.generated'
import { Problem } from '@island.is/react-spa/shared'

const PatientDataPermits: React.FC = () => {
  useNamespaces('sp.health')
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const [showExipredPermits, setShowExpiredPermits] = React.useState(false)

  const { data, loading, error } = useGetPatientDataPermitsQuery({
    variables: { locale: lang },
  })
  const dataLength = data?.healthDirectoratePatientDataPermits.data.length ?? 0

  const filteredData = data?.healthDirectoratePatientDataPermits.data.filter(
    (permit) =>
      showExipredPermits ||
      permit.status === HealthDirectoratePermitStatus.active,
  )
  return (
    <IntroWrapper
      title={formatMessage(messages.patientDataPermitTitle)}
      intro={formatMessage(messages.patientDataPermitDescription)}
      serviceProviderSlug="landlaeknir"
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )} // TODO: Update this tooltip message if needed
      buttonGroup={[
        <Button variant="utility" icon="open" iconType="outline">
          {formatMessage(messages.readAboutPermit)}
        </Button>,
        <Button
          variant="utility"
          colorScheme="primary"
          icon="arrowForward"
          iconType="outline"
          size="small"
          onClick={() => navigate(HealthPaths.HealthPatientDataPermitsAdd)}
        >
          {formatMessage(messages.addPermit)}
        </Button>,
      ]}
    >
      {!loading && dataLength === 0 && !error && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noPermits)}
          message={formatMessage(messages.noPermitsRegistered)}
          imgSrc="./assets/images/coffee.svg"
        />
      )}
      {loading && <ActionCardLoader repeat={3} />}
      {error && !loading && (
        <Problem title={formatMessage(messages.errorTryAgain)} />
      )}
      {!error && !loading && dataLength > 0 && (
        <Box>
          <Box justifyContent="flexEnd" display="flex">
            <ToggleSwitchButton
              label={formatMessage(messages.showExipredPermits)}
              onChange={() => setShowExpiredPermits(!showExipredPermits)}
              checked={showExipredPermits}
            />
          </Box>
          <Stack space={2}>
            {filteredData?.map((permit) => (
              <ActionCard
                heading={formatMessage(messages.permit)}
                text={formatMessage(messages.permitValidFor, {
                  country: permit.countries
                    .flatMap((country) => country.name)
                    .join(', '),
                })}
                subText={
                  permit.status === HealthDirectoratePermitStatus.active
                    ? formatMessage(messages.medicineValidTo) +
                      ' ' +
                      formatDate(permit.validTo)
                    : formatMessage(messages.validToFrom, {
                        fromDate: formatDate(permit.validFrom),
                        toDate: formatDate(permit.validTo),
                      })
                }
                tag={
                  permit.status === HealthDirectoratePermitStatus.active
                    ? {
                        label: formatMessage(messages.valid),
                        variant: 'blue',
                        outlined: false,
                      }
                    : permit.status === HealthDirectoratePermitStatus.expired
                    ? {
                        label: formatMessage(messages.expired),
                        variant: 'red',
                        outlined: false,
                      }
                    : {
                        label: formatMessage(messages.invalid),
                        variant: 'red',
                        outlined: false,
                      }
                }
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
