import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
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
import { permitTagSelector } from '../../utils/tagSelector'

const MedicineDelegation = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [showExpiredPermits, setShowExpiredPermits] = useState(false)

  const { data, loading, error } = useGetMedicineDelegationsQuery({
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
  const dataLength =
    data?.healthDirectorateMedicineDelegations?.items?.length ?? 0

  const filteredData =
    data?.healthDirectorateMedicineDelegations?.items?.filter((item) =>
      showExpiredPermits
        ? item.status
        : item.status === HealthDirectoratePermitStatus.active ||
          item.status === HealthDirectoratePermitStatus.awaitingApproval,
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
      {!loading && !error && dataLength === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noPermit)}
          message={formatMessage(messages.noPermitsRegistered)}
          imgSrc="./assets/images/empty_flower.svg"
        />
      )}
      {!loading && error && <Problem error={error} noBorder={false} />}
      {loading && !error && (
        <Box marginY={3}>
          <ActionCardLoader repeat={3} />
        </Box>
      )}
      {!loading && !error && dataLength > 0 && (
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
                  backgroundColor={
                    item.status ===
                    HealthDirectoratePermitStatus.awaitingApproval
                      ? 'blue'
                      : 'white'
                  }
                  subText={
                    item.dates?.to
                      ? formatMessage(messages.medicineValidTo) +
                        ' ' +
                        formatDate(item.dates.to)
                      : undefined
                  }
                  tag={permitTagSelector(item.status, formatMessage)}
                  cta={{
                    size: 'small',
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
