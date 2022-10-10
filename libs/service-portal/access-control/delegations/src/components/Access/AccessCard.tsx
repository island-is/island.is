import { useHistory, useLocation } from 'react-router-dom'
import format from 'date-fns/format'

import {
  Box,
  Text,
  Stack,
  Tag,
  Inline,
  Icon,
  Button,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { AuthCustomDelegation } from '@island.is/api/schema'

interface AccessCardProps {
  delegation: AuthCustomDelegation
  group: string
  /**
   * Whether the card is editable or not, i.e. user can view/edit/renew delegation or only renew
   */
  editable?: boolean
  onDelete(delegation: AuthCustomDelegation): void
}

export const AccessCard = ({
  delegation,
  group,
  editable = true,
  onDelete,
}: AccessCardProps) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const history = useHistory()
  const { pathname } = useLocation()
  const tags = delegation.scopes.map((scope) => scope.displayName)
  const href = `${pathname}/${delegation.id}`

  return (
    <Box
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border={editable ? 'standard' : 'disabled'}
      borderRadius="large"
    >
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart">
        <Stack space="smallGutter">
          <Text variant="eyebrow" color="purple400">
            {group}
          </Text>
          <Text variant="h3" as="h3" color={editable ? 'dark400' : 'dark300'}>
            {delegation?.to?.name}
          </Text>
        </Stack>
        <Inline space="smallGutter">
          <Icon
            size="small"
            icon="time"
            color={editable ? 'blue400' : 'dark300'}
            type="outline"
          />
          <Text variant="small" color={editable ? 'dark400' : 'dark300'}>
            {delegation.validTo
              ? format(new Date(delegation.validTo), 'dd.MM.yyyy')
              : formatMessage({
                  id: 'sp.settings-access-control:home-view-varies',
                  defaultMessage: 'Breytilegur',
                })}
          </Text>
        </Inline>
      </Box>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection={['column', 'row']}
          width="full"
        >
          <Inline alignY="bottom" space={1}>
            {tags.map((tag, index) => (
              <Tag
                disabled
                key={index}
                variant={editable ? 'blue' : 'disabled'}
              >
                {tag}
              </Tag>
            ))}
          </Inline>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={['spaceBetween', 'flexEnd']}
            width="full"
            marginTop={[2, 0]}
          >
            <Button
              variant="text"
              icon="trash"
              iconType="outline"
              size="small"
              colorScheme="destructive"
              onClick={() => onDelete(delegation)}
            >
              {formatMessage(coreMessages.buttonDestroy)}
            </Button>
            <Box marginLeft={3}>
              {editable ? (
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
                  onClick={() => {
                    // TODO handle delegation renewal
                    console.log('TODO handle delegation renewal')
                  }}
                >
                  {formatMessage(coreMessages.buttonRenew)}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
