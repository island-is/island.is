import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard, IntroWrapper } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import {
  Box,
  Button,
  Stack,
  Text,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { mockData } from './mockData'
import { m } from '@island.is/portals/core'
import { useNavigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'

const PatientDataPermits: React.FC = () => {
  useNamespaces('sp.health')
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const [showExipredPermits, setShowExpiredPermits] = React.useState(false)

  const filteredData = mockData.filter(
    (permit) => showExipredPermits || permit.isValid,
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
        >
          {formatMessage(messages.addPermit)}
        </Button>,
      ]}
    >
      <Box>
        <Box justifyContent="flexEnd" display="flex">
          <ToggleSwitchButton
            label={formatMessage(messages.showExipredPermits)}
            onChange={() => setShowExpiredPermits(!showExipredPermits)}
            checked={showExipredPermits}
          />
        </Box>
        <Stack space={2}>
          {filteredData.map((permit) => (
            <ActionCard
              heading={permit.title}
              text={formatMessage(messages.permitValidFor, {
                country: permit.countries
                  .flatMap((country) => country)
                  .join(', '),
              })}
              subText={formatMessage(messages.validToFrom, {
                fromDate: permit.validFrom.toLocaleDateString(),
                toDate: permit.validTo.toLocaleDateString(),
              })}
              tag={
                permit.isValid
                  ? {
                      label: formatMessage(messages.valid),
                      variant: 'blue',
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
    </IntroWrapper>
  )
}

export default PatientDataPermits
