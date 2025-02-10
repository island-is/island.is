import format from 'date-fns/format'
import { VisuallyHidden } from 'reakit/VisuallyHidden'
import * as kennitala from 'kennitala'

import {
  Box,
  Button,
  Icon,
  IconMapIcon as IconType,
  Inline,
  Stack,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import { m as coreMessages } from '@island.is/portals/core'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import startOfDay from 'date-fns/startOfDay'
import { m } from '../../lib/messages'
import { AuthApiScope, AuthDelegationType } from '@island.is/api/schema'
import {
  AuthCustomDelegationIncoming,
  AuthCustomDelegationOutgoing,
} from '../../types/customDelegation'
import { AuthCustomDelegation } from '@island.is/api/schema'

const isDateExpired = (date?: string | null) =>
  date && new Date(date) < startOfDay(new Date())

const getTagName = (apiScope: AuthApiScope) =>
  apiScope?.group?.displayName ?? apiScope.displayName

const getTags = (delegation: AuthCustomDelegation) =>
  sortBy(
    uniqBy(
      delegation.scopes?.map((scope) => ({
        name: scope?.apiScope
          ? getTagName(scope?.apiScope as AuthApiScope)
          : scope.displayName,
        isExpired: isDateExpired(scope.validTo),
      })),
      'name',
    ),
    'name',
  )

interface AccessCardProps {
  delegation: AuthCustomDelegation

  onDelete?: (delegation: AuthCustomDelegation) => void
  onEdit?: (delegation: AuthCustomDelegation) => void
  onView?: (delegation: AuthCustomDelegation) => void
  onRenew?: (delegation: AuthCustomDelegation) => void

  variant?: 'outgoing' | 'incoming'

  isAdminView?: boolean
}

export const AccessCard = ({
  delegation,
  onDelete,
  onView,
  onEdit,
  onRenew,
  variant = 'outgoing',
  isAdminView = false,
}: AccessCardProps) => {
  const { formatMessage } = useLocale()
  const tags = useMemo(() => getTags(delegation), [delegation])

  const hasTags = tags.length > 0
  const isOutgoing = variant === 'outgoing'

  const isExpired = useMemo(() => {
    if (
      delegation.validTo ||
      delegation.type === AuthDelegationType.GeneralMandate
    ) {
      return isDateExpired(delegation.validTo)
    }

    return delegation.scopes?.every((scope) => isDateExpired(scope.validTo))
  }, [delegation])

  const getRightLabel = () => {
    if (isExpired) {
      return formatMessage(m.expired)
    }

    return delegation.validTo
      ? format(new Date(delegation.validTo), 'dd.MM.yyyy')
      : formatMessage(m.variableValidity)
  }

  const renderDelegationTypeLabel = (type: AuthDelegationType) => {
    // Default to custom delegation type
    let label = ''
    let icon: IconType = 'people'

    switch (type) {
      case AuthDelegationType.GeneralMandate:
        label = formatMessage(m.delegationTypeGeneralMandate)
        break
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

        if (
          kennitala.isCompany(
            (delegation as AuthCustomDelegationIncoming)?.from?.nationalId,
          )
        ) {
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

  const hasActions = onView || onEdit || onDelete
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
            {(isAdminView ||
              !isOutgoing ||
              delegation.type === AuthDelegationType.GeneralMandate) && (
              <>
                {renderDelegationTypeLabel(delegation.type)}
                {delegation.domain?.name && (
                  <Text variant="eyebrow" color="blue300">
                    {'|'}
                  </Text>
                )}
              </>
            )}
            {delegation.domain && (
              <Box display="flex" columnGap={1} alignItems="center">
                <VisuallyHidden>
                  {formatMessage(m.delegationInSystem)}
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
          <VisuallyHidden>{formatMessage(m.accessHolder)}</VisuallyHidden>
          <Text variant="h3" as="h2" color={isExpired ? 'dark300' : 'dark400'}>
            {isOutgoing
              ? (delegation as AuthCustomDelegationOutgoing)?.to?.name
              : (delegation as AuthCustomDelegationIncoming)?.from?.name}
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
                title={formatMessage(m.validityPeriod)}
              />
              <Text variant="small" color={isExpired ? 'dark300' : 'dark400'}>
                {getRightLabel()}
              </Text>
            </>
          )}
        </Inline>
      </Box>
      <Box marginTop={hasTags && hasActions ? 2 : 0}>
        <Box
          display="flex"
          justifyContent={hasTags ? 'spaceBetween' : 'flexEnd'}
          alignItems={['stretch', 'flexEnd']}
          flexDirection={['column', 'row']}
          width="full"
        >
          {hasTags && (
            <Box width="full">
              <VisuallyHidden>{formatMessage(m.accessScopes)}</VisuallyHidden>
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
          {hasActions && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={['spaceBetween', 'flexEnd']}
              marginTop={[2, 0]}
              marginLeft={[0, 3]}
            >
              {onDelete && (
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
                {onView && (
                  <Button
                    size="small"
                    variant="utility"
                    onClick={() => onView(delegation)}
                  >
                    {formatMessage(coreMessages.view)}
                  </Button>
                )}
                {!isExpired && onEdit ? (
                  <Button
                    icon="pencil"
                    iconType="outline"
                    size="small"
                    variant="utility"
                    onClick={() => onEdit(delegation)}
                  >
                    {formatMessage(coreMessages.buttonEdit)}
                  </Button>
                ) : (
                  isExpired &&
                  onRenew && (
                    <Button
                      icon="reload"
                      iconType="outline"
                      size="small"
                      variant="utility"
                      onClick={() => onRenew(delegation)}
                    >
                      {formatMessage(coreMessages.buttonRenew)}
                    </Button>
                  )
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
