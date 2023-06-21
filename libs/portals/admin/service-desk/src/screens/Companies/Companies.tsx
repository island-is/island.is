import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import { replaceParams } from '@island.is/react-spa/shared'
import React from 'react'
import { Form, useActionData, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  FilterInput,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ServiceDeskPaths } from '../../lib/paths'
import * as styles from './Companies.css'
import { formatNationalId } from '../../utils/formatNationalid'
import { GetCompaniesResult } from './GetCompanies.action'

const Companies = () => {
  const [searchInput, setSearchInput] = React.useState('')
  const actionData = useActionData() as GetCompaniesResult
  const navigate = useNavigate()
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
            onChange={(e) => setSearchInput(e)}
            backgroundColor="blue"
          />
        </Box>
      </Form>
      <Box marginTop={[3, 3, 6]}>
        <GridContainer className={styles.relative}>
          <Stack space={3}>
            {actionData &&
              actionData.data?.map((company) => (
                <GridRow key={`procure-${company.nationalId}`}>
                  <Box
                    display={'flex'}
                    borderRadius={'large'}
                    border={'standard'}
                    width={'full'}
                    paddingX={4}
                    paddingY={3}
                    justifyContent={'spaceBetween'}
                    alignItems={'center'}
                  >
                    <Stack space={1}>
                      <Text variant="h3">{company.name}</Text>
                      <Text variant={'default'}>
                        {formatNationalId(company.nationalId)}
                      </Text>
                    </Stack>
                    <Box height="full" display="flex" alignItems="flexEnd">
                      <Button
                        variant="text"
                        icon="arrowForward"
                        size={'small'}
                        onClick={() =>
                          navigate(
                            replaceParams({
                              href: ServiceDeskPaths.Procurers,
                              params: {
                                nationalId: company.nationalId,
                              },
                            }),
                          )
                        }
                      >
                        {formatMessage(m.viewProcures)}
                      </Button>
                    </Box>
                  </Box>
                </GridRow>
              ))}
          </Stack>
        </GridContainer>
      </Box>
    </>
  )
}

export default Companies
