import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NavComponent.css'
import { UniqueIdentifier } from '@dnd-kit/core'
import NavButtons from './components/NavButtons'
import {
  FormSystemGroup,
  FormSystemInput,
  FormSystemStep,
} from '@island.is/api/schema'
import { ItemType } from '../../../../lib/utils/interfaces'

type Props = {
  type: ItemType
  data: FormSystemStep | FormSystemGroup | FormSystemInput
  active: boolean
  index?: number
  focusComponent(type: ItemType, id: UniqueIdentifier): void
}

export default function NavComponent({
  type,
  data,
  active,
  index,
  focusComponent,
}: Props) {
  const [editMode] = useState(false)

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const truncateName = (name: string) => {
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
      onClick={() => focusComponent(type, data.guid as UniqueIdentifier)}
    >
      {active ? (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
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
            {truncateName(data?.name?.is as string)}
          </Box>
          <Box
            style={{
              marginLeft: 'auto',
              verticalAlign: 'middle',
            }}
          >
            {!(
              type === 'Step' && (data as FormSystemStep).type !== 'Innsláttur'
            ) && <NavButtons />}
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
            {index}
          </Box>
          <Box id="2" paddingLeft={1}>
            {truncateName(data?.name?.is as string)}
          </Box>
        </Box>
      )}
    </Box>
  )
}
