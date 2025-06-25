import { UniqueIdentifier } from '@dnd-kit/core'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
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
import { SectionTypes } from '@island.is/form-system/enums'

type Props = {
  type: ItemType
  data: FormSystemSection | FormSystemScreen | FormSystemField
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

  const [editMode] = useState(false)

  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: data.id as UniqueIdentifier,
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
          [styles.navComponent.step]: type === 'Section' && focusComponent,
          [styles.navComponent.group]: type === 'Screen' && focusComponent,
          [styles.navComponent.input]: type === 'Field' && focusComponent,
          [styles.navComponent.stepSelect]:
            type === 'Section' && !focusComponent,
          [styles.navComponent.groupSelect]:
            type === 'Screen' && !focusComponent,
          [styles.navComponent.inputSelect]:
            type === 'Field' && !focusComponent,
        })}
      >
        <div
          className={cn({
            [styles.navBackgroundActive.step]: type === 'Section',
            [styles.navBackgroundActive.group]: type === 'Screen',
            [styles.navBackgroundActive.input]: type === 'Field',
          })}
        ></div>
      </div>
    )
  }
  return (
    <Box
      className={cn({
        [styles.navComponent.step]: type === 'Section' && focusComponent,
        [styles.navComponent.group]: type === 'Screen' && focusComponent,
        [styles.navComponent.input]: type === 'Field' && focusComponent,
        [styles.navComponent.stepSelect]: type === 'Section' && !focusComponent,
        [styles.navComponent.groupSelect]: type === 'Screen' && !focusComponent,
        [styles.navComponent.inputSelect]: type === 'Field' && !focusComponent,
      })}
      {...(focusComponent && {
        ...listeners,
        ...attributes,
        onClick: () => focusComponent(type, data.id as UniqueIdentifier),
      })}
      ref={setNodeRef}
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
          <Box
            style={{
              marginLeft: 'auto',
              verticalAlign: 'middle',
            }}
          >
            {!(
              type === 'Section' &&
              (data as FormSystemSection).sectionType !== SectionTypes.INPUT
            ) && <NavButtons id={data.id} type={type} />}
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
            {truncateName(data?.name?.is ?? '', active, type)}
          </Box>
          <Box
            style={{
              marginLeft: 'auto',
              verticalAlign: 'middle',
            }}
          >
            {!(
              type === 'Section' &&
              (data as FormSystemSection).sectionType !== SectionTypes.INPUT
            ) && <NavButtons id={data.id} type={type} />}
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
