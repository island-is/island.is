import cn from 'classnames'
import * as styles from './selectNavComponent.css'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { useContext } from 'react'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
} from '@island.is/api/schema'

import { ItemType, NavbarSelectStatus } from '../../../lib/utils/interfaces'
import { ControlContext } from '../../../context/ControlContext'

type Props = {
  type: ItemType
  data: FormSystemField | FormSystemSection | FormSystemScreen
  active: boolean
  selectable: boolean
}

export default function SelectNavComponent({
  type,
  data,
  active,
  selectable,
}: Props) {
  const { control, selectStatus, controlDispatch, formUpdate } =
    useContext(ControlContext)
  const { activeItem, activeListItem, form } = control
  const activeGuid =
    selectStatus === NavbarSelectStatus.LIST_ITEM
      ? activeListItem?.id ?? ''
      : activeItem?.data?.id ?? ''

  const connected = () => {
    const hasDependency = form.dependencies?.find((dep) => {
      return dep?.parentProp === activeGuid
    })
    if (hasDependency) {
      return hasDependency.childProps?.includes(data.id as string) ?? false
    }
    return false
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const truncateName = (name: string) => {
    let maxLength: number

    if (active) {
      switch (type) {
        case 'Section':
          maxLength = 23
          break
        case 'Screen':
          maxLength = 16
          break
        case 'Field':
          maxLength = 12
          break
        default:
          maxLength = 26
      }
    } else {
      switch (type) {
        case 'Section':
          maxLength = 26
          break
        case 'Screen':
          maxLength = 19
          break
        case 'Field':
          maxLength = 16
          break
        default:
          maxLength = 26
      }
    }

    return truncateText(name, maxLength)
  }

  return (
    <Box
      className={cn({
        [styles.navComponent.step]: type === 'Section',
        [styles.navComponent.group]: type === 'Screen',
        [styles.navComponent.input]: type === 'Field',
      })}
    >
      {active ? (
        <Box display="flex" flexDirection="row">
          <Box
            className={cn({
              [styles.navBackgroundActive.step]: type === 'Section',
              [styles.navBackgroundActive.group]: type === 'Screen',
              [styles.navBackgroundActive.input]: type === 'Field',
            })}
          >
            {/* Index */}
          </Box>
          <Box
            paddingLeft={2}
            style={{
              fontWeight: 'bold',
            }}
            overflow="hidden"
          >
            {truncateName(data?.name?.is ?? '')}
          </Box>
        </Box>
      ) : (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
          overflow="hidden"
        >
          <Box
            id="1"
            className={cn({
              [styles.navBackgroundDefault.step]: type === 'Section',
              [styles.navBackgroundDefault.group]: type === 'Screen',
              [styles.navBackgroundDefault.input]: type === 'Field',
            })}
          >
            {/* {index} */}
          </Box>
          <Box id="2" paddingLeft={1}>
            {truncateName(data?.name?.is ?? '')}
          </Box>
          {selectable && (
            <Box className={cn(styles.selectableComponent)} marginLeft="auto">
              <Checkbox
                checked={connected()}
                onChange={() =>
                  controlDispatch({
                    type: 'TOGGLE_DEPENDENCY',
                    payload: {
                      activeId: activeGuid,
                      itemId: data.id as string,
                      update: formUpdate,
                    },
                  })
                }
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
