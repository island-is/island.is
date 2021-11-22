import React, { useState } from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableHeaders,
  SearchSkeleton,
  TableBody,
  GeneratedProfile,
  GenerateName,
  TextTableItem,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, AsyncSearch, Input } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import * as styles from './search.css'
import cn from 'classnames'
import { SearchApplicationQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useLazyQuery } from '@apollo/client'
import { getTagByState } from '../../utils/formHelper'
import { getMonth, getState, Routes , Application} from '@island.is/financial-aid/shared/lib'
import router from 'next/router'

export const Search = () => {
  const [searchNationalId, setSearchNationalId] = useState<string>('')

  const sanitizeNumber = (n: string) => n.replace(/[^\d]/g, '')

  const [getApplications, { data, error, loading }] = useLazyQuery<{
    applications: Application[]
  }>(SearchApplicationQuery, {
    variables: { input: { nationalId: searchNationalId } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const name = (application: Application) => {
    return (
      <Box display="flex" alignItems="center">
        <GeneratedProfile size={32} nationalId={application.nationalId} />
        <Box marginLeft={2}>
          <Text variant="h5">{GenerateName(application.nationalId)}</Text>
        </Box>
      </Box>
    )
  }

  const state = (application: Application) => {
    return (
      <Box>
        <div className={`tags ${getTagByState(application.state)}`}>
          {getState[application.state]}
        </div>
      </Box>
    )
  }
  console.log(data.applicationsResults)

  return (
    <LoadingContainer
      isLoading={false}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box marginTop={15} marginBottom={2} className={``}>
        <input
          placeholder="Sláðu inn kennitölu"
          value={searchNationalId}
          onChange={(e) => {
            if (sanitizeNumber(e.currentTarget.value.toString()).length > 10) {
              return
            }
            setSearchNationalId(e.target.value)
          }}
          type="number"
          className={`${styles.searchInput}`}
          autoFocus
        />

        <button
          onClick={() => {
            getApplications()
          }}
        >
          submit
        </button>

        <Text variant="h5">Kennitöluleit</Text>
      </Box>

      <div className={`${tableStyles.wrapper} hideScrollBar`}>
        <div className={tableStyles.bigTableWrapper}>
          <table
            className={cn({
              [`${tableStyles.tableContainer} ${styles.tableWrapper}`]: true,
            })}
          >
            <thead className={``}>
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

            <tbody className={tableStyles.tableBody}>
              {data &&
                data.applicationsResults.map((item: Application, index) => (
                  <TableBody
                  items={[
                    name(item),
                    state(item),
                    TextTableItem(
                      'default',
                      getMonth(new Date(item.created).getMonth()),
                    ),
                    
                  ]}
                  identifier={item.id}
                  index={index}
                  key={item.id}
                  onClick={() =>
                    router.push(Routes.applicationProfile(item.id))
                  }
                />
                )
       
                })}
            </tbody>
          </table>
          {loading && <SearchSkeleton />}
        </div>
      </div>
    </LoadingContainer>
  )
}

export default Search
