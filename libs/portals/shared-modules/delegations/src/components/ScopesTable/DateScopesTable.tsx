import { Box, DatePicker, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as portalMessages } from '@island.is/portals/core'
import {
  useDelegationForm,
  type ScopeSelection,
} from '../../context/DelegationFormContext'
import format from 'date-fns/format'

const headerArray = [
  'Nafn',
  'Heiti Umboðs',
  'Lýsing á umboði',
  'Tegund',
  'Gildistími',
]

export const DateScopesTable = ({
  editableDates = true,
}: {
  editableDates?: boolean
}) => {
  const { formatMessage } = useLocale()

  const { selectedScopes, setSelectedScopes } = useDelegationForm()

  const onChangeScopeDate = (scope: ScopeSelection, date: Date) => {
    setSelectedScopes(
      selectedScopes.map((s) =>
        s.name === scope.name ? { ...s, validTo: date } : s,
      ),
    )
  }

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
            ? 'Lesa og skrifa'
            : 'Lesa'

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
                {editableDates ? (
                  <DatePicker
                    id="validityPeriod"
                    size="sm"
                    backgroundColor="blue"
                    minDate={new Date()}
                    selected={scope.validTo}
                    handleChange={(date) => onChangeScopeDate(scope, date)}
                    placeholderText={formatMessage(portalMessages.chooseDate)}
                  />
                ) : (
                  <Text variant="medium">
                    {scope.validTo
                      ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                      : '-'}
                  </Text>
                )}
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
