import React from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  GridContainer,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { NATIONAL_REGISTRY_CHILDREN } from '../../lib/queries/getNationalChildren'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const FamilyMember: ServicePortalModuleComponent = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error, called } = useQuery<Query>(
    NATIONAL_REGISTRY_CHILDREN,
  )
  const { nationalRegistryChildren } = data || {}

  const { nationalId }: { nationalId: string | undefined } = useParams()

  const person =
    nationalRegistryChildren?.find((x) => x.nationalId === nationalId) || null

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {person?.fullName || ''}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage(m.fullName)}
          content={person?.fullName || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.displayName)}
          content={person?.displayName || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.gender)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.genderDisplay || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.family:birthplace',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.birthplace || ''
          }
          loading={loading}
        />
        <Divider />
        {person?.fate && (
          <>
            <UserInfoLine
              label={formatMessage({
                id: 'sp.family:fate',
                defaultMessage: 'Afdrif',
              })}
              content={
                error ? formatMessage(dataNotFoundMessage) : person?.fate || ''
              }
              loading={loading}
            />
            <Divider />
          </>
        )}
        <Box marginTop={5}>
          <Box paddingBottom={4}>
            <Text variant="eyebrow">
              {formatMessage({
                id: 'sp.family:parents-custody',
                defaultMessage: 'Forsjá & foreldrar',
              })}
            </Text>
            {error ? (
              formatMessage(dataNotFoundMessage)
            ) : (
              <>
                <UserInfoLine
                  label={formatMessage({
                    id: 'sp.family:parents',
                    defaultMessage: 'Foreldrar',
                  })}
                  valueColumnSpan={['1/1', '8/12']}
                  renderContent={() => (
                    <GridContainer>
                      <GridRow>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.nameParent1 ? (
                            <Text variant="default">{person?.nameParent1}</Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.nameParent2 ? (
                            <Text variant="default">{person?.nameParent2}</Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  )}
                  loading={loading}
                />
                <UserInfoLine
                  label={defineMessage(m.natreg)}
                  valueColumnSpan={['1/1', '8/12']}
                  paddingY={0}
                  renderContent={() => (
                    <GridContainer>
                      <GridRow>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.parent1 ? (
                            <Text variant="default">
                              {formatNationalId(person?.parent1)}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.parent2 ? (
                            <Text variant="default">
                              {formatNationalId(person?.parent2)}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  )}
                  loading={loading}
                />
              </>
            )}
          </Box>
          <Divider />

          {!person?.fate && !error ? (
            <>
              <Box paddingTop={2} paddingBottom={4}>
                <UserInfoLine
                  label={formatMessage({
                    id: 'sp.family:custody',
                    defaultMessage: 'Forsjáraðilar',
                  })}
                  valueColumnSpan={['1/1', '8/12']}
                  renderContent={() => (
                    <GridContainer>
                      <GridRow>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.nameCustody1 ? (
                            <Text variant="default">
                              {person?.nameCustody1}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.nameCustody2 ? (
                            <Text variant="default">
                              {person?.nameCustody2}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  )}
                  loading={loading}
                />
                <UserInfoLine
                  label={defineMessage(m.natreg)}
                  valueColumnSpan={['1/1', '8/12']}
                  paddingY={0}
                  paddingBottom={2}
                  renderContent={() => (
                    <GridContainer>
                      <GridRow>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.custody1 ? (
                            <Text variant="default">
                              {formatNationalId(person.custody1)}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.custody2 ? (
                            <Text variant="default">
                              {formatNationalId(person.custody2)}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  )}
                  loading={loading}
                />
                <UserInfoLine
                  label={formatMessage({
                    id: 'sp.family:custody-status',
                    defaultMessage: 'Staða forsjár',
                  })}
                  valueColumnSpan={['1/1', '8/12']}
                  paddingY={0}
                  paddingBottom={2}
                  renderContent={() => (
                    <GridContainer>
                      <GridRow>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.custodyText1 ? (
                            <Text variant="default">
                              {person?.custodyText1}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                        <GridColumn span={['12/12', '6/12']}>
                          {person?.custodyText2 ? (
                            <Text variant="default">
                              {person?.custodyText2}
                            </Text>
                          ) : (
                            ''
                          )}
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  )}
                  loading={loading}
                />
              </Box>
              <Divider />
            </>
          ) : (
            <Divider />
          )}
        </Box>
      </Stack>
    </>
  )
}

export default FamilyMember
