import {
  Box,
  Button,
  DatePicker,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as portalMessages } from '@island.is/portals/core'
import {
  useDelegationForm,
  type ScopeSelection,
} from '../../context/DelegationFormContext'

import { m } from '../../lib/messages'
import { m as coreMessages } from '@island.is/portals/core'

export const EditScopesTable = () => {
  const { formatMessage } = useLocale()

  const { selectedScopes, setSelectedScopes } = useDelegationForm()

  const onChangeScopeDate = (scope: ScopeSelection, date: Date) => {
    setSelectedScopes(
      selectedScopes.map((s) =>
        s.name === scope.name ? { ...s, validTo: date } : s,
      ),
    )
  }

  const onDeleteScope = (scope: ScopeSelection) => {
    setSelectedScopes(selectedScopes.filter((s) => s.name !== scope.name))
  }
  const headerArray = [
    formatMessage(m.headerName),
    formatMessage(m.headerScopeName),
    formatMessage(m.headerDescription),
    formatMessage(m.headerDelegationType),
    formatMessage(m.headerValidityPeriod),
    '',
  ]

  return (
    <T.Table style={{ overflow: 'visible' }}>
      <T.Head>
        <T.Row>
          {headerArray.map((item) => (
            <T.HeadData style={{ paddingInline: 16 }} key={item}>
              <Text variant="medium" fontWeight="semiBold">
                {item}
              </Text>
            </T.HeadData>
          ))}
        </T.Row>
      </T.Head>
      <T.Body>
        {selectedScopes.map((scope) => {
          // Determine permission type based on scope name
          const permissionType = scope.name.includes(':write')
            ? formatMessage(m.readAndWrite)
            : formatMessage(m.read)

          return (
            <T.Row key={scope.name}>
              <T.Data style={{ paddingInline: 16 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flexStart"
                  columnGap={3}
                >
                  {scope.domain?.organisationLogoUrl && (
                    <img
                      src={scope.domain.organisationLogoUrl}
                      width="24"
                      alt=""
                      aria-hidden
                    />
                  )}
                  <Text variant="medium">
                    {scope.domain?.displayName || scope.domain?.name || '-'}
                  </Text>
                </Box>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{scope.displayName}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{scope.description || '-'}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{permissionType}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <DatePicker
                  id="validityPeriod"
                  size="sm"
                  backgroundColor="blue"
                  minDate={new Date()}
                  selected={scope.validTo}
                  handleChange={(date) => onChangeScopeDate(scope, date)}
                  placeholderText={formatMessage(portalMessages.chooseDate)}
                />
              </T.Data>
              <T.Data style={{ paddingInline: 16, minWidth: 85 }}>
                <Button
                  variant="text"
                  icon="trash"
                  iconType="outline"
                  size="small"
                  colorScheme="destructive"
                  onClick={() => onDeleteScope(scope)}
                >
                  {formatMessage(coreMessages.buttonDestroy)}
                </Button>
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
