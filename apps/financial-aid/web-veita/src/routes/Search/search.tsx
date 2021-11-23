import React, { useState } from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableHeaders,
  SearchSkeleton,
  TableBody,
  TextTableItem,
  Name,
  State,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Input } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import * as styles from './search.css'
import cn from 'classnames'
import { SearchApplicationQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useLazyQuery } from '@apollo/client'
import { getTagByState } from '../../utils/formHelper'
import {
  getMonth,
  getState,
  Routes,
  Application,
} from '@island.is/financial-aid/shared/lib'
import router from 'next/router'

export const Search = () => {
  const [searchNationalId, setSearchNationalId] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)

  const sanitize = (n: string) => n.replace(/[^0-9]/g, '')

  const isValid = (nationalId: string): boolean => {
    return (
      sanitize(nationalId).length === 10 &&
      isNaN(Number(sanitize(nationalId))) === false
    )
  }

  const [getApplications, { data, error, loading }] = useLazyQuery<{
    applicationsResults: Application[]
  }>(SearchApplicationQuery, {
    variables: { input: { nationalId: searchNationalId.replace('-', '') } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  return (
    <LoadingContainer
      isLoading={false}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box marginTop={15} marginBottom={1} className={`contentUp`}>
        <input
          placeholder="Sláðu inn kennitölu"
          value={searchNationalId}
          onChange={(e) => {
            setSearchNationalId(e.target.value)
          }}
          maxLength={11}
          className={`${styles.searchInput}`}
          autoFocus
          onKeyDown={({ key }) => {
            setHasError(false)
            if (key === 'Enter' && sanitize(searchNationalId).length === 10) {
              if (isValid(searchNationalId)) {
                getApplications()
              } else {
                setHasError(true)
              }
            }
          }}
        />
      </Box>
      <Box className={`contentUp delay-25`}>
        <Text variant="h5">Kennitöluleit</Text>
      </Box>

      <div className={`${tableStyles.wrapper} hideScrollBar`}>
        <div className={tableStyles.bigTableWrapper}>
          <table
            className={cn({
              [`${tableStyles.tableContainer} ${styles.tableWrapper}`]: true,
            })}
          >
            <thead className={`contentUp delay-50`}>
              <tr>
                {['Nafn', 'Staða', 'Tímabil', 'Viðhengi'].map((item, index) => (
                  <TableHeaders
                    header={{ title: item }}
                    index={index}
                    key={`tableHeaders-${index}`}
                  />
                ))}
              </tr>
            </thead>

            <tbody className={`${tableStyles.tableBody} contentUp`}>
              {data &&
                data?.applicationsResults.map((item: Application, index) => (
                  <TableBody
                    items={[
                      Name(item.nationalId),
                      State(item.state),
                      TextTableItem(
                        'default',
                        getMonth(new Date(item.created).getMonth()),
                      ),
                      TextTableItem(
                        'default',
                        item.files ? item.files.length + ' gögn' : '0',
                      ),
                    ]}
                    identifier={item.id}
                    index={index}
                    key={item.id}
                    onClick={() =>
                      router.push(Routes.applicationProfile(item.id))
                    }
                  />
                ))}
            </tbody>
          </table>

          {loading && <SearchSkeleton />}
          {(error || hasError) && (
            <Box className={``}>
              <Text color="red400">
                {' '}
                Obbobb eitthvað fór úrskeiðis, er kennitalan örugglega rétt?
              </Text>
            </Box>
          )}
        </div>
      </div>
    </LoadingContainer>
  )
}

export default Search
