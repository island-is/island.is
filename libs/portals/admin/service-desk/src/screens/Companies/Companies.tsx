import React, { useEffect, useState } from 'react'
import { Form, useActionData, useNavigate } from 'react-router-dom'
import * as kennitala from 'kennitala'

import { useLocale } from '@island.is/localization'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import {
  Box,
  Button,
  FilterInput,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { GetCompaniesResult } from './Companies.action'
import { Card } from '../../components/Card'
import { ServiceDeskPaths } from '../../lib/paths'
import * as styles from './Companies.css'

const Companies = () => {
  const [searchInput, setSearchInput] = useState('')
  const [prevSearchInput, setPrevSearchInput] = useState('')
  const actionData = useActionData() as GetCompaniesResult
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const companies = actionData?.data?.data

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
          <FilterInput
            placeholder={formatMessage(m.searchByNationalId)}
            name="searchQuery"
            value={searchInput}
            onChange={setSearchInput}
            backgroundColor="blue"
          />
        </Box>
      </Form>
      <Box marginTop={4}>
        <Box className={styles.relative}>
          <Stack space={3}>
            {companies?.length === 0 ? (
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
