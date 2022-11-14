import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'

import { Box, toast, AlertBanner } from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  formatPlausiblePathToParams,
  m as coreMessages,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { servicePortalSaveAccessControl } from '@island.is/plausible'
import {
  useUpdateAuthDelegationMutation,
  AuthScopeTreeQuery,
} from '@island.is/service-portal/graphql'
import {
  AccessFormScope,
  AuthScopeTree,
  AUTH_API_SCOPE_GROUP_TYPE,
} from './access.types'
import {
  extendApiScope,
  formatScopeTreeToScope,
  flattenAndExtendApiScopeGroup,
} from './access.utils'
import { AccessItem } from './AccessItem/AccessItem'
import { AccessConfirmModal } from './AccessConfirmModal'
import { AccessItemHeader } from './AccessItem/AccessItemHeader'
import { isDefined } from '@island.is/shared/utils'
import * as commonAccessStyles from './access.css'
import { AccessDeleteModal } from './AccessDeleteModal'
import { useAuth } from '@island.is/auth/react'

type AccessFormProps = {
  delegation: AuthCustomDelegation
  scopeTree: AuthScopeTreeQuery['authScopeTree']
  validityPeriod: Date | null
}

export const AccessForm = ({
  delegation,
  scopeTree,
  validityPeriod,
}: AccessFormProps) => {
  const { formatMessage } = useLocale()
  const { delegationId } = useParams<{
    delegationId: string
  }>()
  const history = useHistory()
  const { userInfo } = useAuth()

  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [formError, setFormError] = useState(false)
  const [updateError, setUpdateError] = useState(false)

  const onError = () => {
    toast.error(formatMessage(coreMessages.somethingWrong))
  }

  const [
    updateDelegation,
    { loading: updateLoading },
  ] = useUpdateAuthDelegationMutation({
    onError,
  })

  const methods = useForm<{
    scope: AccessFormScope[]
    validityPeriod: Date | null
  }>()
  const { handleSubmit, getValues } = methods

  const onSubmit = handleSubmit(async (values) => {
    if (formError) {
      setFormError(false)
    }

    const scopes = values.scope
      .filter((scope) => scope.name?.length > 0)
      .map((scope) => ({
        // If validityPeriod exists then all scopes get the same validity period
        validTo: validityPeriod ?? (scope.validTo as Date),
        name: scope.name[0],
      }))

    const err = scopes.every((x) => x.name.length > 0 && !x.validTo)

    if (err) {
      setOpenConfirmModal(false)
      setFormError(true)
      return
    }

    try {
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
          formatPlausiblePathToParams(
            ServicePortalPath.AccessControlDelegationsGrant,
          ),
        )
      }
    } catch (error) {
      setUpdateError(true)
    }
  })

  // Map format and flatten scopes to be used in the confirm modal
  const scopes = getValues()
    ?.scope?.map((item) =>
      formatScopeTreeToScope({ item, scopeTree, validityPeriod }),
    )
    .filter(isDefined)

  const renderAccessItem = (
    authScope: AuthScopeTree[0],
    index: number,
    authScopes: AuthScopeTree,
  ) => {
    const apiScopes =
      authScope.__typename === AUTH_API_SCOPE_GROUP_TYPE
        ? flattenAndExtendApiScopeGroup(authScope, index)
        : [extendApiScope(authScope, index, authScopes)]

    return (
      <AccessItem
        key={index}
        apiScopes={apiScopes}
        authDelegation={delegation}
        validityPeriod={validityPeriod}
      />
    )
  }

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
          <Box className={commonAccessStyles.resetMarginGutter}>
            <AccessItemHeader hideValidityPeriod={!!validityPeriod} />
            {scopeTree.map(renderAccessItem)}
          </Box>
        </form>
        <Box position="sticky" bottom={0} marginTop={20}>
          <DelegationsFormFooter
            onCancel={() =>
              history.push(ServicePortalPath.AccessControlDelegations)
            }
            onConfirm={() => {
              if (scopes.length > 0) {
                setOpenConfirmModal(true)
              } else {
                setOpenDeleteModal(true)
              }
            }}
            confirmLabel={formatMessage({
              id: 'sp.settings-access-control:empty-new-access',
              defaultMessage: 'Veita aðgang',
            })}
            confirmIcon="arrowForward"
            disabled={
              delegation.scopes.length === 0 && (!scopes || scopes.length === 0)
            }
          />
        </Box>
      </FormProvider>
      <AccessConfirmModal
        id={`access-confirm-modal-${delegation?.id}`}
        onClose={() => {
          setUpdateError(false)
          setOpenConfirmModal(false)
        }}
        onConfirm={() => onSubmit()}
        label={formatMessage(m.accessControl)}
        title={formatMessage({
          id: 'sp.settings-access-control:access-confirm-modal-title',
          defaultMessage: 'Þú ert að veita aðgang',
        })}
        isVisible={openConfirmModal}
        delegation={delegation}
        domain={{
          name: delegation.domain.displayName,
          imgSrc: delegation.domain.organisationLogoUrl,
        }}
        scopes={scopes}
        validityPeriod={validityPeriod}
        loading={updateLoading}
        error={updateError}
      />
      <AccessDeleteModal
        onDelete={() => {
          history.push(
            delegation.to?.nationalId === userInfo?.profile.nationalId
              ? ServicePortalPath.AccessControlDelegationsIncoming
              : ServicePortalPath.AccessControlDelegations,
          )
        }}
        onClose={() => setOpenDeleteModal(false)}
        isVisible={openDeleteModal}
        delegation={delegation as AuthCustomDelegation}
      />
    </>
  )
}
