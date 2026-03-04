import { useContext as useReactContext } from 'react'
import { AuthApiScope } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DatePicker,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/core'
import format from 'date-fns/format'
import {
  DelegationFormContext,
  type ScopeSelection,
} from '../../context/DelegationFormContext'
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
  scopes?: Scope[]

  showCheckbox?: boolean
  onSelectScope?: (scope: AuthApiScope) => void
  selectedScopes?: AuthApiScope[]

  showDate?: boolean
  editableDates?: boolean
}

export const ScopesTable = ({
  scopes: scopesProp,
  showCheckbox,
  onSelectScope,
  selectedScopes,
  showDate,
  editableDates = true,
}: ScopesTableProps) => {
  const { formatMessage } = useLocale()

  const delegationForm = useReactContext(DelegationFormContext)
  const scopes = scopesProp ?? delegationForm?.selectedScopes ?? []

  const onChangeScopeDate = (scope: ScopeSelection, date: Date) => {
    delegationForm?.setSelectedScopes(
      delegationForm.selectedScopes.map((s) =>
        s.name === scope.name ? { ...s, validTo: date } : s,
      ),
    )
  }

  const headers: string[] = [
    ...(showCheckbox ? [''] : []),
    formatMessage(m.headerName),
    formatMessage(m.headerScopeName),
    formatMessage(m.headerDescription),
    ...(showDate ? [formatMessage(m.headerValidityPeriod)] : []),
    formatMessage(m.headerDelegationType),
  ]

  return (
    <T.Table style={showDate ? { overflow: 'visible' } : undefined}>
      <T.Head>
        <T.Row>
          {headers.map((item) => (
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
          const permissionType = scope.name.includes(':write')
            ? formatMessage(m.readAndWrite)
            : formatMessage(m.read)

          return (
            <T.Row key={scope.name}>
              {showCheckbox && (
                <T.Data style={{ paddingLeft: 16, paddingRight: 0 }}>
                  <Checkbox
                    checked={selectedScopes?.some((s) => s.name === scope.name)}
                    onChange={() => onSelectScope?.(scope as AuthApiScope)}
                  />
                </T.Data>
              )}
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
              {showDate && (
                <T.Data style={{ paddingInline: 16 }}>
                  {editableDates ? (
                    <DatePicker
                      id="validityPeriod"
                      size="sm"
                      backgroundColor="blue"
                      minDate={new Date()}
                      selected={(scope as ScopeSelection).validTo}
                      handleChange={(date) =>
                        onChangeScopeDate(scope as ScopeSelection, date)
                      }
                      placeholderText={formatMessage(coreMessages.chooseDate)}
                      detatchedCalendar={true}
                    />
                  ) : (
                    <Text variant="medium">
                      {(() => {
                        const validTo = (scope as ScopeSelection).validTo
                        return validTo
                          ? format(new Date(validTo), 'dd.MM.yyyy')
                          : '-'
                      })()}
                    </Text>
                  )}
                </T.Data>
              )}
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
