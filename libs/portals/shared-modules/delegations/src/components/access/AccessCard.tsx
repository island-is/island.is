import { useHistory } from 'react-router-dom'
import format from 'date-fns/format'
import { VisuallyHidden } from 'reakit/VisuallyHidden'
import * as kennitala from 'kennitala'

import {
  Box,
  Text,
  Stack,
  Tag,
  Inline,
  Icon,
  IconMapIcon as IconType,
  Button,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { AuthDelegationType } from '@island.is/service-portal/graphql'
import { useMemo } from 'react'
import { m as coreMessages } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

const isDateExpired = (date: string) => new Date(date) < new Date()

interface AccessCardProps {
  delegation: AuthCustomDelegation
  onDelete(delegation: AuthCustomDelegation): void
  onView?(delegation: AuthCustomDelegation): void
  variant?: 'outgoing' | 'incoming'
}

export const AccessCard = ({
  delegation,
  onDelete,
  onView,
  variant = 'outgoing',
}: AccessCardProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const tags = sortBy(
    delegation.scopes?.map((scope) => ({
      name: scope?.apiScope?.displayName || scope.displayName,
      isExpired: isDateExpired(scope.validTo),
    })),
    'name',
  )
  const hasTags = tags.length > 0
  const isOutgoing = variant === 'outgoing'
  const href = `${DelegationPaths.Delegations}/${delegation.id}`

  const isExpired = useMemo(() => {
    if (delegation.validTo) {
      return isDateExpired(delegation.validTo)
    }

    return delegation.scopes?.every((scope) => isDateExpired(scope.validTo))
  }, [delegation])

  const getRightLabel = () => {
    if (isExpired) {
      return formatMessage({
        id: 'sp.access-control-delegations:expired',
        defaultMessage: 'Útrunnið',
      })
    }

    return delegation.validTo
      ? format(new Date(delegation.validTo), 'dd.MM.yyyy')
      : formatMessage({
          id: 'sp.settings-access-control:home-view-varies',
          defaultMessage: 'Breytilegur',
        })
  }

  const renderDelegationTypeLabel = (type: AuthDelegationType) => {
    // Default to custom delegation type
    let label = ''
    let icon: IconType = 'people'

    switch (type) {
      case AuthDelegationType.LegalGuardian:
        label = formatMessage(m.delegationTypeLegalGuardian)
        break

      case AuthDelegationType.PersonalRepresentative:
        label = formatMessage(m.delegationTypePersonalRepresentative)
        break

      case AuthDelegationType.ProcurationHolder:
        label = formatMessage(m.delegationTypeProcurationHolder)
        icon = 'business'
        break

      default:
        label = formatMessage(m.delegationTypeCustom)

        if (kennitala.isCompany(delegation.from.nationalId)) {
          icon = 'business'
        }
    }

    return (
      <Box display="flex" columnGap={1} alignItems="center">
        <Icon icon={icon} color="blue400" size="small" type="outline" />
        <Text variant="eyebrow" color="blue400">
          {label}
        </Text>
      </Box>
    )
  }

  const renderInfo = (type: AuthDelegationType) => {
    // Default to custom delegation type
    let text = formatMessage(m.delegationTypeCustomDesc)

    switch (type) {
      case AuthDelegationType.LegalGuardian:
        text = formatMessage(m.delegationTypeLegalGuardianDesc)
        break

      case AuthDelegationType.PersonalRepresentative:
        text = formatMessage(m.delegationTypePersonalRepresentativeDesc)
        break

      case AuthDelegationType.ProcurationHolder:
        text = formatMessage(m.delegationTypeProcurationHolderDesc)
        break
    }

    return <Tooltip placement="bottom" as="button" text={text} />
  }

  const showActions =
    isOutgoing || delegation.type === AuthDelegationType.Custom

  const canDelete =
    isOutgoing || (!isOutgoing && delegation.type === AuthDelegationType.Custom)

  return (
    <Box
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border={isExpired ? 'disabled' : 'standard'}
      borderRadius="large"
      data-testid="access-card"
    >
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart">
        <Stack space="smallGutter">
          <Box display="flex" columnGap={2} alignItems="center">
            {!isOutgoing && (
              <>
                {renderDelegationTypeLabel(delegation.type)}
                {delegation.domain && (
                  <Text variant="eyebrow" color="blue300">
                    {'|'}
                  </Text>
                )}
              </>
            )}
            {delegation.domain && (
              <Box display="flex" columnGap={1} alignItems="center">
                <VisuallyHidden>
                  {formatMessage({
                    id: 'sp.access-control-delegations:delegation-in-system',
                    defaultMessage: 'Umboð í kerfi',
                  })}
                </VisuallyHidden>
                {delegation.domain.organisationLogoUrl && (
                  <img
                    src={delegation.domain.organisationLogoUrl}
                    width="16"
                    alt=""
                    aria-hidden
                  />
                )}
                <Text variant="eyebrow" color="purple400">
                  {delegation.domain?.displayName}
                </Text>
              </Box>
            )}
          </Box>
          <VisuallyHidden>
            {formatMessage({
              id: 'sp.access-control-delegations:access-holder',
              defaultMessage: 'Aðgangshafi',
            })}
          </VisuallyHidden>
          <Text variant="h3" as="h2" color={isExpired ? 'dark300' : 'dark400'}>
            {isOutgoing ? delegation?.to?.name : delegation?.from?.name}
          </Text>
        </Stack>
        <Inline space="smallGutter">
          {!isOutgoing ? (
            renderInfo(delegation.type)
          ) : (
            <>
              <Icon
                size="small"
                icon="time"
                color={isExpired ? 'dark300' : 'blue400'}
                type="outline"
                title={formatMessage({
                  id: 'sp.access-control-delegations:validity-period',
                  defaultMessage: 'Gildistími',
                })}
              />
              <Text variant="small" color={isExpired ? 'dark300' : 'dark400'}>
                {getRightLabel()}
              </Text>
            </>
          )}
        </Inline>
      </Box>
      <Box marginTop={hasTags && showActions ? 2 : 0}>
        <Box
          display="flex"
          justifyContent={'spaceBetween'}
          alignItems={['stretch', 'flexEnd']}
          flexDirection={['column', 'row']}
          width="full"
        >
          {hasTags && (
            <Box width="full">
              <VisuallyHidden>
                {formatMessage({
                  id: 'sp.access-control-delegations:access-title',
                  defaultMessage: 'Réttindi',
                })}
              </VisuallyHidden>
              <Inline alignY="bottom" space={1}>
                {tags.map((tag, index) => (
                  <Tag
                    disabled
                    key={index}
                    variant={tag.isExpired ? 'disabled' : 'blue'}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </Inline>
            </Box>
          )}
          {showActions && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={['spaceBetween', 'flexEnd']}
              marginTop={[2, 0]}
              marginLeft={[0, 3]}
            >
              {canDelete && (
                <Button
                  variant="text"
                  icon="trash"
                  iconType="outline"
                  size="small"
                  colorScheme="destructive"
                  onClick={() => onDelete(delegation)}
                  nowrap
                >
                  {formatMessage(coreMessages.buttonDestroy)}
                </Button>
              )}
              <Box marginLeft={3}>
                {!isOutgoing && onView ? (
                  <Button
                    size="small"
                    variant="utility"
                    onClick={() => onView(delegation)}
                  >
                    {formatMessage(coreMessages.view)}
                  </Button>
                ) : !isExpired ? (
                  <Button
                    icon="pencil"
                    iconType="outline"
                    size="small"
                    variant="utility"
                    onClick={() => history.push(href)}
                  >
                    {formatMessage(coreMessages.buttonEdit)}
                  </Button>
                ) : (
                  <Button
                    icon="reload"
                    iconType="outline"
                    size="small"
                    variant="utility"
                    onClick={() => history.push(href)}
                  >
                    {formatMessage(coreMessages.buttonRenew)}
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
