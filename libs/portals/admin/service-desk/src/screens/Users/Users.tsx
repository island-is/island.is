import { useLocale } from '@island.is/localization'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import { Form, useActionData, useNavigate } from 'react-router-dom'
import { AsyncSearchInput, Box, Button, Stack } from '@island.is/island-ui/core'
import * as styles from '../Companies/Companies.css'
import { useState } from 'react'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'
import { Card } from '../../components/Card'
import kennitala from 'kennitala'
import { ServiceDeskPaths } from '../../lib/paths'
import { GetUserProfilesResult } from './Users.action'

const Users = () => {
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [prevSearchInput, setPrevSearchInput] = useState('')
  const actionData = useActionData() as GetUserProfilesResult
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { isSubmitting, isLoading } = useSubmitting()
  const users = actionData?.data?.data

  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <>
      <IntroHeader title={m.users} intro={m.user} />
      <Form method="post">
        <Box display={['inline', 'inline', 'flex']} className={styles.search}>
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
              placeholder: formatMessage(m.searchByNationalId),
              colored: true,
            }}
            buttonProps={{
              type: 'submit',
              disabled: searchInput.length === 0,
            }}
          />
        </Box>
      </Form>
      <Box marginTop={4}>
        <Box className={styles.relative}>
          <Stack space={3}>
            {users?.length === 0 ? (
              <Card
                title={
                  kennitala.isValid(prevSearchInput)
                    ? formatNationalId(prevSearchInput)
                    : prevSearchInput
                }
                description={formatMessage(m.noContent)}
                bgGrey
              />
            ) : (
              users?.map(({ nationalId, fullName }) => (
                <Box key={`procure-${nationalId}`}>
                  <Card
                    title={fullName ?? nationalId}
                    description={formatNationalId(nationalId)}
                    cta={
                      <Button
                        variant="text"
                        icon="arrowForward"
                        size="small"
                        onClick={() =>
                          navigate(
                            replaceParams({
                              href: ServiceDeskPaths.User,
                              params: {
                                nationalId,
                              },
                            }),
                          )
                        }
                      >
                        {formatMessage(m.viewProcures)}
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
