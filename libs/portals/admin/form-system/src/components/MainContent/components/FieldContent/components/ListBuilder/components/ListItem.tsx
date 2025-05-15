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
import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { NavbarSelectStatus } from '../../../../../../../lib/utils/interfaces'
import { useIntl } from 'react-intl'
import * as styles from './ListItem.css'
import { getTranslation } from '../../../../../../../lib/utils/getTranslation'
import { useMutation } from '@apollo/client'
import {
  DELETE_LIST_ITEM,
  UPDATE_LIST_ITEM,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { FieldTypesEnum } from '@island.is/form-system/enums'

interface Props {
  listItem: FormSystemListItem
  connecting: boolean
  index: number
  setConnecting: Dispatch<SetStateAction<boolean[]>>
  toggleSelected: (id: string, checked: boolean) => void
}

export const ListItem = ({
  listItem,
  connecting,
  index,
  setConnecting,
  toggleSelected,
}: Props) => {
  const { control, controlDispatch, setFocus, focus, setSelectStatus } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const isRadio = currentItem.fieldType === FieldTypesEnum.RADIO_BUTTONS

  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: listItem.id ?? '',
    data: { listItem },
  })

  const { formatMessage } = useIntl()
  const [deleteListItem] = useMutation(DELETE_LIST_ITEM)
  const [updateListItem] = useMutation(UPDATE_LIST_ITEM)

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

  const listItemUpdate = () => {
    try {
      updateListItem({
        variables: {
          input: {
            id: listItem.id,
            updateListItemDto: {
              label: listItem.label,
              description: listItem.description,
              isSelected: listItem.isSelected,
            },
          },
        },
      })
    } catch (e) {
      console.error('Error updating list item', e)
    }
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
          style={{ width: '50%' }}
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
            onChange={(e) => {
              toggleSelected(listItem.id ?? '', e)
              controlDispatch({
                type: 'SET_LIST_ITEM_SELECTED',
                payload: {
                  id: listItem.id ?? '',
                },
              })
            }}
          />
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box
            marginRight={2}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              controlDispatch({
                type: 'REMOVE_LIST_ITEM',
                payload: {
                  id: listItem.id ?? '',
                },
              })
              deleteListItem({
                variables: {
                  input: {
                    id: listItem.id ?? '',
                  },
                },
              })
            }}
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
            onBlur={(e) => e.target.value !== focus && listItemUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_LIST_ITEM',
                payload: {
                  property: 'label',
                  lang: 'is',
                  value: e.target.value,
                  id: listItem.id ?? '',
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
            onBlur={(e) => e.target.value !== focus && listItemUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_LIST_ITEM',
                payload: {
                  property: 'label',
                  lang: 'en',
                  value: e.target.value,
                  id: listItem.id ?? '',
                },
              })
            }
            buttons={[
              {
                label: 'Translate',
                name: 'reader',
                onClick: async () => {
                  const translation = await getTranslation(
                    listItem?.label?.is ?? '',
                  )
                  controlDispatch({
                    type: 'CHANGE_LIST_ITEM',
                    payload: {
                      property: 'label',
                      lang: 'en',
                      value: translation ?? '',
                      id: listItem.id ?? '',
                    },
                  })
                },
              },
            ]}
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
              onBlur={(e) => e.target.value !== focus && listItemUpdate()}
              onChange={(e) =>
                controlDispatch({
                  type: 'CHANGE_LIST_ITEM',
                  payload: {
                    property: 'description',
                    lang: 'is',
                    value: e.target.value,
                    id: listItem.id ?? '',
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
              onBlur={(e) => e.target.value !== focus && listItemUpdate()}
              onChange={(e) =>
                controlDispatch({
                  type: 'CHANGE_LIST_ITEM',
                  payload: {
                    property: 'description',
                    lang: 'en',
                    value: e.target.value,
                    id: listItem.id ?? '',
                  },
                })
              }
              buttons={[
                {
                  label: 'Translate',
                  name: 'reader',
                  onClick: async () => {
                    const translation = await getTranslation(
                      listItem?.description?.is ?? '',
                    )
                    controlDispatch({
                      type: 'CHANGE_LIST_ITEM',
                      payload: {
                        property: 'description',
                        lang: 'en',
                        value: translation ?? '',
                        id: listItem.id ?? '',
                      },
                    })
                  },
                },
              ]}
            />
          </Column>
        </Row>
      )}
    </Box>
  )
}
