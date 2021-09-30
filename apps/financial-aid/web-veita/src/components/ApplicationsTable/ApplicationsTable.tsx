import React from 'react'
import { Text } from '@island.is/island-ui/core'
import * as styles from './ApplicationsTable.treat'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableHeaders,
  TableBody,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Application,
  ApplicationState,
  ApplicationStateUrl,
} from '@island.is/financial-aid/shared/lib'
import { TableHeadersProps } from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

import { useAllApplications } from '@island.is/financial-aid-web/veita/src/utils/useAllApplications'

interface PageProps {
  applications: Application[]
  setApplications: any
  headers: TableHeadersProps[]
}

const ApplicationsTable = ({
  applications,
  headers,
  setApplications,
}: PageProps) => {
  const router = useRouter()

  const changeApplicationTable = useAllApplications()

  const updateApplicationAndTable = async (
    applicationId: string,
    state: ApplicationState,
  ) => {
    const updateApplicationTable = await changeApplicationTable(
      applicationId,
      state,
      router.pathname.substring(1) as ApplicationStateUrl,
    )
    setApplications(updateApplicationTable)
  }

  if (applications && applications.length > 0) {
    return (
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
    )
  }

  return <Text>Engar umsóknir bíða þín, vel gert 👏</Text>
}

export default ApplicationsTable
