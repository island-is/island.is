import { UniqueIdentifier } from '@dnd-kit/core'
import {
  FormSystemStep,
  FormSystemGroup,
  FormSystemInput,
} from '@island.is/api/schema'
import { ItemType, NavbarSelectStatus } from '../../lib/utils/interfaces'
import { useSortable } from '@dnd-kit/sortable'
import { useContext, useState } from 'react'
import { ControlContext } from '../../context/ControlContext'
import * as styles from './NavComponent.css'
import cn from 'classnames'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { truncateName } from '../../lib/utils/truncateText'
import { NavButtons } from './components/NavButtons'

type Props = {
  type: ItemType
  data: FormSystemStep | FormSystemGroup | FormSystemInput
  active: boolean
  index?: number
  selectable?: boolean
  focusComponent?(type: ItemType, id: UniqueIdentifier): void
}

export const NavComponent = ({
  type,
  data,
  active,
  index,
  selectable,
  focusComponent,
}: Props) => {
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
  const [editMode] = useState(false)

  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: data.guid as UniqueIdentifier,
    data: {
      type: type,
      data,
    },
    disabled: editMode,
  })

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className={cn({
          [styles.navComponent.step]: type === 'Step' && focusComponent,
          [styles.navComponent.group]: type === 'Group' && focusComponent,
          [styles.navComponent.input]: type === 'Input' && focusComponent,
          [styles.navComponent.stepSelect]: type === 'Step' && !focusComponent,
          [styles.navComponent.groupSelect]:
            type === 'Group' && !focusComponent,
          [styles.navComponent.inputSelect]:
            type === 'Input' && !focusComponent,
        })}
      >
        <div
          className={cn({
            [styles.navBackgroundActive.step]: type === 'Step',
            [styles.navBackgroundActive.group]: type === 'Group',
            [styles.navBackgroundActive.input]: type === 'Input',
          })}
        ></div>
      </div>
    )
  }

  return (
    <Box
      className={cn({
        [styles.navComponent.step]: type === 'Step' && focusComponent,
        [styles.navComponent.group]: type === 'Group' && focusComponent,
        [styles.navComponent.input]: type === 'Input' && focusComponent,
        [styles.navComponent.stepSelect]: type === 'Step' && !focusComponent,
        [styles.navComponent.groupSelect]: type === 'Group' && !focusComponent,
        [styles.navComponent.inputSelect]: type === 'Input' && !focusComponent,
      })}
      {...(focusComponent && {
        ...listeners,
        ...attributes,
        onClick: () => focusComponent(type, data.guid as UniqueIdentifier),
      })}
      ref={setNodeRef}
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
            {focusComponent ? index : ''}
          </Box>
          <Box
            paddingLeft={2}
            style={{
              fontWeight: 'bold',
            }}
            overflow="hidden"
          >
            {truncateName(data?.name?.is ?? '', active, type)}
          </Box>
          {focusComponent && (
            <Box
              style={{
                marginLeft: 'auto',
                verticalAlign: 'middle',
              }}
            >
              {!(
                type === 'Step' && (data as FormSystemStep).type !== 'Input'
              ) && <NavButtons />}
            </Box>
          )}
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
            {truncateName(data?.name?.is ?? '', active, type)}
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
