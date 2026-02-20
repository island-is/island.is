import { AuthApiScope } from '@island.is/api/schema'
import { Box, Checkbox, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

type Scope = {
  __typename?: 'AuthApiScope'
  name: string
  displayName: string
  description?: string | null
  domain?: {
    __typename?: 'AuthDomain'
    name: string
    displayName: string
    organisationLogoUrl?: string | null
  } | null
}

type ScopesTableProps = {
  scopes: Scope[]
  onSelectScope?: (scope: AuthApiScope) => void
  selectedScopes?: AuthApiScope[]
}

export const ScopesTable = ({
  scopes,
  onSelectScope,
  selectedScopes,
}: ScopesTableProps) => {
  const { formatMessage } = useLocale()
  const headerArray = [
    '',
    formatMessage(m.headerName),
    formatMessage(m.headerScopeName),
    formatMessage(m.headerDescription),
    formatMessage(m.headerDelegationType),
  ]
  return (
    <T.Table>
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
        {scopes.map((scope) => {
          // Determine permission type based on scope name
          const permissionType = scope.name.includes(':write')
            ? formatMessage(m.readAndWrite)
            : formatMessage(m.read)

          return (
            <T.Row key={scope.name}>
              <T.Data style={{ paddingLeft: 16, paddingRight: 0 }}>
                <Checkbox
                  checked={selectedScopes?.some((s) => s.name === scope.name)}
                  onChange={() => onSelectScope?.(scope as AuthApiScope)}
                />
              </T.Data>
              <T.Data
                style={{
                  paddingInline: 16,
                }}
              >
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
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
