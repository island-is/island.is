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

  const shouldStack = width < 360

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
    <Box ref={ref} className={cn(styles.card)}>
      <Box
        className={cn(styles.outerWrapper)}
        background={subPage ? 'blue100' : 'purple100'}
        style={{
          width: graph.type === 'Pie' ? '100%' : '889px',
        }}
      >
        <Box className={cn(styles.innerWrapper)}>
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
        style={{
          width: graph.type === 'Pie' || !shouldStack ? '100%' : '889px',
          height: '100%',
        }}
      >
        <Box className={cn(styles.graphParent)}>{children}</Box>
      </Box>
    </Box>
  )

  return <FrameWrapper>{items}</FrameWrapper>
}

const FrameWrapper = ({ children }) => {
  return (
    <Box
      className={cn(styles.frameWrapper)}
      borderColor="purple100"
      borderWidth="standard"
      borderRadius="large"
    >
      {children}
    </Box>
  )
}

export default ChartsCard
