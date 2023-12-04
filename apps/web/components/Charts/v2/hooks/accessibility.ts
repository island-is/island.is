import { useMemo } from 'react'

import { Chart } from '@island.is/web/graphql/schema'

export const useGetChartTableSettings = ({ components, xAxisKey }: Chart) =>
  useMemo(() => {
    const tableHead = components.map((c) => c.sourceDataKey)
    const tableHeadWithAxis = [xAxisKey, ...tableHead]

    return {
      tableHead,
      tableHeadWithAxis,
    }
  }, [components, xAxisKey])
