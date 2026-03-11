import { AuthApiScope } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DatePicker,
  Divider,
  Table as T,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/core'
import format from 'date-fns/format'
import {
  useDelegationForm,
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
  showDate?: boolean
  editableDates?: boolean
}

export const ScopesTable = ({
  scopes: scopesProp,
  showCheckbox,
  onSelectScope,
  showDate,
  editableDates = true,
}: ScopesTableProps) => {
  const { formatMessage } = useLocale()
  const { md } = useBreakpoint()

  const { selectedScopes, setSelectedScopes } = useDelegationForm()
  const scopes = scopesProp ?? selectedScopes ?? []

  const onChangeScopeDate = (scope: ScopeSelection, date: Date) => {
    setSelectedScopes(
      selectedScopes.map((s) =>
        s.name === scope.name ? { ...s, validTo: date } : s,
      ),
    )
  }

  if (!md) {
    return (
      <Box display="flex" flexDirection="column">
        {scopes.map((scope, index) => {
          const permissionType = scope.name.includes(':write')
            ? formatMessage(m.readAndWrite)
            : formatMessage(m.read)

          const isChecked = selectedScopes?.some((s) => s.name === scope.name)
          const validTo = (scope as ScopeSelection).validTo

          return (
            <>
              <Box
                key={scope.name + index}
                paddingTop={2}
                paddingBottom={index < scopes.length - 1 ? 2 : 0}
                overflow={showDate ? 'visible' : undefined}
              >
                <Box display="flex">
                  {showCheckbox && (
                    <Checkbox
                      name={`mobile-scope-${scope.name}`}
                      checked={isChecked}
                      onChange={() => onSelectScope?.(scope as AuthApiScope)}
                    />
                  )}
                  <Box
                    display="flex"
                    flexDirection="column"
                    rowGap={2}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <div>
                      <Box
                        display="flex"
                        justifyContent="spaceBetween"
                        alignItems="center"
                        columnGap={2}
                      >
                        <Text variant="h5" fontWeight="semiBold">
                          {scope.displayName}
                        </Text>
                        <Box
                          display="flex"
                          alignItems="center"
                          columnGap={1}
                          flexShrink={0}
                        >
                          {scope.domain?.organisationLogoUrl && (
                            <img
                              src={scope.domain.organisationLogoUrl}
                              width="12"
                              alt=""
                              aria-hidden
                            />
                          )}
                          <Text variant="small">
                            {scope.domain?.displayName ||
                              scope.domain?.name ||
                              '-'}
                          </Text>
                        </Box>
                      </Box>
                      <Text variant="medium">{scope.description || '-'}</Text>
                    </div>

                    <Box
                      display="flex"
                      flexDirection={editableDates ? 'column' : 'row'}
                      rowGap={2}
                    >
                      <Box flexGrow={1}>
                        <Text variant="eyebrow" fontWeight="semiBold">
                          {formatMessage(m.headerPermissionType)}
                        </Text>
                        <Text variant="medium">{permissionType}</Text>
                      </Box>

                      {showDate && (
                        <Box flexGrow={1}>
                          <Text
                            variant="eyebrow"
                            fontWeight="semiBold"
                            color={editableDates ? 'blue400' : undefined}
                          >
                            {formatMessage(m.headerValidityPeriod)}
                          </Text>
                          {editableDates ? (
                            <DatePicker
                              id={`validityPeriod-${scope.name}`}
                              size="sm"
                              backgroundColor="blue"
                              minDate={new Date()}
                              selected={(scope as ScopeSelection).validTo}
                              handleChange={(date) =>
                                onChangeScopeDate(scope as ScopeSelection, date)
                              }
                              placeholderText={formatMessage(
                                coreMessages.chooseDate,
                              )}
                              detatchedCalendar={true}
                            />
                          ) : (
                            <Text variant="medium">
                              {validTo
                                ? format(new Date(validTo), 'dd.MM.yyyy')
                                : '-'}
                            </Text>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {index < scopes.length - 1 && <Divider />}
            </>
          )
        })}
      </Box>
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
    <T.Table
      box={{ overflow: showDate ? 'visible' : undefined, alignSelf: 'stretch' }}
    >
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

          const validTo = (scope as ScopeSelection).validTo

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
                      {validTo ? format(new Date(validTo), 'dd.MM.yyyy') : '-'}
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
