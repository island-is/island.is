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
  ActionCardLoader,
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
import * as styles from './MedicineDelegation.css'
import { useGetMedicineDelegationsQuery } from './MedicineDelegation.generated'

const MedicineDelegation = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [showExpiredPermits, setShowExpiredPermits] = useState(false)

  const { data, loading, error } = useGetMedicineDelegationsQuery({
    variables: {
      locale: lang,
      input: {
        active: false, // Fetch all data so the user doens't have to refetch when toggling expired permits
      },
    },
  })
  const filteredData =
    data?.healthDirectorateMedicineDelegations?.items?.filter((item) =>
      showExpiredPermits ? item : item.isActive,
    )

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      loading={loading}
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
      {!loading && error && (
        <Problem type="internal_service_error" noBorder={false} />
      )}
      {!loading && !error && (!filteredData || filteredData.length === 0) && (
        <Problem type="no_data" noBorder={false} />
      )}
      {loading && !error && (
        <Box marginY={3}>
          <ActionCardLoader />
        </Box>
      )}
      {!loading && !error && filteredData && (
        <>
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

          <Stack space={2}>
            {filteredData?.map((item) => {
              return (
                <ActionCard
                  key={item.nationalId}
                  heading={item.name ?? ''}
                  headingVariant="h4"
                  text={formatMessage(messages.permitTo, {
                    arg: item.lookup
                      ? formatMessage(messages.pickupMedicineAndLookup)
                      : formatMessage(messages.pickupMedicine),
                  })}
                  subText={
                    item.dates?.to
                      ? formatMessage(messages.medicineValidTo) +
                        ' ' +
                        formatDate(item.dates.to)
                      : undefined
                  }
                  tag={{
                    outlined: false,
                    label: item.isActive
                      ? formatMessage(messages.valid)
                      : formatMessage(messages.expired),
                    variant: item.isActive ? 'blue' : 'red',
                  }}
                  cta={{
                    variant: 'text',
                    label: formatMessage(m.seeDetails),
                    onClick: () =>
                      item.nationalId &&
                      navigate(
                        `${HealthPaths.HealthMedicineDelegationDetail.replace(
                          ':id',
                          item.nationalId,
                        )}`,
                      ),
                  }}
                />
              )
            })}
          </Stack>
        </>
      )}
    </IntroWrapper>
  )
}

export default MedicineDelegation
