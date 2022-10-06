import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'

import {
  Box,
  Inline,
  Text,
  Stack,
  SkeletonLoader,
  Divider,
  toast,
  GridRow,
  GridColumn,
  Hidden,
  AlertBanner,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  m as coreMessages,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  AccessItem,
  AccessModal,
  DelegationsFormFooter,
} from '../../components'
import { servicePortalSaveAccessControl } from '@island.is/plausible'
import {
  AuthDelegationScopeType,
  AuthDelegationsDocument,
  useAuthApiScopesQuery,
  useUpdateAuthDelegationMutation,
} from '@island.is/service-portal/graphql'
import {
  AccessForm as AccessFormState,
  ApiScopeGroup,
  GroupedApiScopes,
  GROUP_PREFIX,
  Scope,
  ScopeTag,
  SCOPE_PREFIX,
} from '../../utils/types'
import * as styles from './AccessForm.css'

type AccessFormProps = {
  delegation: AuthCustomDelegation
  validityPeriod: Date | null
}

export const AccessForm = ({ delegation, validityPeriod }: AccessFormProps) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])

  const { formatMessage, lang } = useLocale()
  const { delegationId } = useParams<{
    delegationId: string
  }>()
  const history = useHistory()
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [formError, setFormError] = useState(false)

  const onError = () => {
    toast.error(formatMessage(coreMessages.somethingWrong))
  }
  const [updateDelegation] = useUpdateAuthDelegationMutation({
    refetchQueries: [{ query: AuthDelegationsDocument }],
    onError,
  })

  const {
    data: apiScopeData,
    loading: apiScopeLoading,
  } = useAuthApiScopesQuery({
    variables: {
      input: {
        lang,
      },
    },
  })

  const { authApiScopes } = apiScopeData || {}
  const loading = apiScopeLoading

  const methods = useForm<AccessFormState>()
  const { handleSubmit, getValues } = methods

  const onSubmit = handleSubmit(async (model) => {
    if (formError) {
      setFormError(false)
    }

    const scopes = model[SCOPE_PREFIX].filter(
      (scope) => scope.name?.length > 0,
    ).map((scope) => ({
      // If validityPeriod exists then all scopes get the same validity period
      validTo: validityPeriod ?? (scope.validTo as Date),
      type: authApiScopes?.find((apiScope) => apiScope.name === scope.name[0])
        ?.type as AuthDelegationScopeType,
      name: scope.name[0],
      displayName: scope.displayName,
    }))

    const err = getValues()?.[SCOPE_PREFIX]?.every(
      (x) => x.name.length > 0 && !x.validTo,
    )

    if (err) {
      setSaveModalOpen(false)
      setFormError(true)
      return
    }

    const { data, errors } = await updateDelegation({
      variables: {
        input: {
          delegationId,
          scopes,
        },
      },
    })

    if (data && !errors && !err) {
      history.push(ServicePortalPath.AccessControlDelegations)
      servicePortalSaveAccessControl(
        ServicePortalPath.AccessControlDelegationsGrant,
      )
    }
  })

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
        validTo: validityPeriod ?? item.validTo,
      }
  })

  return (
    <>
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
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Box marginBottom={[3, 3, 4]} display="flex" justifyContent="flexEnd">
            <Inline space={1}>
              <AccessModal
                id="access-save-modal"
                isVisible={saveModalOpen}
                title={formatMessage({
                  id: 'sp.settings-access-control:access-save-modal-content',
                  defaultMessage: 'Ertu viss um að þú viljir veita umboðið?',
                })}
                text={`${delegation?.to?.name} ${formatMessage({
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
                      key={index}
                      apiScopes={accessItems}
                      authDelegation={delegation}
                      validityPeriod={validityPeriod}
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
          <Box position="sticky" bottom={0} marginTop={20} paddingBottom={6}>
            <DelegationsFormFooter
              onCancel={() =>
                history.push(ServicePortalPath.AccessControlDelegations)
              }
              onConfirm={() => setSaveModalOpen(true)}
              submitLabel={formatMessage(m.codeConfirmation)}
            />
          </Box>
        </form>
      </FormProvider>
    </>
  )
}
