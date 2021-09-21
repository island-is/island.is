import React, { useContext, useState } from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'
import Link from 'next/link'

import * as styles from './TableBody.treat'
import cn from 'classnames'

import {
  Application,
  getState,
  getMonth,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

import {
  GeneratedProfile,
  GenerateName,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  calcDifferenceInDate,
  getTagByState,
} from '@island.is/financial-aid-web/veita/src/utils/formHelper'

import { useApplicationState } from '@island.is/financial-aid-web/veita/src/utils/useApplicationState'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface PageProps {
  application: Application
}

const TableBody = ({ application }: PageProps) => {
  const changeApplicationState = useApplicationState()

  // TODO: Remove state and context when we reload the page when we change the state of application
  const [staffName, setStaffName] = useState(application.staff?.name)
  const { admin } = useContext(AdminContext)

  return (
    <Link href={'application/' + application.id}>
      <tr className={styles.link}>
        <td
          className={cn({
            [`${styles.tablePadding} ${styles.firstChildPadding}`]: true,
          })}
        >
          <Box display="flex" alignItems="center">
            <GeneratedProfile size={32} nationalId={application.nationalId} />
            <Box marginLeft={2}>
              <Text variant="h5">{GenerateName(application.nationalId)}</Text>
            </Box>
          </Box>
        </td>

        <td
          className={cn({
            [`${styles.tablePadding} `]: true,
          })}
        >
          <Box display="flex">
            <div className={`tags ${getTagByState(application.state)}`}>
              {getState[application.state]}
            </div>
          </Box>
        </td>

        <td
          className={cn({
            [`${styles.tablePadding} `]: true,
          })}
        >
          <Text> {calcDifferenceInDate(application.modified)}</Text>
        </td>

        <td
          className={cn({
            [`${styles.tablePadding} `]: true,
          })}
        >
          <Text>{getMonth(new Date(application.created).getMonth())}</Text>
        </td>
        <td
          className={cn({
            [`${styles.tablePadding} `]: true,
          })}
        >
          {staffName ? (
            <Text>{staffName}</Text>
          ) : (
            <Button
              variant="text"
              onClick={(ev) => {
                ev.stopPropagation()
                changeApplicationState(application, ApplicationState.INPROGRESS)
                setStaffName(admin?.name)
              }}
            >
              Sjá um
            </Button>
          )}
        </td>
      </tr>
    </Link>
  )
}

export default TableBody
