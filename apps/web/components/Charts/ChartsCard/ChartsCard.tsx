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
  organizationLogo?: any
  data?: string
  datakeys?: string
  type?: string
}

export interface ChartsCardsProps {
  chart: ChartCardDataProps
  subPage?: boolean
}

export const ChartsCard: React.FC<ChartsCardsProps> = ({ chart, subPage }) => {
  const {
    graphTitle,
    graphDescription,
    organization,
    type,
    data,
    datakeys,
    organizationLogo,
  } = chart
  const [ref, { width, height }] = useMeasure()
  const graphData = { title: graphTitle, data: data, datakeys: datakeys }

  let children = null
  switch (type) {
    case 'Mixed':
      children = <MixedChart graphData={graphData} />
      break
    case 'Line':
      children = <SimpleLineChart graphData={graphData} />
      break
    case 'Bar':
      children = <SimpleBarChart graphData={graphData} />
      break
    case 'Pie':
      children = <SimplePieChart graphData={graphData} />
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
          [styles.pie]: type === 'Pie',
        })}
        background={subPage ? 'blue100' : 'purple100'}
      >
        <Box
          className={styles.innerWrapper}
          paddingBottom={4}
          display="flex"
          flexDirection="row"
          alignItems="center"
          padding={[2, 2, 2]}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            width="full"
          >
            <Box paddingLeft={1}>
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
                <ExportCSVButton data={data} title={graphTitle} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={cn(styles.graphWrapper, {
          [styles.pie]: type === 'Pie',
        })}
      >
        <Box
          justifyContent="center"
          alignItems="center"
          className={styles.graphParent}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
  return <FrameWrapper width={width}>{items}</FrameWrapper>
}

const FrameWrapper = ({ width, children }) => {
  return (
    <Box
      className={cn(styles.frameWrapper, {
        [styles.scroll]: width < 800,
      })}
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
