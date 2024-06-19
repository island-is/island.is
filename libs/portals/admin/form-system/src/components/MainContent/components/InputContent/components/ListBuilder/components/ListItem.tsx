import {
  GridRow as Row,
  GridColumn as Column,
  Box,
  Icon,
  ToggleSwitchCheckbox,
  Input,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { useSortable } from '@dnd-kit/sortable'
import { FormSystemInput, FormSystemListItem } from '@island.is/api/schema'
import { NavbarSelectStatus } from '../../../../../../../lib/utils/interfaces'
import { useIntl } from 'react-intl'
import { m } from '../../../../../../../lib/messages'
import * as styles from './ListItem.css'

interface Props {
  listItem: FormSystemListItem
  connecting: boolean
  index: number
  setConnecting: Dispatch<SetStateAction<boolean[]>>
}

export const ListItem = ({
  listItem,
  connecting,
  index,
  setConnecting,
}: Props) => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    setSelectStatus,
    updateActiveItem,
  } = useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemInput
  const isRadio = currentItem.type === 'Radio_buttons'

  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: listItem.guid ?? '',
    data: { listItem },
  })

  const { formatMessage } = useIntl()

  if (isDragging) {
    return (
      <Box
        border="focus"
        borderWidth="large"
        borderRadius="standard"
        padding={2}
        marginTop={2}
        className={styles.draggingBox}
      ></Box>
    )
  }

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ cursor: 'grab' }}
      border="standard"
      padding={2}
      marginTop={1}
      borderRadius="standard"
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginTop={2}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          style={{ width: '30%' }}
          justifyContent="spaceBetween"
        >
          <ToggleSwitchCheckbox
            label={formatMessage(m.connect)}
            checked={connecting}
            onChange={(e) => {
              setSelectStatus(
                e
                  ? NavbarSelectStatus.LIST_ITEM
                  : NavbarSelectStatus.ON_WITHOUT_SELECT,
              )
              setConnecting((prev) =>
                prev.map((_, i) => (i === index ? e : false)),
              )
              controlDispatch({
                type: 'SET_ACTIVE_LIST_ITEM',
                payload: { listItem: e ? listItem : null },
              })
            }}
          />
          <ToggleSwitchCheckbox
            label={formatMessage(m.selected)}
            checked={listItem.isSelected ?? false}
            onChange={() =>
              controlDispatch({
                type: 'SET_LIST_ITEM_SELECTED',
                payload: {
                  guid: listItem.guid ?? '',
                  update: updateActiveItem,
                },
              })
            }
          />
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box
            marginRight={2}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              controlDispatch({
                type: 'REMOVE_LIST_ITEM',
                payload: {
                  guid: listItem.guid ?? '',
                  update: updateActiveItem,
                },
              })
            }
          >
            <Icon icon="trash" color="blue400" />
          </Box>
          <div>
            <Icon icon="menu" />
          </div>
        </Box>
      </Box>
      <Row>
        <Column span="5/10">
          <Input
            name="name"
            label={formatMessage(m.name)}
            backgroundColor="blue"
            size="sm"
            value={listItem?.label?.is ?? ''}
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_LIST_ITEM',
                payload: {
                  property: 'label',
                  lang: 'is',
                  value: e.target.value,
                  guid: listItem.guid ?? '',
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Input
            name="nameEn"
            label={formatMessage(m.nameEnglish)}
            backgroundColor="blue"
            size="sm"
            value={listItem?.label?.en ?? ''}
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_LIST_ITEM',
                payload: {
                  property: 'label',
                  lang: 'en',
                  value: e.target.value,
                  guid: listItem.guid ?? '',
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>

      {isRadio && (
        <Row marginTop={2}>
          <Column span="5/10">
            <Input
              name="info"
              label={formatMessage(m.info)}
              backgroundColor="blue"
              size="sm"
              value={listItem?.description?.is ?? ''}
              onFocus={(e) => setFocus(e.target.value)}
              onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              onChange={(e) =>
                controlDispatch({
                  type: 'CHANGE_LIST_ITEM',
                  payload: {
                    property: 'description',
                    lang: 'is',
                    value: e.target.value,
                    guid: listItem.guid ?? '',
                    update: updateActiveItem,
                  },
                })
              }
            />
          </Column>
          <Column span="5/10">
            <Input
              name="info"
              label={formatMessage(m.infoEnglish)}
              backgroundColor="blue"
              size="sm"
              value={listItem?.description?.en ?? ''}
              onFocus={(e) => setFocus(e.target.value)}
              onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              onChange={(e) =>
                controlDispatch({
                  type: 'CHANGE_LIST_ITEM',
                  payload: {
                    property: 'description',
                    lang: 'en',
                    value: e.target.value,
                    guid: listItem.guid ?? '',
                    update: updateActiveItem,
                  },
                })
              }
            />
          </Column>
        </Row>
      )}
    </Box>
  )
}
