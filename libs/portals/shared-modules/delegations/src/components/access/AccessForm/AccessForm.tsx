import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import classNames from 'classnames'

import {
  Box,
  toast,
  AlertBanner,
  Divider,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { DelegationsFormFooter } from '../../delegations/DelegationsFormFooter'
import { servicePortalSaveAccessControl } from '@island.is/plausible'
import { AccessFormScope, MappedScope } from '../access.types'
import { extendApiScope, formatScopeTreeToScope } from '../access.utils'
import { AccessItem } from '../AccessItem/AccessItem'
import { AccessConfirmModal } from '../AccessConfirmModal'
import { AccessDeleteModal } from '../AccessDeleteModal/AccessDeleteModal'
import { AccessListHeader } from '../AccessList/AccessListHeader'
import { DelegationPaths } from '../../../lib/paths'
import * as commonAccessStyles from '../access.css'
import { AuthScopeTreeQuery } from '../AccessList/AccessListContainer/AccessListContainer.generated'
import { useUpdateAuthDelegationMutation } from './AccessForm.generated'
import { AuthCustomDelegationOutgoing } from '../../../types/customDelegation'
import {
  m as portalMessages,
  formatPlausiblePathToParams,
  usePortalMeta,
  useRoutes,
} from '@island.is/portals/core'
import { useDynamicShadow } from '../../../hooks/useDynamicShadow'

type AccessFormProps = {
  delegation: AuthCustomDelegationOutgoing
  scopeTree: AuthScopeTreeQuery['authScopeTree']
  validityPeriod: Date | null
}

type UseParams = {
  delegationId: string
}

export const AccessForm = ({
  delegation,
  scopeTree,
  validityPeriod,
}: AccessFormProps) => {
  const { formatMessage } = useLocale()
  const { basePath } = usePortalMeta()
  const routes = useRoutes()
  const { delegationId } = useParams() as UseParams
  const navigate = useNavigate()
  const { lg } = useBreakpoint()
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [formError, setFormError] = useState(false)
  const [updateError, setUpdateError] = useState(false)

  const { showShadow, pxProps } = useDynamicShadow({ rootMargin: '-112px' })

  const onError = () => {
    toast.error(formatMessage(portalMessages.somethingWrong))
  }

  const [updateDelegation, { loading: updateLoading }] =
    useUpdateAuthDelegationMutation({
      onError,
    })

  const methods = useForm<{
    scope: AccessFormScope[]
    validityPeriod: Date | null
  }>()
  const { handleSubmit, watch } = methods

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
            delegationId: delegationId as string,
            scopes,
          },
        },
      })

      if (data && !errors && !err) {
        navigate(DelegationPaths.Delegations)
        servicePortalSaveAccessControl(
          formatPlausiblePathToParams({
            path: DelegationPaths.DelegationsGrant,
            routes: routes.map(({ path }) => path),
            basePath,
          }),
        )
      }
    } catch (error) {
      setUpdateError(true)
    }
  })

  // Map format and flatten scopes to be used in the confirm modal
  const scopes: MappedScope[] | undefined = watch('scope')
    ?.map((item) => formatScopeTreeToScope({ item, scopeTree, validityPeriod }))
    .filter(isDefined)

  return (
    <>
      {formError && (
        <Box paddingBottom={3}>
          <AlertBanner
            description={formatMessage(m.dateError)}
            variant="error"
          />
        </Box>
      )}
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <div
            className={classNames(
              commonAccessStyles.grid,
              validityPeriod
                ? commonAccessStyles.gridTwoCols
                : commonAccessStyles.gridThreeCols,
            )}
          >
            {lg && <AccessListHeader validityPeriod={validityPeriod} />}
            <Box className={commonAccessStyles.divider}>
              <Divider />
            </Box>
            {scopeTree?.map((authScope, index) => (
              <AccessItem
                key={index}
                apiScopes={extendApiScope(authScope, index, scopeTree)}
                authDelegation={delegation}
                validityPeriod={validityPeriod}
              />
            ))}
          </div>
          <div {...pxProps} />
        </form>
        <Box position="sticky" bottom={0} marginTop={20}>
          <DelegationsFormFooter
            onCancel={() => navigate(DelegationPaths.Delegations)}
            onConfirm={() => {
              // Only open confirm modal if there are scopes
              // else open delete modal
              if (scopes && scopes.length > 0) {
                setOpenConfirmModal(true)
              } else {
                setOpenDeleteModal(true)
              }
            }}
            confirmLabel={formatMessage(m.saveAccess)}
            showShadow={showShadow}
            confirmIcon="arrowForward"
            disabled={
              delegation.scopes.length === 0 && (!scopes || scopes.length === 0)
            }
          />
        </Box>
      </FormProvider>
      <AccessConfirmModal
        onClose={() => {
          setUpdateError(false)
          setOpenConfirmModal(false)
        }}
        onConfirm={() => onSubmit()}
        isVisible={openConfirmModal}
        delegation={delegation}
        scopes={scopes}
        scopeTree={scopeTree}
        validityPeriod={validityPeriod}
        loading={updateLoading}
        error={updateError}
      />
      <AccessDeleteModal
        onDelete={() => navigate(DelegationPaths.Delegations)}
        onClose={() => setOpenDeleteModal(false)}
        isVisible={openDeleteModal}
        delegation={delegation}
      />
    </>
  )
}
