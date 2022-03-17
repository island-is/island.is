import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
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
  GridRow,
  GridColumn,
  Hidden,
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
  m as coreMessages,
  NotFound,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

import { AuthDelegationsQuery } from '../AccessControl'
import { AccessItem } from './components'

import * as styles from './Access.css'
import { AccessModal } from './components/Modal/AccessModal'

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
    displayName?: string
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

function Access() {
  const { formatMessage } = useLocale()
  const { delegationId }: { delegationId: string } = useParams()
  const history = useHistory()
  const [closeModalOpen, setCloseModalOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [formScopes, setFormScopes] = useState()
  //const { setValue, getValues } = useFormContext()

  const onError = () => {
    toast.error(formatMessage(coreMessages.somethingWrong))
  }
  const [updateDelegation, { loading: updateLoading }] = useMutation<Mutation>(
    UpdateAuthDelegationMutation,
    { refetchQueries: [{ query: AuthDelegationsQuery }], onError },
  )
  const [deleteDelegation, { loading: deleteLoading }] = useMutation<Mutation>(
    DeleteAuthDelegationMutation,
    { refetchQueries: [{ query: AuthDelegationsQuery }], onError },
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

  const getScopes = () => {
    const { scope } = getValues()
    const currentScopes =
      scope &&
      scope
        .filter((scope) => scope.name.length > 0)
        .map((scope) => ({
          ...scope,
          type: authApiScopes?.find(
            (apiScope) => apiScope.name === scope.name[0],
          )?.type,
          name: scope.name[0],
          displayName: scope.displayName,
        }))
    console.log('currentScopes', currentScopes)
    return currentScopes
  }
  const onSubmit = handleSubmit(async (model: AccessForm) => {
    const scopes = model[SCOPE_PREFIX].filter(
      (scope) => scope.name?.length > 0,
    ).map((scope) => ({
      ...scope,
      type: authApiScopes?.find((apiScope) => apiScope.name === scope.name[0])
        ?.type,
      name: scope.name[0],
      displayName: scope.displayName,
    }))
    const { data, errors } = await updateDelegation({
      variables: { input: { delegationId, scopes } },
    })
    if (data && !errors) {
      history.push(ServicePortalPath.SettingsAccessControl)
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
  console.log('authApiScopes:', authApiScopes)

  return (
    <Box>
      <IntroHeader
        title={authDelegation?.to?.name || ''}
        intro={defineMessage({
          id: 'service.portal.settings.accessControl:access-intro',
          defaultMessage:
            'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
        })}
      />
      <FormProvider {...hookFormData}>
        <form onSubmit={onSubmit}>
          <Box marginBottom={8} display="flex" justifyContent="flexEnd">
            <Inline space={3}>
              {authDelegation?.scopes.length > 0 && (
                <>
                  <Button
                    variant="text"
                    colorScheme="destructive"
                    size="small"
                    icon="close"
                    onClick={() => setCloseModalOpen(true)}
                  >
                    {formatMessage({
                      id:
                        'service.portal.settings.accessControl:access-remove-delegation',
                      defaultMessage: 'Eyða umboði',
                    })}
                  </Button>
                  {closeModalOpen && (
                    <AccessModal
                      id="access-delete-modal"
                      title={formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-remove-modal-content',
                        defaultMessage:
                          'Ertu viss um að þú viljir eyða þessum aðgangi?',
                      })}
                      //
                      text={
                        `${authDelegation?.to?.name} mun missa umboð fyrir eftirfarandi:` ||
                        ''
                      }
                      scopes={authDelegation?.scopes}
                      onClose={() => setCloseModalOpen(false)}
                      onCloseButtonText={formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-remove-modal-cancel',
                        defaultMessage: 'Hætta við',
                      })}
                      onSubmitColor="red"
                      onSubmit={() => onDelete()}
                      onSubmitButtonText={formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-remove-modal-confirm',
                        defaultMessage: 'Já, ég vil eyða umboði',
                      })}
                    />
                  )}
                </>
              )}
              <Button
                size="small"
                variant="text"
                loading={updateLoading}
                onClick={() => setSaveModalOpen(true)}
                icon="checkmark"
              >
                {formatMessage({
                  id: 'service.portal.settings.accessControl:access-save',
                  defaultMessage: 'Vista aðgang',
                })}
              </Button>
              {saveModalOpen && (
                <AccessModal
                  id="access-save-modal"
                  title={formatMessage({
                    id:
                      'service.portal.settings.accessControl:access-save-modal-content',
                    defaultMessage: 'Ertu viss um að þú viljir veita umboðið?',
                  })}
                  //
                  text={
                    `${authDelegation?.to?.name} mun fá umboð fyrir eftirfarandi:` ||
                    ''
                  }
                  scopes={authDelegation?.scopes}
                  onClose={() => setSaveModalOpen(false)}
                  onCloseButtonText={formatMessage({
                    id:
                      'service.portal.settings.accessControl:access-save-modal-cancel',
                    defaultMessage: 'Hætta við',
                  })}
                  onSubmitColor="blue"
                  onSubmit={() => onSubmit()}
                  onSubmitButtonText={formatMessage({
                    id:
                      'service.portal.settings.accessControl:access-save-modal-confirm',
                    defaultMessage: 'Já, ég vil vista umboðið',
                  })}
                />
              )}
            </Inline>
          </Box>

          <div className={styles.datePickerFix}>
            <Box>
              <Hidden below="md">
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '3/12']}>
                    <Text variant="small" color="blue600">
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-access',
                        defaultMessage: 'Aðgangur',
                      })}
                    </Text>
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '4/12', '5/12']}>
                    <Text variant="small" color="blue600">
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-explanation',
                        defaultMessage: 'Útskýring',
                      })}
                    </Text>
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '5/12', '4/12']}>
                    <Text variant="small" color="blue600">
                      {formatMessage({
                        id:
                          'service.portal.settings.accessControl:access-valid-to',
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
