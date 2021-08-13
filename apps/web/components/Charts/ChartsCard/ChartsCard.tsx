import React from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { Box, Text, Hyphen } from '@island.is/island-ui/core'
import {
  MixedChart,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
} from '../'
import { ExportCSVButton } from '@island.is/web/components'

import * as styles from './ChartsCard.treat'

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
  type: string
}

interface ChartCardDataProps {
  graphTitle?: string
  graphDescription?: string
  organization?: string
  graph?: GraphDataProps
}

export interface ChartsCardsProps {
  data: ChartCardDataProps
  subPage?: boolean
}

export const ChartsCard: React.FC<ChartsCardsProps> = ({ data, subPage }) => {
  const { graphTitle, graphDescription, organization, graph } = data
  const [ref, { width }] = useMeasure()

  let children = null
  switch (graph.type) {
    case 'Mixed':
      children = <MixedChart graphData={graph} />
      break
    case 'Line':
      children = <SimpleLineChart graphData={graph} />
      break
    case 'Bar':
      children = <SimpleBarChart graphData={graph} />
      break
    case 'Pie':
      children = <SimplePieChart graphData={graph} />
      break
    default:
      break
  }

  const items = (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      flexGrow={1}
      alignItems="stretch"
      justifyContent="flexStart"
    >
      <Box
        className={cn(styles.outerWrapper, {
          [styles.pie]: graph.type === 'Pie',
        })}
        background={subPage ? 'blue100' : 'purple100'}
      >
        <Box
          className={styles.innerWrapper}
          paddingBottom={4}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="spaceBetween"
        >
          <Box padding={[2, 2, 4]}>
            {organization && (
              <Text variant="eyebrow" color="dark400">
                {organization}
              </Text>
            )}
            <Text variant="h3" color="dark400">
              <Hyphen>{graphTitle}</Hyphen>
            </Text>
            {graphDescription && (
              <Text color="dark400">{graphDescription}</Text>
            )}
          </Box>

          {subPage && (
            <Box padding={[2, 2, 4]}>
              <ExportCSVButton data={graph.data} title={graph.title} />
            </Box>
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={cn(styles.graphWrapper, {
          [styles.pie]: graph.type === 'Pie',
        })}
      >
        <Box justifyContent="center" className={styles.graphParent}>
          {children}
        </Box>
      </Box>
    </Box>
  )
  return <FrameWrapper>{items}</FrameWrapper>
}

const FrameWrapper = ({ children }) => {
  return (
    <Box
      className={styles.frameWrapper}
      borderColor="purple100"
      borderWidth="standard"
      borderRadius="large"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  )
}

export default ChartsCard
