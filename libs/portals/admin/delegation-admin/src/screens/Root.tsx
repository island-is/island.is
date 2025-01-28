import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  AsyncSearchInput,
  Box,
  Button,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useSubmitting } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'
import { Form, Outlet, useActionData, useNavigate } from 'react-router-dom'
import { m } from '../lib/messages'
import { DelegationAdminPaths } from '../lib/paths'
import { GetDelegationForNationalIdResult } from './Root.action'

const Root = () => {
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const actionData = useActionData() as GetDelegationForNationalIdResult
  const { formatMessage } = useLocale()
  const { isSubmitting, isLoading } = useSubmitting()
  const [error, setError] = useState({ hasError: false, message: '' })
  const navigate = useNavigate()
  const userInfo = useUserInfo()

  const hasAdminAccess = userInfo?.scopes.includes(
    AdminPortalScope.delegationSystemAdmin,
  )

  useEffect(() => {
    if (actionData?.errors) {
      setError({
        hasError: true,
        message: formatMessage(m.nationalIdNotFound),
      })
    } else {
      setError({
        hasError: false,
        message: '',
      })
    }
  }, [actionData])

  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <>
      <IntroHeader
        title={m.delegationAdmin}
        intro={m.delegationAdminDescription}
      >
        {hasAdminAccess && (
          <GridColumn span={['8/8', '3/8']}>
            <Box
              display={'flex'}
              justifyContent={['flexStart', 'flexEnd']}
              alignItems={['flexStart', 'center']}
              height={'full'}
            >
              <Button
                dataTestId="create-delegation-button"
                onClick={() => navigate(DelegationAdminPaths.CreateDelegation)}
                size="small"
              >
                {formatMessage(m.createNewDelegation)}
              </Button>
            </Box>
          </GridColumn>
        )}
      </IntroHeader>

      <GridRow>
        <GridColumn span={['8/8', '4/8']}>
          <Form method="post">
            <AsyncSearchInput
              hasFocus={focused}
              loading={isSubmitting || isLoading}
              inputProps={{
                name: 'nationalId',
                value: searchInput,
                inputSize: 'medium',
                onChange: (event) => setSearchInput(event.target.value),
                onBlur,
                onFocus,
                placeholder: formatMessage(formatMessage(m.search)),
                colored: true,
              }}
              buttonProps={{
                type: 'submit',
                disabled: searchInput.length === 0,
              }}
              hasError={error.hasError}
              errorMessage={error.hasError ? error.message : undefined}
            />
          </Form>
        </GridColumn>
      </GridRow>
      <Outlet />
    </>
  )
}

export default Root
