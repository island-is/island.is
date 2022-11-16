import { useHistory, useLocation } from 'react-router-dom'
import format from 'date-fns/format'
import { VisuallyHidden } from 'reakit/VisuallyHidden'

import {
  Box,
  Text,
  Stack,
  Tag,
  Inline,
  Icon,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useMemo } from 'react'
import { m } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'

const isDateExpired = (date: string) => new Date(date) < new Date()

interface AccessCardProps {
  delegation: AuthCustomDelegation
  onDelete(delegation: AuthCustomDelegation): void
}

export const AccessCard = ({ delegation, onDelete }: AccessCardProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const { pathname } = useLocation()

  const tags = sortBy(
    delegation.scopes.map((scope) => ({
      name: scope?.apiScope?.displayName || scope.displayName,
      isExpired: isDateExpired(scope.validTo),
    })),
    'name',
  )
  const href = `${pathname}/${delegation.id}`

  const isExpired = useMemo(() => {
    if (delegation.validTo) {
      return isDateExpired(delegation.validTo)
    }

    return delegation.scopes.every((scope) => isDateExpired(scope.validTo))
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

  return (
    <Box
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border={isExpired ? 'disabled' : 'standard'}
      borderRadius="large"
    >
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart">
        <Stack space="smallGutter">
          <Box display="flex" columnGap={1} alignItems="center">
            <VisuallyHidden>
              {formatMessage(
                formatMessage({
                  id: 'sp.access-control-delegations:delegation-in-system',
                  defaultMessage: 'Umboð í kerfi',
                }),
              )}
            </VisuallyHidden>
            {delegation.domain.organisationLogoUrl && (
              <img
                src={delegation.domain.organisationLogoUrl}
                width="16"
                aria-hidden
              />
            )}
            <Text variant="eyebrow" color="purple400">
              {delegation.domain.displayName}
            </Text>
          </Box>
          <VisuallyHidden>
            {formatMessage(
              formatMessage({
                id: 'sp.access-control-delegations:access-holder',
                defaultMessage: 'Aðgangshafi',
              }),
            )}
          </VisuallyHidden>
          <Text variant="h3" as="h2" color={isExpired ? 'dark300' : 'dark400'}>
            {delegation?.to?.name}
          </Text>
        </Stack>
        <Inline space="smallGutter">
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
        </Inline>
      </Box>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent={'spaceBetween'}
          alignItems={['stretch', 'flexEnd']}
          flexDirection={['column', 'row']}
          width="full"
        >
          <Box width="full">
            <VisuallyHidden>
              {formatMessage(
                formatMessage({
                  id: 'sp.access-control-delegations:access-title',
                  defaultMessage: 'Réttindi',
                }),
              )}
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent={['spaceBetween', 'flexEnd']}
            marginTop={[2, 0]}
            marginLeft={[0, 3]}
          >
            <Button
              variant="text"
              icon="trash"
              iconType="outline"
              size="small"
              colorScheme="destructive"
              onClick={() => onDelete(delegation)}
              nowrap
            >
              {formatMessage(m.buttonDestroy)}
            </Button>
            <Box marginLeft={3}>
              {!isExpired ? (
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
        </Box>
      </Box>
    </Box>
  )
}
