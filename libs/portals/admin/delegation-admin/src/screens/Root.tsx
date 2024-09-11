import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../lib/messages'
import { Form, Outlet, useActionData } from 'react-router-dom'
import { AsyncSearchInput, Box } from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { useSubmitting } from '@island.is/react-spa/shared'
import { GetDelegationForNationalIdResult } from './Root.action'

const Root = () => {
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const actionData = useActionData() as GetDelegationForNationalIdResult
  const { formatMessage } = useLocale()
  const { isSubmitting, isLoading } = useSubmitting()
  const [error, setError] = useState({ hasError: false, message: '' })

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
      <Box justifyContent="spaceBetween" display="flex">
        <IntroHeader
          title={m.delegationAdmin}
          intro={m.delegationAdminDescription}
        />
      </Box>
      <Form method="post">
        <Box style={{ maxWidth: '550px' }}>
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
        </Box>
      </Form>

      <Outlet />
    </>
  )
}

export default Root
