import { useEffect, useRef, useState } from 'react'
import { Form, useActionData, useNavigate, useSearchParams, useSubmit } from 'react-router-dom'
import * as kennitala from 'kennitala'

import { useLocale } from '@island.is/localization'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import {
  AsyncSearchInput,
  Box,
  Button,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { GetCompaniesResult } from './Companies.action'
import { Card } from '../../components/Card'
import { ServiceDeskPaths } from '../../lib/paths'
import * as styles from './Companies.css'

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams?.get('q')

  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState(() => searchQuery || '')
  const submit = useSubmit()

  const actionData = useActionData() as GetCompaniesResult
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { isSubmitting, isLoading } = useSubmitting()
  const companies = actionData?.data?.data
  const formRef = useRef(null)

  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  useEffect(() => {
    if (actionData?.globalError) {
      toast.error(formatMessage(m.errorDefault))
    }
  }, [actionData])

  useEffect(() => {
    if (searchInput) {
      submit(formRef.current)
    }
  }, [])

  return (
    <>
      <IntroHeader
        title={formatMessage(m.procures)}
        intro={formatMessage(m.procuresDescription)}
      />
      <Form method="post" ref={formRef}>
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
              disabled: !searchInput,
              onClick: () => {
                setSearchParams((params) => {
                  params.set('q', searchInput)
                  return params
                })
              }
            }}
          />
        </Box>
      </Form>
      <Box marginTop={4}>
        <Box className={styles.relative}>
          <Stack space={3}>
            {companies?.length === 0 && !!searchQuery ? (
              <Card
                title={
                  kennitala.isValid(searchQuery)
                    ? formatNationalId(searchQuery)
                    : searchQuery
                }
                description={formatMessage(m.noContent)}
                bgGrey
              />
            ) : (
              companies?.map(({ nationalId, name }) => (
                <Box key={`procure-${nationalId}`}>
                  <Card
                    title={name}
                    description={formatNationalId(nationalId)}
                    cta={
                      <Button
                        variant="text"
                        icon="arrowForward"
                        size="small"
                        onClick={() =>
                          navigate(
                            replaceParams({
                              href: ServiceDeskPaths.Company,
                              params: {
                                nationalId,
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

export default Companies
