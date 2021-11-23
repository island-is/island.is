import React, { useMemo, useState } from 'react'

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
import { Text, Box } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as styles from './search.css'
import cn from 'classnames'
import { SearchApplicationQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useLazyQuery } from '@apollo/client'
import {
  getMonth,
  Routes,
  Application,
} from '@island.is/financial-aid/shared/lib'
import router from 'next/router'

export const Search = () => {
  const [searchNationalId, setSearchNationalId] = useState<string>('')

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
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const applicationRes = useMemo(() => {
    if (data && sanitize(searchNationalId).length === 10) {
      return data.applicationsResults
    }
    return []
  }, [data, searchNationalId])

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
            if (
              sanitize(e.target.value).length === 10 &&
              isValid(e.target.value)
            ) {
              getApplications({
                variables: {
                  input: { nationalId: sanitize(e.target.value) },
                },
              })
            }
            setSearchNationalId(e.target.value)
          }}
          maxLength={11}
          className={`${styles.searchInput}`}
          autoFocus
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
              {applicationRes &&
                applicationRes.map((item: Application, index) => (
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
          {error && (
            <Box className={`contentUp`}>
              <Text color="red400">
                Obbobb eitthvað fór úrskeiðis, er kennitalan örugglega rétt?
              </Text>
            </Box>
          )}
          {data?.applicationsResults.length === 0 && (
            <Box className={`contentUp`}>
              <Text>Enginn fundinn með þessari kennitölu</Text>
            </Box>
          )}
        </div>
      </div>
    </LoadingContainer>
  )
}

export default Search
