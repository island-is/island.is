import cn from 'classnames'

import {
  ChartNumberBox as IChartNumberBox,
  ChartNumberBoxGroup as IChartNumberBoxGroup,
} from '@island.is/web/graphql/schema'

import { ChartNumberBox } from '../ChartNumberBox'
import * as styles from './ChartNumberBoxGroup.css'

type ChartNumberBoxGroupRendererProps = {
  // `components` comes back with each item's `id` aliased to
  // `chartNumberBoxId` (per ChartNumberBoxFields in fragments.ts) - the
  // generated schema type doesn't know about that query-level alias, so it's
  // patched here the same way richText.tsx does for a standalone ChartNumberBox.
  slice: Omit<IChartNumberBoxGroup, 'components'> & {
    components: (IChartNumberBox & { chartNumberBoxId: string })[]
  }
}

const MIN_COLUMNS = 1
const MAX_COLUMNS = 4

const getColumnCount = (slice: IChartNumberBoxGroup) => {
  const fallback = Math.min(
    Math.max(slice.components.length, MIN_COLUMNS),
    MAX_COLUMNS,
  )

  if (typeof slice.columnCount !== 'number') {
    return fallback
  }

  if (slice.columnCount < MIN_COLUMNS || slice.columnCount > MAX_COLUMNS) {
    return fallback
  }

  return slice.columnCount
}

const wrapperClassNameByColumnCount: Record<number, string> = {
  1: styles.wrapperOneColumn,
  2: styles.wrapperTwoColumns,
  3: styles.wrapperThreeColumns,
  4: styles.wrapperFourColumns,
}

export const ChartNumberBoxGroup = ({
  slice,
}: ChartNumberBoxGroupRendererProps) => {
  if (!slice.components || slice.components.length === 0) {
    return null
  }

  const columnCount = getColumnCount(slice)

  return (
    <div
      className={cn(styles.wrapper, wrapperClassNameByColumnCount[columnCount])}
    >
      {slice.components.map((box) => (
        <ChartNumberBox key={box.chartNumberBoxId} slice={box} />
      ))}
    </div>
  )
}
