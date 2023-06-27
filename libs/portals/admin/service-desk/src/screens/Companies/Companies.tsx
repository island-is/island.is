import React, { useEffect, useState } from 'react'
import { Form, useActionData, useNavigate } from 'react-router-dom'

import { useLocale } from '@island.is/localization'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
<<<<<<< HEAD
import { Box, Button, Input, Stack, toast } from '@island.is/island-ui/core'
import { replaceParams } from '@island.is/react-spa/shared'
=======
import { Box, Button, Input, Stack } from '@island.is/island-ui/core'
>>>>>>> dbbe3b8d8a (changed input size and text)

import { m } from '../../lib/messages'
import { GetCompaniesResult } from './GetCompanies.action'
import { Card } from '../../components/Card'
import { ServiceDeskPaths } from '../../lib/paths'
import * as styles from './Companies.css'

const Companies = () => {
  const [searchInput, setSearchInput] = useState('')
  const [prevSearchInput, setPrevSearchInput] = useState('')
  const actionData = useActionData() as GetCompaniesResult
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const companies = actionData?.data

  useEffect(() => {
    if (actionData) {
      setPrevSearchInput(searchInput)
    }

    if (actionData?.globalError) {
      toast.error(formatMessage(m.errorDefault))
    }
  }, [actionData])
  return (
    <>
      <IntroHeader
        title={formatMessage(m.procures)}
        intro={formatMessage(m.procuresDescription)}
      />
      <Form method="post">
        <Box display={['inline', 'inline', 'flex']}>
          <Input
            id="search-procurer"
            name="searchQuery"
            placeholder={formatMessage(m.searchByNationalId)}
            backgroundColor="blue"
            size="md"
            icon={{ name: 'search', type: 'outline' }}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </Box>
      </Form>
      <Box marginTop={4}>
        <Box className={styles.relative}>
          <Stack space={3}>
            {companies?.length === 0 ? (
              <Card
                title={formatNationalId(prevSearchInput)}
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
                              href: ServiceDeskPaths.Procurers,
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

export default Companies
