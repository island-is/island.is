import React, { useState } from 'react'
import { Form, useActionData } from 'react-router-dom'

import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Box, FilterInput, Stack } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import * as styles from './Companies.css'
import { GetCompaniesResult } from './GetCompanies.action'
import ContentCard from '../../components/ContentCard/ContentCard'
import NoContentCard from '../../components/NoContentCard/NoContentCard'

const Companies = () => {
  const [searchInput, setSearchInput] = useState('')
  const actionData = useActionData() as GetCompaniesResult
  const { formatMessage } = useLocale()

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
            {actionData &&
              actionData.data?.map((company) => (
                <Box key={`procure-${company.nationalId}`}>
                  <ContentCard
                    name={company.name}
                    nationalId={company.nationalId}
                    withNavigation
                  />
                </Box>
              ))}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

export default Companies
