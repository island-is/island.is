import React, { useContext, useEffect, useMemo, useState } from 'react'

import {
  TableHeaders,
  SearchSkeleton,
  TableBody,
  TextTableItem,
  usePseudoName,
  State,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as styles from './search.css'
import cn from 'classnames'
import { ApplicationSearchQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useLazyQuery } from '@apollo/client'
import {
  getMonth,
  Routes,
  Application,
  isNationalIdValid,
  sanitizeOnlyNumbers,
} from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

export const Search = () => {
  const router = useRouter()
  const { admin } = useContext(AdminContext)

  const [searchNationalId, setSearchNationalId] = useState<string>(
    router?.query?.search as string,
  )
  useEffect(() => {
    if (
      searchNationalId &&
      sanitizeOnlyNumbers(searchNationalId).length === 10
    ) {
      getApplications({
        variables: {
          input: { nationalId: sanitizeOnlyNumbers(searchNationalId) },
        },
      })
    }
  }, [])

  const [getApplications, { data, error, loading }] = useLazyQuery<{
    applicationSearch: Application[]
  }>(ApplicationSearchQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const applicationSearchResult = useMemo(() => {
    router.push({
      query: {
        search: sanitizeOnlyNumbers(searchNationalId),
      },
    })
    if (data && sanitizeOnlyNumbers(searchNationalId).length === 10) {
      return data.applicationSearch
    }
    return []
  }, [data, searchNationalId])

  return (
    <>
      <Box marginTop={15} marginBottom={1} className={`contentUp`}>
        <input
          placeholder="Sláðu inn kennitölu"
          value={searchNationalId}
          onChange={(e) => {
            if (
              sanitizeOnlyNumbers(e.target.value).length === 10 &&
              isNationalIdValid(e.target.value)
            ) {
              getApplications({
                variables: {
                  input: { nationalId: sanitizeOnlyNumbers(e.target.value) },
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
              {applicationSearchResult &&
                applicationSearchResult.map((item: Application, index) => (
                  <TableBody
                    items={[
                      usePseudoName(
                        item.nationalId,
                        item.name,
                        admin?.staff?.usePseudoName ?? false,
                      ),
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
          {data?.applicationSearch.length === 0 && (
            <Box className={`contentUp`}>
              <Text>Enginn fundinn með þessari kennitölu</Text>
            </Box>
          )}
        </div>
      </div>
    </>
  )
}

export default Search
