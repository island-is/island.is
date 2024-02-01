import { useState } from 'react'
import { ItemType, IGroup, IInput, IStep } from '../../../../types/interfaces'
import { useSortable } from '@dnd-kit/sortable'
import { Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NavComponent.css'
import { UniqueIdentifier } from '@dnd-kit/core'
import NavButtons from './components/NavButtons'
//import NavButtons from "./components/navButtons"

type Props = {
  type: ItemType
  data: IStep | IGroup | IInput
  active: boolean
  index?: number
  focusComponent(type: ItemType, id: UniqueIdentifier): void
  add(type: 'Step' | 'Group', parentId: number): void
  remove(
    type: 'Step' | 'Group' | 'Input',
    guid: UniqueIdentifier,
    id: number,
  ): void
}

export default function NavComponent({
  type,
  data,
  active,
  index,
  focusComponent,
  add,
  remove,
}: Props) {
  const [editMode] = useState(false)

  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: data.guid,
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
          [styles.navComponent.step]: type === 'Step',
          [styles.navComponent.group]: type === 'Group',
          [styles.navComponent.input]: type === 'Input',
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
      ref={setNodeRef}
      className={cn({
        [styles.navComponent.step]: type === 'Step',
        [styles.navComponent.group]: type === 'Group',
        [styles.navComponent.input]: type === 'Input',
      })}
      {...listeners}
      {...attributes}
      onClick={() => focusComponent(type, data.guid)}
    >
      {active ? (
        // Active
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            //display="flex"
            //flexShrink={0}
            className={cn({
              [styles.navBackgroundActive.step]: type === 'Step',
              [styles.navBackgroundActive.group]: type === 'Group',
              [styles.navBackgroundActive.input]: type === 'Input',
            })}
          >
            {index}
          </Box>
          <Box
            paddingLeft={2}
            style={{
              fontWeight: 'bold',
            }}
            overflow="hidden"
          >
            {truncateName(data.name.is)}
          </Box>
          <Box
            style={{
              marginLeft: 'auto',
              verticalAlign: 'middle',
            }}
          >
            {!(type === 'Step' && (data as IStep).type !== 'Innsláttur') && (
              <NavButtons add={add} remove={remove} />
            )}
          </Box>
        </Box>
      ) : (
        // Default
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
            {index}
          </Box>
          <Box id="2" paddingLeft={1}>
            {truncateName(data.name.is)}
          </Box>
        </Box>
      )}
    </Box>
  )

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  function truncateName(name) {
    let maxLength

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
}
