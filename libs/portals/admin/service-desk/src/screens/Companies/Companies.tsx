import React, { useState } from 'react'
import { Form, useActionData, useNavigate } from 'react-router-dom'

import { useLocale } from '@island.is/localization'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import { Box, Button, FilterInput, Stack } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import * as styles from './Companies.css'
import { GetCompaniesResult } from './GetCompanies.action'
import { Card } from '../../components/Card'
import { replaceParams } from '@island.is/react-spa/shared'
import { ServiceDeskPaths } from '../../lib/paths'

const Companies = () => {
  const [searchInput, setSearchInput] = useState('')
  const actionData = useActionData() as GetCompaniesResult
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

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
      <Box marginTop={[3, 3, 6]}>
        <Box className={styles.relative}>
          <Stack space={3}>
            {actionData.data && actionData.data.length > 0 ? (
              actionData.data.map(({ nationalId, name }) => (
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
            ) : (
              <Card
                title={formatNationalId(searchInput)}
                description={formatMessage(m.noContent)}
              />
            )}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

export default Companies
