import React from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableHeaders,
  SearchSkeleton,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import * as styles from './search.css'
import cn from 'classnames'

export const Search = () => {
  return (
    <LoadingContainer
      isLoading={false}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box marginTop={15} marginBottom={2}>
        <Text as="h1" variant="h1" color="dark200">
          Leit verður hér
        </Text>

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

            <tbody></tbody>

            {/* <tbody className={tableStyles.tableBody}>
              {users.map((item: Staff, index) => (
                <TableBody
                  items={[
                    TextTableItem(
                      'h5',
                      `${item.name} ${isLoggedInUser(item) ? '(Þú)' : ''}`,
                      item.active ? 'dark400' : 'dark300',
                    ),
                    TextTableItem(
                      'default',
                      formatNationalId(item.nationalId),
                      item.active ? 'dark400' : 'dark300',
                    ),
                    TextTableItem(
                      'default',
                      staffRoleDescription(item.roles),
                      item.active ? 'dark400' : 'dark300',
                    ),
                    isLoggedInUser(item) === false &&
                      ActivationButtonTableItem(
                        item.active ? 'Óvirkja' : 'Virkja',
                        staffLoading,
                        () => changeUserActivity(item),
                        item.active,
                      ),
                  ]}
                  index={index}
                  identifier={item.id}
                  key={`tableBody-${item.id}`}
                  onClick={() => router.push(Routes.userProfile(item.id))}
                />
              ))}
            </tbody> */}
          </table>
          <SearchSkeleton />
        </div>
      </div>
    </LoadingContainer>
  )
}

export default Search
