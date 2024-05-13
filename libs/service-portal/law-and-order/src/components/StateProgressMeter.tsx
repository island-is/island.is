import {
  Box,
  Text,
  GridRow,
  GridColumn,
  GridContainer,
  DraftProgressMeter,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { Process } from '../helpers/mockData'
import React, { FC } from 'react'
import { formatDate } from '@island.is/service-portal/core'
// eslint-disable-next-line no-restricted-imports
import { times } from 'lodash'
import * as styles from './StateProgressMeter.css'

interface Props {
  process: Process[]
}
export const StateProgressMeter: FC<React.PropsWithChildren<Props>> = ({
  process,
}) => {
  useNamespaces('sp.law-and-order')

  const stateNumber = process.filter((x) => x.state.date !== undefined).length
  return (
    <Box>
      {/* <DraftProgressMeter
        draftFinishedSteps={stateNumber}
        draftTotalSteps={process.length}
        hideText={true}
      /> */}

      <Box
        className={styles.container}
        position="relative"
        background={'blue100'}
        borderRadius="large"
        width="full"
        overflow="hidden"
      >
        <Box
          position="relative"
          overflow="hidden"
          borderRadius="standard"
          height="full"
          width="full"
          display="flex"
          columnGap={1}
        >
          {process.map((x, i) => {
            return (
              <Box
                key={`draft-progress-meter-${i}`}
                background={stateNumber > i ? 'blue400' : 'blue200'}
                borderRadius="standard"
                width="full"
              />
            )
          })}
        </Box>
      </Box>
      <Box
        className={styles.textContainer}
        position="relative"
        width="full"
        overflow="hidden"
      >
        <Box
          position="relative"
          overflow="hidden"
          borderRadius="standard"
          height="full"
          width="full"
          display="flex"
          columnGap={1}
        >
          {process.map((x, i) => {
            return (
              <Box display="flex" flexDirection="column" width="full">
                <Text variant="small" paddingTop={1}>
                  {x.state.title}
                </Text>
                <Text variant="small">{formatDate(x.state.date)}</Text>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
