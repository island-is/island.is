import { Checkbox, Table as T, Text, Icon } from '@island.is/island-ui/core'
import { Fragment, useState } from 'react'
import { tableRowBackgroundColor } from '../../utils/helpers/'
import SubscriptionChoices from '../SubscriptionChoices/SubscriptionChoices'

import * as styles from './SubscriptionTableItem.css'

const SubscriptionTableItem = ({
  item,
  idx,
  checkboxStatus,
  onCheckboxChange,
  currentTab,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => {
    setIsOpen(!isOpen)
  }

  const borderColor = 'transparent'

  return (
    <Fragment>
      <T.Row>
        <T.Data
          borderColor={borderColor}
          box={{
            className: styles.tableRowLeft,
            background: tableRowBackgroundColor(idx),
          }}
        >
          <Checkbox
            checked={checkboxStatus(item.id)}
            onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
          />
        </T.Data>
        {currentTab === 'Mál' && (
          <T.Data
            borderColor={borderColor}
            box={{
              background: tableRowBackgroundColor(idx),
            }}
          >
            <Text variant="h5">{item.caseNumber}</Text>
          </T.Data>
        )}
        <T.Data
          borderColor={borderColor}
          box={{
            background: tableRowBackgroundColor(idx),
          }}
        >
          <Text variant={currentTab === 'Mál' ? 'medium' : 'h5'}>
            {item.name}
          </Text>
        </T.Data>
        <T.Data
          borderColor={borderColor}
          box={{
            className: styles.tableRowRight,
            background: tableRowBackgroundColor(idx),
          }}
          align="right"
        >
          <div onClick={onClick} style={{ height: '24px' }}>
            <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} color="blue400" />
          </div>
        </T.Data>
      </T.Row>
      {isOpen && (
        <T.Row>
          <T.Data
            colSpan={4}
            borderColor={borderColor}
            box={{
              paddingTop: 'none',
              background: tableRowBackgroundColor(idx),
            }}
          >
            <SubscriptionChoices />
          </T.Data>
        </T.Row>
      )}
    </Fragment>
  )
}

export default SubscriptionTableItem
