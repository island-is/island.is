import { useHistory } from 'react-router-dom'
import format from 'date-fns/format'

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
import { coreMessages } from '@island.is/application/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { AuthDelegationType } from '@island.is/service-portal/graphql'
import { useMemo } from 'react'
import { m, ServicePortalPath } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'

const isDateExpired = (date: string) => new Date(date) < new Date()

interface AccessCardProps {
  delegation: AuthCustomDelegation
  onDelete(delegation: AuthCustomDelegation): void
  variant?: 'outgoing' | 'incoming'
}

export const AccessCard = ({
  delegation,
  onDelete,
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
  const href = isOutgoing
    ? `${ServicePortalPath.AccessControlDelegations}/${delegation.id}`
    : `${ServicePortalPath.AccessControlDelegationsIncoming}/${delegation.id}`

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
    let label = formatMessage(m.delegationTypeCustom)
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
    let text = formatMessage(m.delegationTypeCustom)

    switch (type) {
      case AuthDelegationType.LegalGuardian:
        text = formatMessage(m.delegationTypeLegalGuardian)
        break

      case AuthDelegationType.PersonalRepresentative:
        text = formatMessage(m.delegationTypePersonalRepresentative)
        break

      case AuthDelegationType.ProcurationHolder:
        text = formatMessage(m.delegationTypeProcurationHolder)
        break
    }
    return <Tooltip placement="bottom" as="button" text={text} />
  }

  const showActions =
    isOutgoing ||
    delegation.type === AuthDelegationType.Custom ||
    delegation.type === AuthDelegationType.ProcurationHolder

  return (
    <Box
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border={isExpired ? 'disabled' : 'standard'}
      borderRadius="large"
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems={isOutgoing ? 'flexStart' : 'center'}
      >
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
                {delegation.domain.organisationLogoUrl && (
                  <img
                    src={delegation.domain.organisationLogoUrl}
                    alt={`Mynd af ${delegation.domain.displayName}`}
                    width="16"
                  />
                )}
                <Text variant="eyebrow" color="purple400">
                  {delegation.domain?.displayName}
                </Text>
              </Box>
            )}
          </Box>
          <Text variant="h3" as="h3" color={isExpired ? 'dark300' : 'dark400'}>
            {delegation?.to?.name}
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
          justifyContent="spaceBetween"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection={['column', 'row']}
          width="full"
        >
          {hasTags && (
            <Box width="full">
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
              width="full"
              marginTop={[3, 0]}
            >
              <Button
                variant="text"
                icon="trash"
                iconType="outline"
                size="small"
                colorScheme="destructive"
                onClick={() => onDelete(delegation)}
              >
                {formatMessage(m.buttonDestroy)}
              </Button>
              <Box marginLeft={3}>
                {!isOutgoing ? (
                  <Button
                    size="small"
                    variant="utility"
                    onClick={() => history.push(href)}
                  >
                    {formatMessage(m.view)}
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
                    {formatMessage(m.buttonRenew)}
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
