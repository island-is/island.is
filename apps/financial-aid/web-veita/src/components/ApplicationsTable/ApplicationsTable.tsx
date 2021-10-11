import React, { useState } from 'react'
import { Text } from '@island.is/island-ui/core'
import * as styles from './ApplicationsTable.treat'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableHeaders,
  TableBody,
  LoadingContainer,
  TableSkeleton,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Application,
  ApplicationState,
  ApplicationStateUrl,
  getStateUrlFromRoute,
} from '@island.is/financial-aid/shared/lib'
import { TableHeadersProps } from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

import { useAllApplications } from '@island.is/financial-aid-web/veita/src/utils/useAllApplications'

interface PageProps {
  applications: Application[]
  setApplications: React.Dispatch<
    React.SetStateAction<Application[] | undefined>
  >
  headers: TableHeadersProps[]
}

const ApplicationsTable = ({
  applications,
  headers,
  setApplications,
}: PageProps) => {
  const router = useRouter()

  const changeApplicationTable = useAllApplications()

  const [isLoading, setIsLoading] = useState(false)

  const updateApplicationAndTable = async (
    applicationId: string,
    state: ApplicationState,
  ) => {
    setIsLoading(true)
    await changeApplicationTable(
      applicationId,
      state,
      getStateUrlFromRoute[router.pathname],
    )
      .then((updateTable) => {
        setIsLoading(false)
        setApplications(updateTable)
      })
      .catch(() => {
        //TODO ERROR STATE
        setIsLoading(false)
      })
  }

  if (applications && applications.length > 0) {
    return (
      <LoadingContainer isLoading={isLoading} loader={<TableSkeleton />}>
        <div className={`${styles.wrapper} hideScrollBar`}>
          <table
            className={cn({
              [`${styles.tableContainer}`]: true,
            })}
            key={router.pathname}
          >
            <thead className={`contentUp delay-50`}>
              <tr>
                {headers.map((item, index) => (
                  <TableHeaders
                    header={item}
                    index={index}
                    key={'tableHeaders-' + index}
                  />
                ))}
              </tr>
            </thead>

            <tbody className={styles.tableBody}>
              {applications.map((item: Application, index) => (
                <TableBody
                  application={item}
                  index={index}
                  key={'tableBody-' + item.id}
                  onApplicationUpdate={updateApplicationAndTable}
                />
              ))}
            </tbody>
          </table>
        </div>
      </LoadingContainer>
    )
  }

  return <Text>Engar umsóknir bíða þín, vel gert 👏</Text>
}

export default ApplicationsTable
