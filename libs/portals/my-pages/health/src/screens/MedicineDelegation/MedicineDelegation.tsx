import {
  ActionCard,
  Box,
  Button,
  Stack,
  Text,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { delegationData } from './utils/mockdata'
import * as styles from './MedicineDelegation.css'

const MedicineDelegation = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [showExipredPermits, setShowExpiredPermits] = useState(false)

  const filteredData = delegationData.filter((permit) =>
    showExipredPermits ? true : permit.isValid,
  )

  if (delegationData.length === 0) {
    return <Problem type="no_data" />
  }
  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      buttonGroup={[
        <>
          <LinkButton
            variant="utility"
            size="small"
            to={formatMessage(messages.medicineDelegationReadAboutLink)}
            text={formatMessage(messages.readAboutPermit)}
            icon="open"
          />
          <Button
            variant="utility"
            colorScheme="primary"
            icon="arrowForward"
            iconType="outline"
            size="small"
            onClick={() => navigate(HealthPaths.HealthMedicineDelegationAdd)}
          >
            {formatMessage(messages.addDelegation)}
          </Button>
        </>,
      ]}
    >
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
          label={formatMessage(messages.showExipredPermits)}
          onChange={() => setShowExpiredPermits(!showExipredPermits)}
          checked={showExipredPermits}
        />
      </Box>
      <Stack space={2}>
        {filteredData.map((item, i) => {
          return (
            <ActionCard
              key={item.id}
              heading={item.name}
              headingVariant="h4"
              text={formatMessage(messages.permitTo, {
                arg: item.delegationType,
              })}
              subText={
                formatMessage(messages.medicineValidTo) +
                ' ' +
                formatDate(item.dateTo)
              }
              tag={{
                outlined: false,
                label: item.isValid
                  ? formatMessage(messages.valid)
                  : formatMessage(messages.expired),
                variant: item.isValid ? 'blue' : 'red',
              }}
              cta={{
                variant: 'text',
                label: formatMessage(m.seeDetails),
                onClick: () =>
                  navigate(
                    `${HealthPaths.HealthMedicineDelegationDetail.replace(
                      ':id',
                      item.id,
                    )}`,
                  ),
              }}
            />
          )
        })}
      </Stack>
    </IntroWrapper>
  )
}

export default MedicineDelegation
