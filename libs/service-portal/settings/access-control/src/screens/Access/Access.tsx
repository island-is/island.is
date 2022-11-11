import React, { FC, useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { defineMessage } from 'react-intl'

import {
  Box,
  Inline,
  Text,
  Stack,
  Button,
  SkeletonLoader,
  Divider,
  toast,
  GridRow,
  GridColumn,
  Hidden,
  AlertBanner,
} from '@island.is/island-ui/core'
import { Query, Mutation, AuthCustomDelegation } from '@island.is/api/schema'
import {
  formatPlausiblePathToParams,
  IntroHeader,
  m as coreMessages,
  NotFound,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { AuthDelegationsQuery } from '../AccessControl'
import { AccessItem, AccessModal } from '../../components'

import * as styles from './Access.css'
import {
  AccessForm,
  ApiScopeGroup,
  GroupedApiScopes,
  GROUP_PREFIX,
  Scope,
  ScopeTag,
  SCOPE_PREFIX,
} from '../../utils/types'
import { servicePortalSaveAccessControl } from '@island.is/plausible'
import { ISLAND_DOMAIN } from '../../constants'

const AuthApiScopesQuery = gql`
  query AuthApiScopesQuery($input: AuthApiScopesInput!) {
    authApiScopes(input: $input) {
      name
      displayName
      group {
        name
        displayName
        description
      }
      description
    }
  }
`

const AuthDelegationQuery = gql`
  query AuthDelegationQuery($input: AuthDelegationInput!) {
    authDelegation(input: $input) {
      id
      type
      to {
        nationalId
        name
      }
      from {
        nationalId
      }
      ... on AuthCustomDelegation {
        scopes {
          id
          name
          validTo
          displayName
        }
      }
    }
  }
`

const UpdateAuthDelegationMutation = gql`
  mutation UpdateAuthDelegationMutation($input: UpdateAuthDelegationInput!) {
    updateAuthDelegation(input: $input) {
      id
      from {
        nationalId
      }
      ... on AuthCustomDelegation {
        scopes {
          id
          name
          validTo
          displayName
        }
      }
    }
  }
`

const DeleteAuthDelegationMutation = gql`
  mutation DeleteAuthDelegationMutation($input: DeleteAuthDelegationInput!) {
    deleteAuthDelegation(input: $input)
  }
`

const Access: FC = () => {
  useNamespaces('sp.settings-access-control')

  const { formatMessage, lang } = useLocale()
  const { delegationId }: { delegationId: string } = useParams()
  const history = useHistory()
  const [closeModalOpen, setCloseModalOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)

  const onError = () => {
    toast.error(formatMessage(coreMessages.somethingWrong))
  }
  const [updateDelegation, { loading: updateLoading }] = useMutation<Mutation>(
    UpdateAuthDelegationMutation,
    {
      refetchQueries: [
        {
          query: AuthDelegationsQuery,
          variables: {
            input: {
              domain: ISLAND_DOMAIN,
            },
          },
        },
      ],
      onError,
    },
  )
  const [deleteDelegation, { loading: deleteLoading }] = useMutation<Mutation>(
    DeleteAuthDelegationMutation,
    {
      refetchQueries: [
        {
          query: AuthDelegationsQuery,
          variables: {
            input: {
              domain: ISLAND_DOMAIN,
            },
          },
        },
      ],
      onError,
    },
  )
  const { data: apiScopeData, loading: apiScopeLoading } = useQuery<Query>(
    AuthApiScopesQuery,
    {
      variables: {
        input: {
          domain: ISLAND_DOMAIN,
          lang,
        },
      },
    },
  )
  const { data: delegationData, loading: delegationLoading } = useQuery<Query>(
    AuthDelegationQuery,
    {
      fetchPolicy: 'network-only',
      variables: {
        input: {
          delegationId,
        },
      },
    },
  )
  const hookFormData = useForm<AccessForm>()
  const { handleSubmit, getValues } = hookFormData
  const { authApiScopes } = apiScopeData || {}
  const authDelegation = (delegationData || {})
    .authDelegation as AuthCustomDelegation
  const loading = apiScopeLoading || delegationLoading
  const [formError, setFormError] = useState<boolean>(false)

  const onSubmit = handleSubmit(async (model: AccessForm) => {
    formError && setFormError(false)
    const scopes = model[SCOPE_PREFIX].filter(
      (scope) => scope.name?.length > 0,
    ).map((scope) => ({
      ...scope,
      name: scope.name[0],
      displayName: scope.displayName,
    }))

    const err = getValues()?.[SCOPE_PREFIX]?.find(
      (x) => x.name.length > 0 && !x.validTo,
    )

    if (err) {
      setSaveModalOpen(false)
      setFormError(true)
      return
    }

    const { data, errors } = await updateDelegation({
      variables: { input: { delegationId, scopes } },
    })
    if (data && !errors && !err) {
      history.push(ServicePortalPath.SettingsAccessControl)
      servicePortalSaveAccessControl(
        formatPlausiblePathToParams(
          ServicePortalPath.SettingsAccessControlGrant,
        ),
      )
    }
  })

  const onDelete = async () => {
    const { data, errors } = await deleteDelegation({
      variables: { input: { delegationId } },
    })
    if (data && !errors) {
      setCloseModalOpen(false)
      history.push(ServicePortalPath.SettingsAccessControl)
    }
  }

  if (!loading && !delegationData?.authDelegation) {
    return <NotFound />
  }

  const groupedApiScopes: GroupedApiScopes = (authApiScopes || []).reduce(
    (acc, apiScope, index) => {
      const key = apiScope.group
        ? `${GROUP_PREFIX}:${apiScope.group.name}`
        : `${SCOPE_PREFIX}:${apiScope.name}`

      return {
        ...acc,
        [key]: [
          ...(acc[key] || []),
          { ...apiScope, model: `${SCOPE_PREFIX}.${index}` },
        ],
      }
    },
    {} as GroupedApiScopes,
  )

  const scopes = getValues()?.[SCOPE_PREFIX]?.map((item) => {
    if (item.name && item.validTo)
      return {
        displayName: authApiScopes?.find((x) => x.name === item.name[0])
          ?.displayName,
        validTo: item.validTo,
      }
  })

  return (
    <Box>
      <IntroHeader
        title={authDelegation?.to?.name || ''}
        intro={defineMessage({
          id: 'sp.settings-access-control:access-intro',
          defaultMessage:
            'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
        })}
      />
      {formError && (
        <Box paddingBottom={3}>
          <AlertBanner
            description={formatMessage({
              id: 'sp.settings-access-control:date-error',
              defaultMessage:
                'Nauðsynlegt er að velja dagsetningu fyrir hvert umboð',
            })}
            variant="error"
          />
        </Box>
      )}
      <FormProvider {...hookFormData}>
        <form onSubmit={onSubmit}>
          <Box marginBottom={[3, 3, 4]} display="flex" justifyContent="flexEnd">
            <Inline space={1}>
              {authDelegation?.scopes.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    colorScheme="destructive"
                    size="small"
                    icon="close"
                    onClick={() => setCloseModalOpen(true)}
                  >
                    {formatMessage({
                      id: 'sp.settings-access-control:access-remove-delegation',
                      defaultMessage: 'Eyða umboði',
                    })}
                  </Button>

                  <AccessModal
                    id="access-delete-modal"
                    isVisible={closeModalOpen}
                    title={formatMessage({
                      id:
                        'sp.settings-access-control:access-remove-modal-content',
                      defaultMessage:
                        'Ertu viss um að þú viljir eyða þessum aðgangi?',
                    })}
                    text={`${authDelegation?.to?.name} ${formatMessage({
                      id:
                        'sp.settings-access-control:will-loose-access-following',
                      defaultMessage: 'mun missa umboð fyrir eftirfarandi:',
                    })}`}
                    scopes={scopes as ScopeTag[]}
                    onClose={() => setCloseModalOpen(false)}
                    onCloseButtonText={formatMessage({
                      id:
                        'sp.settings-access-control:access-remove-modal-cancel',
                      defaultMessage: 'Hætta við',
                    })}
                    onSubmitColor="red"
                    onSubmit={() => onDelete()}
                    onSubmitButtonText={formatMessage({
                      id:
                        'sp.settings-access-control:access-remove-modal-confirm',
                      defaultMessage: 'Já, ég vil eyða umboði',
                    })}
                  />
                </>
              )}
              <Button
                variant="primary"
                size="small"
                loading={updateLoading}
                onClick={() => setSaveModalOpen(true)}
                icon="checkmark"
              >
                {formatMessage({
                  id: 'sp.settings-access-control:access-save',
                  defaultMessage: 'Vista aðgang',
                })}
              </Button>
              <AccessModal
                id="access-save-modal"
                isVisible={saveModalOpen}
                title={formatMessage({
                  id: 'sp.settings-access-control:access-save-modal-content',
                  defaultMessage: 'Ertu viss um að þú viljir veita umboðið?',
                })}
                //
                text={`${authDelegation?.to?.name} ${formatMessage({
                  id: 'sp.settings-access-control:will-grant-access-following',
                  defaultMessage: 'mun fá umboð fyrir eftirfarandi:',
                })}`}
                scopes={scopes as ScopeTag[]}
                onClose={() => setSaveModalOpen(false)}
                onCloseButtonText={formatMessage({
                  id: 'sp.settings-access-control:access-save-modal-cancel',
                  defaultMessage: 'Hætta við',
                })}
                onSubmitColor="blue"
                onSubmit={() => onSubmit()}
                onSubmitButtonText={formatMessage({
                  id: 'sp.settings-access-control:access-save-modal-confirm',
                  defaultMessage: 'Já, ég vil vista umboðið',
                })}
              />
            </Inline>
          </Box>
          <Box>
            <Hidden below="md">
              <GridRow className={styles.row}>
                <GridColumn
                  span={['12/12', '12/12', '3/12']}
                  paddingBottom={2}
                  paddingTop={2}
                  className={styles.column}
                >
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage({
                      id: 'sp.settings-access-control:access-access',
                      defaultMessage: 'Aðgangur',
                    })}
                  </Text>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '4/12', '5/12']}
                  className={styles.column}
                >
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage({
                      id: 'sp.settings-access-control:access-explanation',
                      defaultMessage: 'Útskýring',
                    })}
                  </Text>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '5/12', '4/12']}
                  className={styles.column}
                >
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage({
                      id: 'sp.settings-access-control:access-valid-to',
                      defaultMessage: 'Í gildi til',
                    })}
                  </Text>
                </GridColumn>
              </GridRow>
            </Hidden>
            <Box>
              {!loading &&
                Object.keys(groupedApiScopes).map((key, index) => {
                  const apiScopes = groupedApiScopes[key]
                  const accessItems: Scope[] = key.startsWith(GROUP_PREFIX)
                    ? [
                        {
                          ...apiScopes[0].group,
                          model: `${GROUP_PREFIX}.${index}`,
                        } as ApiScopeGroup,
                        ...apiScopes,
                      ]
                    : apiScopes
                  return (
                    <AccessItem
                      apiScopes={accessItems}
                      authDelegation={authDelegation}
                      key={index}
                    />
                  )
                })}
            </Box>
          </Box>
          {loading && (
            <Box marginTop={3}>
              <Stack space={3}>
                <SkeletonLoader width="100%" height={80} />
                <Divider />
              </Stack>
            </Box>
          )}
        </form>
      </FormProvider>
    </Box>
  )
}

export default Access
