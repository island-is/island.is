import { Icon } from '@island.is/island-ui/core'
import { ConfigType } from './types'

import * as styles from './SortableTable.css'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const HeaderButton = ({
  headItem,
  sortConfig,
  requestSort,
  labels,
  index,
  align = 'left',
}: {
  headItem: string
  sortConfig: ConfigType
  requestSort: (key: string) => void
  labels: Record<string, string>
  index: number
  align?: 'left' | 'right'
}) => {
  const { formatMessage } = useLocale()

  if (!headItem || headItem === '') return
  return (
    <button
      type="button"
      onClick={() => requestSort(headItem)}
      className={styles.btn}
      style={{ textAlign: align }}
      key={`header-${headItem}-${index}-${sortConfig.direction}`}
      aria-label={`${formatMessage(m.sortBy)} ${labels[headItem] || headItem} ${
        sortConfig.key === headItem ? `(${sortConfig.direction})` : ''
      }`}
    >
      {labels[headItem] || headItem}
      {sortConfig.key === headItem && (
        <Icon
          className={styles.chevron}
          color="blue400"
          icon={sortConfig.direction === 'ascending' ? 'caretUp' : 'caretDown'}
          size="small"
        />
      )}
    </button>
  )
}
