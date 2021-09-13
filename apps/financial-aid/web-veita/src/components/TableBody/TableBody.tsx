import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import Link from 'next/link'

import * as styles from './TableBody.treat'

import cn from 'classnames'
import {
  Application,
  getState,
  months,
} from '@island.is/financial-aid/shared/lib'
import format from 'date-fns/format'

import {
  GeneratedProfile,
  GenerateName,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  calcDifferenceInDate,
  getTagByState,
} from '@island.is/financial-aid-web/veita/src/utils/formHelper'

interface PageProps {
  application: Application
  index: number
}

const TableBody = ({ application, index }: PageProps) => {
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
          <Text>{months[new Date(application.created).getMonth()]}</Text>
        </td>
      </tr>
    </Link>
  )
}

export default TableBody
