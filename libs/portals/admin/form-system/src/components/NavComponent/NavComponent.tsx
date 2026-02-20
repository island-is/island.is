import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { Box, Checkbox, Icon, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { ItemType, NavbarSelectStatus } from '../../lib/utils/interfaces'
import { NavButtons } from './components/NavButtons'
import * as styles from './NavComponent.css'

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
  const {
    control,
    selectStatus,
    controlDispatch,
    formUpdate,
    inListBuilder,
    openComponents,
    setOpenComponents,
  } = useContext(ControlContext)
  const { activeItem, activeListItem, form } = control
  const activeGuid =
    selectStatus === NavbarSelectStatus.LIST_ITEM
      ? activeListItem?.id ?? ''
      : activeItem?.data?.id ?? ''

  const selectingIsOff = selectStatus === NavbarSelectStatus.OFF

  const connected = () => {
    const hasDependency = form.dependencies?.find((dep) => {
      return dep?.parentProp === activeGuid
    })
    if (hasDependency) {
      return hasDependency.childProps?.includes(data.id as string) ?? false
    }

    return false
  }

  const listIsConnected = () => {
    if (activeItem?.type === 'Field') {
      const currentItem = activeItem.data as FormSystemField
      if (
        currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
        currentItem.fieldType === FieldTypesEnum.RADIO_BUTTONS
      ) {
        const listItemIds =
          currentItem.list
            ?.map((item) => item?.id)
            .filter((id): id is string => Boolean(id)) ?? []
        const listItemDependencies = form.dependencies?.filter((dep) =>
          listItemIds.includes(dep?.parentProp as string),
        )
        if (listItemDependencies && listItemDependencies.length > 0) {
          return listItemDependencies.some((dep) =>
            dep?.childProps?.includes(data.id as string),
          )
        }
      }
    }
    return false
  }

  const showCheckbox = (): boolean =>
    (connected() || listIsConnected()) && !selectable && !inListBuilder

  const renderChevron = () => {
    const isSectionOrScreen = type === 'Section' || type === 'Screen'

    if (
      type === 'Section' &&
      (data as FormSystemSection).sectionType === SectionTypes.PARTIES
    ) {
      return
    }

    const isClosed =
      !openComponents.sections.includes(data.id) &&
      !openComponents.screens.includes(data.id)
    if (isSectionOrScreen && isClosed) {
      const hasChildren =
        type === 'Section'
          ? form.screens?.some((screen) => screen?.sectionId === data.id)
          : form.fields?.some((field) => field?.screenId === data.id)
      if (hasChildren) {
        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box
              className={cn(styles.chevronStyle)}
              onClick={() => {
                if (type === 'Section') {
                  setOpenComponents((prev) => ({
                    ...prev,
                    sections: prev.sections.includes(data.id)
                      ? prev.sections.filter((id) => id !== data.id)
                      : [...prev.sections, data.id as string],
                  }))
                }
                if (type === 'Screen') {
                  setOpenComponents((prev) => ({
                    ...prev,
                    screens: prev.screens.includes(data.id)
                      ? prev.screens.filter((id) => id !== data.id)
                      : [...prev.screens, data.id as string],
                  }))
                }
              }}
            >
              <Icon icon="chevronForward" size="small" color="dark300" />
            </Box>
          </Box>
        )
      }
    }
  }

  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: data.id as UniqueIdentifier,
    data: {
      type: type,
      data,
    },
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
            paddingLeft={1}
            overflow="hidden"
            display="flex"
            minWidth={0}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              id={`formSystem.${type.toLowerCase()}.name`}
              variant="medium"
              truncate={true}
              fontWeight="semiBold"
            >
              {data?.name?.is}
            </Text>
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
            ) &&
              selectingIsOff && <NavButtons id={data.id} type={type} />}
          </Box>
          {renderChevron()}
        </Box>
      ) : (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
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
          <Box
            data-testid="navcomponent-content"
            paddingLeft={1}
            display="flex"
            alignItems="center"
            flexGrow={1}
            minWidth={0}
            overflow="hidden"
            justifyContent="flexStart"
          >
            <Text
              id={`formSystem.${type.toLowerCase()}.name`}
              variant="medium"
              truncate={true}
            >
              {data?.name?.is}
            </Text>
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
            ) &&
              selectingIsOff && <NavButtons id={data.id} type={type} />}
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
          {showCheckbox() && (
            <Box className={cn(styles.selectableComponent)} marginLeft="auto">
              <Checkbox checked={true} disabled={true} />
            </Box>
          )}
          {renderChevron()}
        </Box>
      )}
    </Box>
  )
}
