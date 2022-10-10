import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'

import {
  Box,
  Text,
  Stack,
  SkeletonLoader,
  Divider,
  toast,
  AlertBanner,
  GridRow,
  GridColumn,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  m as coreMessages,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  AccessItemHeader,
  AccessConfirmModal,
  AccessItem,
  DelegationsFormFooter,
} from '../../components'
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
import format from 'date-fns/format'
import { DATE_FORMAT } from './AccessItem'
import * as accessItemStyles from './AccessItem.css'

type AccessFormProps = {
  delegation: AuthCustomDelegation
  validityPeriod: Date | null
}

export const AccessForm = ({ delegation, validityPeriod }: AccessFormProps) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { formatMessage, lang } = useLocale()
  const { md } = useBreakpoint()
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
  const scopes = getValues()?.[SCOPE_PREFIX]?.map((item) => {
    if (item.name && (item.validTo || validityPeriod)) {
      const authApiScope = authApiScopes?.find(
        (apiScope) => apiScope.name === item.name[0],
      )

      return {
        name: authApiScope?.displayName,
        description: authApiScope?.description,
        validTo: validityPeriod ?? item.validTo,
      }
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
              confirmLabel={formatMessage(m.codeConfirmation)}
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
        delegation={delegation as AuthCustomDelegation}
        domain={{
          name: 'Landsbankaappið',
          imgSrc: './assets/images/educationDegree.svg',
        }}
      >
        <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
          <Box display="flex" alignItems="center" justifyContent="spaceBetween">
            <Text variant="h4" as="h4">
              {formatMessage({
                id: 'sp.access-control-delegations:access-title',
                defaultMessage: 'Réttindi',
              })}
            </Text>
            {validityPeriod && (
              <Box display="flex" flexDirection="column" alignItems="flexEnd">
                <Text variant="small">
                  {formatMessage({
                    id:
                      'sp.settings-access-control:access-item-datepicker-label-mobile',
                    defaultMessage: 'Í gildi til',
                  })}
                </Text>
                <Text fontWeight="semiBold">
                  {format(validityPeriod, DATE_FORMAT)}
                </Text>
              </Box>
            )}
          </Box>
          <Box marginBottom={12}>
            <AccessItemHeader hideValidityPeriod={!!validityPeriod} />
            {scopes?.map(
              (scope, index) =>
                scope?.name && (
                  <div key={index}>
                    <GridRow className={accessItemStyles.row} key={index}>
                      <GridColumn
                        span={['12/12', '12/12', '3/12']}
                        className={accessItemStyles.item}
                      >
                        <Text fontWeight="light">{scope?.name}</Text>
                      </GridColumn>
                      {((!md && scope?.description?.trim()) || md) && (
                        <GridColumn
                          span={['12/12', '12/12', '4/12', '5/12']}
                          className={accessItemStyles.item}
                          paddingTop={[3, 3, 3, 0]}
                        >
                          <Box
                            paddingLeft={[2, 2, 0]}
                            display="flex"
                            flexDirection="column"
                            className={accessItemStyles.rowGap}
                          >
                            {!md && (
                              <Text variant="small" fontWeight="semiBold">
                                {formatMessage({
                                  id: 'sp.access-control-delegation:grant',
                                  defaultMessage: 'Heimild',
                                })}
                              </Text>
                            )}
                            <Text variant="small" fontWeight="light">
                              {scope?.description}
                            </Text>
                          </Box>
                        </GridColumn>
                      )}
                      {!validityPeriod && scope?.validTo && (
                        <GridColumn
                          span={['12/12', '8/12', '5/12', '4/12']}
                          paddingTop={[2, 2, 2, 0]}
                        >
                          <Text variant="small">
                            {format(new Date(scope?.validTo), DATE_FORMAT)}
                          </Text>
                        </GridColumn>
                      )}
                    </GridRow>
                    <Box
                      paddingLeft={index === 0 ? 0 : [3, 3, 0]}
                      className={accessItemStyles.dividerContainer}
                    >
                      <Divider />
                    </Box>
                  </div>
                ),
            )}
          </Box>
        </Box>
      </AccessConfirmModal>
    </>
  )
}
