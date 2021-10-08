import React from 'react'
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
  Table as T,
  SkeletonLoader,
  Divider,
  ModalBase,
  toast,
} from '@island.is/island-ui/core'
import {
  Query,
  Mutation,
  AuthCustomDelegation,
  AuthApiScope,
  AuthApiScopeGroup,
} from '@island.is/api/schema'
import {
  IntroHeader,
  NotFound,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

import { AuthDelegationsQuery } from '../AccessControl'
import { AccessItem } from './components'

import * as styles from './Access.treat'

const GROUP_PREFIX = 'group'
const SCOPE_PREFIX = 'scope'

type ApiScope = AuthApiScope & { model: string }
type ApiScopeGroup = AuthApiScopeGroup & { model: string }
export type Scope = ApiScope | ApiScopeGroup
interface GroupedApiScopes {
  [_: string]: ApiScope[]
}

type AccessForm = {
  [SCOPE_PREFIX]: {
    name: string[]
    validTo?: string
    type: string
  }[]
}

const AuthApiScopesQuery = gql`
  query AuthApiScopesQuery {
    authApiScopes {
      name
      displayName
      type
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
          type
          validTo
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

function Access() {
  const { formatMessage } = useLocale()
  const { nationalId }: { nationalId: string } = useParams()
  const history = useHistory()
  const [updateDelegation, { loading: updateLoading }] = useMutation<Mutation>(
    UpdateAuthDelegationMutation,
    { refetchQueries: [{ query: AuthDelegationsQuery }] },
  )
  const [deleteDelegation, { loading: deleteLoading }] = useMutation<Mutation>(
    DeleteAuthDelegationMutation,
    { refetchQueries: [{ query: AuthDelegationsQuery }] },
  )
  const { data: apiScopeData, loading: apiScopeLoading } = useQuery<Query>(
    AuthApiScopesQuery,
  )
  const { data: delegationData, loading: delegationLoading } = useQuery<Query>(
    AuthDelegationQuery,
    {
      fetchPolicy: 'network-only',
      variables: {
        input: {
          toNationalId: nationalId,
        },
      },
    },
  )
  const hookFormData = useForm<AccessForm>()
  const { handleSubmit } = hookFormData

  const { authApiScopes } = apiScopeData || {}
  const authDelegation = (delegationData || {})
    .authDelegation as AuthCustomDelegation
  const loading = apiScopeLoading || delegationLoading

  const onSubmit = handleSubmit(async (model: AccessForm) => {
    const scopes = model[SCOPE_PREFIX].filter(
      (scope) => scope.name?.length > 0,
    ).map((scope) => ({
      ...scope,
      type: authApiScopes?.find((apiScope) => apiScope.name === scope.name[0])
        ?.type,
      name: scope.name[0],
    }))
    const { data, errors } = await updateDelegation({
      variables: { input: { toNationalId: nationalId, scopes } },
    })
    if (data && !errors) {
      toast.success(
        formatMessage({
          id: 'service.portal.settings.accessControl:access-update-success',
          defaultMessage: 'Aðgangur uppfærður!',
        }),
      )
    }
  })

  const onDelete = async (closeModal: () => void) => {
    const { data, errors } = await deleteDelegation({
      variables: { input: { toNationalId: nationalId } },
    })
    if (data && !errors) {
      closeModal()
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

  return (
    <Box>
      <IntroHeader
        title={authDelegation?.to.name || ''}
        intro={defineMessage({
          id: 'service.portal.settings.accessControl:access-intro',
          defaultMessage:
            'Reyndu að lámarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
        })}
      />
      <FormProvider {...hookFormData}>
        <form onSubmit={onSubmit}>
          <Box marginBottom={3} display="flex" justifyContent="flexEnd">
            <Inline space={3}>
              {authDelegation?.scopes.length > 0 && (
                <ModalBase
                  baseId="authDelegation-remove"
                  className={styles.modal}
                  disclosure={
                    <Button
                      variant="ghost"
                      colorScheme="destructive"
                      size="small"
                      icon="close"
                    >
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-remove-delegation',
                        defaultMessage: 'Eyða umboði',
                      })}
                    </Button>
                  }
                >
                  {({ closeModal }: { closeModal: () => void }) => (
                    <Box
                      position="relative"
                      background="white"
                      borderRadius="large"
                      paddingTop={[3, 6, 10]}
                      paddingBottom={[3, 6]}
                      paddingX={[3, 6, 12]}
                    >
                      <Box className={styles.closeButton}>
                        <Button
                          circle
                          colorScheme="negative"
                          icon="close"
                          onClick={() => {
                            closeModal()
                          }}
                          size="large"
                        />
                      </Box>
                      <Stack space={10}>
                        <Box marginRight={4}>
                          <Stack space={1}>
                            <Text variant="h1">
                              {formatMessage({
                                id:
                                  'service.portal.settings.accessControl:access-remove-modal-title',
                                defaultMessage:
                                  'Þú ert að fara að eyða aðgangi.',
                              })}
                            </Text>
                            <Text>
                              {formatMessage({
                                id:
                                  'service.portal.settings.accessControl:access-remove-modal-content',
                                defaultMessage:
                                  'Ertu viss um að þú viljir eyða þessum aðgangi?',
                              })}
                            </Text>
                          </Stack>
                        </Box>
                        <Box display="flex" justifyContent="spaceBetween">
                          <Button onClick={closeModal} variant="ghost">
                            {formatMessage({
                              id:
                                'service.portal.settings.accessControl:access-remove-modal-cancel',
                              defaultMessage: 'Hætta við',
                            })}
                          </Button>
                          <Button
                            onClick={() => onDelete(closeModal)}
                            loading={deleteLoading}
                            colorScheme="destructive"
                          >
                            {formatMessage({
                              id:
                                'service.portal.settings.accessControl:access-remove-modal-confirm',
                              defaultMessage: 'Eyða',
                            })}
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </ModalBase>
              )}
              <Button
                size="small"
                loading={updateLoading}
                type="submit"
                icon="checkmark"
              >
                {formatMessage({
                  id: 'service.portal.settings.accessControl:access-save',
                  defaultMessage: 'Vista aðgang',
                })}
              </Button>
            </Inline>
          </Box>

          <div className={styles.datePickerFix}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    <Text variant="small" color="blue600">
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-access',
                        defaultMessage: 'Aðgangur',
                      })}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="small" color="blue600">
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-explanation',
                        defaultMessage: 'Útskýring',
                      })}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="small" color="blue600">
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-valid-to',
                        defaultMessage: 'Í gildi til',
                      })}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
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
              </T.Body>
            </T.Table>
          </div>
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
