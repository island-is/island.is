import React, { useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import * as tableStyles from '../../sharedStyles/Table.css'
import { useRouter } from 'next/router'

import cn from 'classnames'

import {
  TableHeaders,
  TableBody,
  LoadingContainer,
  TableSkeleton,
  GeneratedProfile,
  GenerateName,
  TextTableItem,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Application,
  ApplicationState,
  getMonth,
  getState,
  getStateUrlFromRoute,
  Routes,
  TableHeadersProps,
} from '@island.is/financial-aid/shared/lib'

import { useAllApplications } from '@island.is/financial-aid-web/veita/src/utils/useAllApplications'
import { calcDifferenceInDate, getTagByState } from '../../utils/formHelper'

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

  const assignButton = (application: Application) => {
    return (
      <>
        {application.staff?.name ? (
          <Box className={tableStyles.rowContent}>
            <Text>{application.staff?.name}</Text>
          </Box>
        ) : (
          <Box>
            <Button
              variant="text"
              onClick={(ev) => {
                ev.stopPropagation()
                updateApplicationAndTable(
                  application.id,
                  ApplicationState.INPROGRESS,
                )
              }}
            >
              Sjá um
            </Button>
          </Box>
        )}
      </>
    )
  }

  if (applications && applications.length > 0) {
    return (
      <LoadingContainer isLoading={isLoading} loader={<TableSkeleton />}>
        <div className={`${tableStyles.wrapper} hideScrollBar`}>
          <div className={tableStyles.bigTableWrapper}>
            <table
              className={cn({
                [`${tableStyles.tableContainer}`]: true,
              })}
              key={router.pathname}
            >
              <thead className={`contentUp delay-50`}>
                <tr>
                  {headers.map((item, index) => (
                    <TableHeaders
                      header={item}
                      index={index}
                      key={`tableHeaders-${index}`}
                    />
                  ))}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}>
                {applications.map((item: Application, index) => (
                  <TableBody
                    items={[
                      name(item),
                      state(item),
                      TextTableItem(
                        'default',
                        calcDifferenceInDate(item.modified),
                      ),
                      TextTableItem(
                        'default',
                        getMonth(new Date(item.created).getMonth()),
                      ),
                      assignButton(item),
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
          </div>
        </div>
      </LoadingContainer>
    )
  }

  return <Text>Engar umsóknir bíða þín, vel gert 👏</Text>
}

export default ApplicationsTable
