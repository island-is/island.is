import React, { useContext } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { Box, Text, Hyphen } from '@island.is/island-ui/core'
import {
  MixedChart,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart
} from '../'

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
  blue?: boolean
}

export const ChartsCard: React.FC<ChartsCardsProps> = ({ data, blue }) => {
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
      children = <SimpleBarChart graphData={graph}/>
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
      style={{ flexDirection: 'column' }}
      flexGrow={1}
      flexDirection={shouldStack ? 'columnReverse' : 'row'}
      alignItems="stretch"
      justifyContent="flexStart"
    >
      <Box
        style={{
          width: '100%',
          minHeight: '128px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          paddingBottom: '24px',
        }}
        background={blue ? 'blue100' : 'purple100'}
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
          {graphDescription && <Text color="dark400">{graphDescription}</Text>}
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ width: '100%', height: '100%' }}
      >
        <Box justifyContent="center" style={{ width: '80%', height: '80%' }}>
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
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="visible"
      background="transparent"
      outline="none"
      borderColor="purple100"
      borderWidth="standard"
    >
      {children}
    </Box>
  )
}

export default ChartsCard
