import { Checkbox, Table as T, Text } from '@island.is/island-ui/core'

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
}

const headerArray = [
  '',
  'Nafn',
  'Heiti Umboðs',
  'Lýsing á umboði',
  'Tegund Réttinda',
]

export const ScopesTable = ({ scopes }: ScopesTableProps) => {
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
            ? 'Lesa og skrifa'
            : 'Lesa'

          return (
            <T.Row key={scope.name}>
              <T.Data style={{ paddingInline: 16 }}>
                <Checkbox />
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">
                  {scope.domain?.displayName || scope.domain?.name || '-'}
                </Text>
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
