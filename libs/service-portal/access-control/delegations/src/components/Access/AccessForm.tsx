import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'

import {
  Box,
  Stack,
  SkeletonLoader,
  Divider,
  toast,
  AlertBanner,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  m as coreMessages,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { DelegationsFormFooter } from '../../components'
import { servicePortalSaveAccessControl } from '@island.is/plausible'
import {
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
  SCOPE_PREFIX,
} from '../../utils/types'
import { AccessItem } from './AccessItem'
import { AccessConfirmModal, AccessItemHeader } from '../../components/access'
import { isDefined } from '@island.is/shared/utils'

export type MappedScope = {
  name?: string
  description?: string
  validTo?: Date
}

type AccessFormProps = {
  delegation: AuthCustomDelegation
  validityPeriod: Date | null
}

export const AccessForm = ({ delegation, validityPeriod }: AccessFormProps) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { formatMessage, lang } = useLocale()

  const { delegationId } = useParams<{
    delegationId: string
  }>()
  const history = useHistory()
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
      ...scope,
      // If validityPeriod exists then all scopes get the same validity period
      validTo: validityPeriod ?? (scope.validTo as Date),
      name: scope.name[0],
      displayName: scope.displayName,
    }))

    const err = getValues()?.[SCOPE_PREFIX]?.every(
      (x) => x.name.length > 0 && !x.validTo,
    )

    if (err) {
      setOpenConfirmModal(false)
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
  const scopes = getValues()
    ?.[SCOPE_PREFIX]?.map((item) => {
      if (item.name && (item.validTo || validityPeriod)) {
        const authApiScope = authApiScopes?.find(
          (apiScope) => apiScope.name === item.name[0],
        )

        return {
          name: authApiScope?.displayName,
          description: authApiScope?.description,
          validTo: validityPeriod ?? item.validTo,
        } as MappedScope
      }
    })
    .filter(isDefined)

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
          <AccessItemHeader hideValidityPeriod={!!validityPeriod} />
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
              onConfirm={() => setOpenConfirmModal(true)}
              confirmLabel={formatMessage({
                id: 'sp.settings-access-control:empty-new-access',
                defaultMessage: 'Veita aðgang',
              })}
              confirmIcon="arrowForward"
            />
          </Box>
        </form>
      </FormProvider>
      <AccessConfirmModal
        id={`access-confirm-modal-${delegation?.id}`}
        onClose={() => {
          setOpenConfirmModal(false)
        }}
        onConfirm={async () => {
          onSubmit()
        }}
        label={formatMessage(m.accessControl)}
        title={formatMessage({
          id: 'sp.settings-access-control:access-confirm-modal-title',
          defaultMessage: 'Þú ert að veita aðgang',
        })}
        isVisible={openConfirmModal}
        delegation={delegation}
        domain={{
          name: 'Landsbankaappið',
          imgSrc: './assets/images/educationDegree.svg',
        }}
        scopes={scopes}
        validityPeriod={validityPeriod}
      />
    </>
  )
}
