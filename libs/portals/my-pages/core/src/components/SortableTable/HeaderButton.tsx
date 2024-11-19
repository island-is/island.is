import { Icon } from '@island.is/island-ui/core'
import { ConfigType } from './types'

import * as styles from './SortableTable.css'

export const HeaderButton = ({
  headItem,
  sortConfig,
  requestSort,
  labels,
  index,
}: {
  headItem: string
  sortConfig: ConfigType
  requestSort: (key: string) => void
  labels: Record<string, string>
  index: number
}) => (
  <button
    type="button"
    onClick={() => requestSort(headItem)}
    className={styles.btn}
    key={`head-${headItem}-${index}`}
  >
    {labels[headItem] || ''}
    {sortConfig.key === headItem && (
      <Icon
        className={styles.chevron}
        color="dark400"
        icon={
          sortConfig.direction === 'ascending' ? 'chevronDown' : 'chevronUp'
        }
        size="small"
      />
    )}
  </button>
)
