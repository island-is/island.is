import { DatePicker, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as portalMessages } from '@island.is/portals/core'
import {
  useDelegationForm,
  type ScopeSelection,
} from '../../context/DelegationFormContext'

const headerArray = [
  'Nafn',
  'Heiti Umboðs',
  'Lýsing á umboði',
  'Tegund',
  'Gildistími',
]

export const DatePickerScopesTable = () => {
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
              <T.Data style={{ paddingInline: 16 }}>
                <DatePicker
                  id="validityPeriod"
                  size="sm"
                  label={formatMessage(portalMessages.date)}
                  backgroundColor="blue"
                  minDate={new Date()}
                  selected={scope.validTo}
                  handleChange={(date) => onChangeScopeDate(scope, date)}
                  placeholderText={formatMessage(portalMessages.chooseDate)}
                />
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
