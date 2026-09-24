import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
import { ActionCard, Box, Button, Stack, Tabs } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActionCardLoader,
  STAFRAEN_HEILSA_SLUG,
  IntroWrapper,
  LinkButton,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  GetMedicineDelegationsQuery,
  useGetMedicineDelegationsQuery,
} from './MedicineDelegation.generated'
import { permitTagSelector } from '../../utils/tagSelector'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

type Delegation = NonNullable<
  NonNullable<
    GetMedicineDelegationsQuery['healthDirectorateMedicineDelegations']
  >['items']
>[number]

const MedicineDelegation = () => {
  const { formatMessage, lang } = useLocale()
  useHealthPlausibleSwap()
  const navigate = useNavigate()

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
  const delegations = data?.healthDirectorateMedicineDelegations?.items ?? []
  const dataLength = delegations.length

  const isValid = (item: Delegation) =>
    item.status === HealthDirectoratePermitStatus.active ||
    item.status === HealthDirectoratePermitStatus.awaitingApproval

  const validDelegations = delegations.filter(isValid)
  const expiredDelegations = delegations.filter((item) => !isValid(item))

  const renderDelegationList = (items: Delegation[], emptyState: ReactNode) => {
    if (items.length === 0) {
      return emptyState
    }
    return (
      <Stack space={2}>
        {items.map((item) => (
          <ActionCard
            key={item.cacheId}
            heading={item.name ?? ''}
            headingVariant="h4"
            text={formatMessage(messages.permitTo, {
              arg: item.lookup
                ? formatMessage(messages.pickupMedicineAndLookup)
                : formatMessage(messages.pickupMedicine),
            })}
            backgroundColor={
              item.status === HealthDirectoratePermitStatus.awaitingApproval
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
        ))}
      </Stack>
    )
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(
          messages.stafraenHeilsaMedicineDelegationTooltip,
        ),
      }}
      loading={loading}
      buttonGroup={{
        actions: [
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
        ],
      }}
      desktopContentSpan="10/12"
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
        <Tabs
          label={formatMessage(messages.medicineDelegation)}
          selected="valid"
          size="xs"
          contentBackground="transparent"
          onlyRenderSelectedTab
          tabs={[
            {
              id: 'valid',
              label: formatMessage(messages.valid),
              content: (
                <Box paddingTop={3}>
                  {renderDelegationList(
                    validDelegations,
                    <Problem
                      type="no_data"
                      noBorder={false}
                      title={formatMessage(messages.noData)}
                      message={formatMessage(
                        messages.noActivePermitsRegistered,
                      )}
                      imgSrc="./assets/images/empty_flower.svg"
                      imgAlt=""
                    />,
                  )}
                </Box>
              ),
            },
            {
              id: 'expired',
              label: formatMessage(messages.expiredPermits),
              content: (
                <Box paddingTop={3}>
                  {renderDelegationList(
                    expiredDelegations,
                    <Problem
                      type="no_data"
                      noBorder={false}
                      title={formatMessage(messages.noData)}
                      message={formatMessage(
                        messages.noExpiredPermitsRegistered,
                      )}
                      imgSrc="./assets/images/empty_flower.svg"
                      imgAlt=""
                    />,
                  )}
                </Box>
              ),
            },
          ]}
        />
      )}
    </IntroWrapper>
  )
}

export default MedicineDelegation
