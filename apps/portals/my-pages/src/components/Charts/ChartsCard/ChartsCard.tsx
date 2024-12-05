import React, { ReactNode } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { Box, Text, Hyphen } from '@island.is/island-ui/core'

import * as styles from './ChartsCard.css'
import SimpleLineChart from '../SimpleLineChart'

interface ChartCardDataProps {
  graphTitle?: string
  graphDescription?: string
  organization?: string
  data?: string
  datakeys?: string
  type?: string
}

export interface ChartsCardsProps {
  chart: ChartCardDataProps
  subPage?: boolean
}

export const ChartsCard: React.FC<
  React.PropsWithChildren<ChartsCardsProps>
> = ({ chart, subPage }) => {
  const { graphTitle, graphDescription, organization, data, datakeys } = chart
  const [ref, { width }] = useMeasure()

  if (!graphTitle || !data || !datakeys) {
    return null
  }

  const graphData = { title: graphTitle, data: data, datakeys: datakeys }

  const children = <SimpleLineChart graphData={graphData} />

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
        className={styles.outerWrapper}
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
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={styles.graphWrapper}
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

const FrameWrapper = ({
  width,
  children,
}: {
  width: number
  children: ReactNode
}) => {
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
