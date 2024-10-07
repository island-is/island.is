import cn from 'classnames'
import * as styles from './selectNavComponent.css'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { useContext } from 'react'
import {
  FormSystemGroup,
  FormSystemInput,
  FormSystemStep,
} from '@island.is/api/schema'
import ControlContext from '../../../context/ControlContext'
import { ItemType, NavbarSelectStatus } from '../../../lib/utils/interfaces'

type Props = {
  type: ItemType
  data: FormSystemStep | FormSystemGroup | FormSystemInput
  active: boolean
  selectable: boolean
}

export default function SelectNavComponent({
  type,
  data,
  active,
  selectable,
}: Props) {
  const { control, selectStatus, controlDispatch, updateSettings } =
    useContext(ControlContext)
  const { activeItem, activeListItem, form } = control
  const activeGuid =
    selectStatus === NavbarSelectStatus.LIST_ITEM
      ? activeListItem?.guid ?? ''
      : activeItem?.data?.guid ?? ''
  const connected: boolean = form.dependencies[activeGuid]?.includes(
    data.guid as string,
  )

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const truncateName = (name: string) => {
    let maxLength: number

    if (active) {
      switch (type) {
        case 'Step':
          maxLength = 23
          break
        case 'Group':
          maxLength = 16
          break
        case 'Input':
          maxLength = 12
          break
        default:
          maxLength = 26
      }
    } else {
      switch (type) {
        case 'Step':
          maxLength = 26
          break
        case 'Group':
          maxLength = 19
          break
        case 'Input':
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
        [styles.navComponent.step]: type === 'Step',
        [styles.navComponent.group]: type === 'Group',
        [styles.navComponent.input]: type === 'Input',
      })}
    >
      {active ? (
        <Box display="flex" flexDirection="row">
          <Box
            className={cn({
              [styles.navBackgroundActive.step]: type === 'Step',
              [styles.navBackgroundActive.group]: type === 'Group',
              [styles.navBackgroundActive.input]: type === 'Input',
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
              [styles.navBackgroundDefault.step]: type === 'Step',
              [styles.navBackgroundDefault.group]: type === 'Group',
              [styles.navBackgroundDefault.input]: type === 'Input',
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
                checked={connected}
                onChange={() =>
                  controlDispatch({
                    type: 'TOGGLE_DEPENDENCY',
                    payload: {
                      activeId: activeGuid,
                      itemId: data.guid as string,
                      update: updateSettings,
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
