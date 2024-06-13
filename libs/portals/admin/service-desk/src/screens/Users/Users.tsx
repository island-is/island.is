import { Form, useActionData, useNavigate } from 'react-router-dom'

import {
  AsyncSearchInput,
  Box,
  Button,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import { maskString } from '@island.is/shared/utils'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'

import * as styles from '../Companies/Companies.css'
import { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import { Card } from '../../components/Card'
import { ServiceDeskPaths } from '../../lib/paths'
import { GetUserProfilesResult } from './Users.action'

const Users = () => {
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const actionData = useActionData() as GetUserProfilesResult
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const { isSubmitting, isLoading } = useSubmitting()
  const users = actionData?.data?.data
  const [error, setError] = useState({ hasError: false, message: '' })

  useEffect(() => {
    if (actionData?.errors) {
      setError({
        hasError: true,
        message: formatMessage(m.invalidSearchInput),
      })
    } else if (actionData?.globalError) {
      toast.error(formatMessage(m.errorDefault))
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
      <IntroHeader title={m.users} intro={m.userIntro} />
      <Form method="post">
        <Box className={styles.search}>
          <AsyncSearchInput
            hasFocus={focused}
            loading={isSubmitting || isLoading}
            inputProps={{
              name: 'searchQuery',
              value: searchInput,
              inputSize: 'medium',
              onChange: (event) => setSearchInput(event.target.value),
              onBlur,
              onFocus,
              placeholder: formatMessage(m.userSearch),
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
      <Box marginTop={4}>
        <Box className={styles.relative}>
          <Stack space={3}>
            {users?.length === 0 ? (
              <Card
                title={searchInput}
                description={formatMessage(m.userNotContent)}
                bgGrey
              />
            ) : (
              users?.map(({ nationalId, fullName }) => (
                <Box key={`users-${nationalId}`}>
                  <Card
                    title={fullName ?? formatNationalId(nationalId)}
                    description={formatNationalId(nationalId)}
                    cta={
                      <Button
                        variant="text"
                        icon="arrowForward"
                        size="small"
                        onClick={async () =>
                          navigate(
                            replaceParams({
                              href: ServiceDeskPaths.User,
                              params: {
                                nationalId:
                                  (await maskString(
                                    nationalId,
                                    userInfo?.profile?.nationalId ?? '',
                                  )) ?? '',
                              },
                            }),
                          )
                        }
                      >
                        {formatMessage(m.viewDetails)}
                      </Button>
                    }
                  />
                </Box>
              ))
            )}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

export default Users
