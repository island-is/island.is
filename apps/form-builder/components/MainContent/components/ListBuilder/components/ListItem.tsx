import {
  GridRow as Row,
  GridColumn as Column,
  Box,
  Icon,
  ToggleSwitchCheckbox,
  Input,
} from '@island.is/island-ui/core'
import { Dispatch, useContext, useState, SetStateAction } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IListItem, NavbarSelectStatus } from '../../../../../types/interfaces'
import { translationStation } from '../../../../../services/translationStation'

type Props = {
  listItem: IListItem
  isRadio: boolean
  connecting: boolean
  index: number
  setConnecting: Dispatch<SetStateAction<boolean[]>>
}
export default function ListItem({
  listItem,
  isRadio,
  connecting,
  setConnecting,
  index,
}: Props) {
  const [connect, setConnect] = useState(false)
  const { listsDispatch, setSelectStatus, setActiveListItem, onFocus, blur } =
    useContext(FormBuilderContext)
  const { setNodeRef, attributes, listeners, isDragging } = useSortable({
    id: listItem.guid,
    data: {
      listItem,
    },
  })
  if (isDragging) {
    return (
      <Box
        border="focus"
        borderWidth="large"
        borderRadius="standard"
        padding={2}
        marginTop={2}
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
              label="Tengja"
              checked={connect}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
            />
            <ToggleSwitchCheckbox
              label="Sjálfvalið"
              checked={listItem.isSelected}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
            />
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box
              marginRight={2}
              style={{ cursor: 'pointer' }}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {}}
            >
              <Icon icon="trash" color="blue400" />
            </Box>
            <Box style={{ cursor: 'grab' }}>
              <Icon icon="menu" />
            </Box>
          </Box>
        </Box>
        <Row>
          <Column span="5/10">
            <Input
              name="dummy"
              label="Heiti"
              backgroundColor="blue"
              size="sm"
              value={listItem.label.is}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
            />
          </Column>
          <Column span="5/10">
            <Input
              name="dummy"
              label="Heiti (enska)"
              backgroundColor="blue"
              size="sm"
              value={listItem.label.en}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
            />
          </Column>
        </Row>
      </Box>
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
            label="Tengja"
            checked={connecting}
            onChange={(e) => {
              setConnect(e)
              setSelectStatus(() =>
                e
                  ? NavbarSelectStatus.LIST_ITEM
                  : NavbarSelectStatus.ON_WITHOUT_SELECT,
              )
              setConnecting((prev) =>
                prev.map((l, i) => (i === index ? e : false)),
              )
              setActiveListItem(e ? listItem : null)
            }}
          />
          <ToggleSwitchCheckbox
            label="Sjálfvalið"
            checked={listItem.isSelected}
            onChange={(e) =>
              listsDispatch({
                type: 'setListItemSelected',
                payload: {
                  guid: listItem.guid,
                  checked: e,
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
              listsDispatch({
                type: 'removeListItem',
                payload: {
                  guid: listItem.guid,
                },
              })
            }
          >
            <Icon icon="trash" color="blue400" />
          </Box>
          <Box
          // {...listeners}
          // {...attributes}
          // style={{ cursor: 'grab' }}
          >
            <Icon icon="menu" />
          </Box>
        </Box>
      </Box>
      <Row>
        <Column span="5/10">
          <Input
            name="name"
            label="Heiti"
            backgroundColor="blue"
            size="sm"
            value={listItem.label.is}
            onBlur={blur}
            onFocus={(
              event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onFocus(event.target.value)}
            onChange={(e) =>
              listsDispatch({
                type: 'setListItem',
                payload: {
                  property: 'label',
                  lang: 'is',
                  value: e.target.value,
                  listItemGuid: listItem.guid,
                },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Input
            name="nameEn"
            label="Heiti (enska)"
            backgroundColor="blue"
            size="sm"
            value={listItem.label.en}
            onBlur={blur}
            onFocus={(
              event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onFocus(event.target.value)}
            onChange={(e) =>
              listsDispatch({
                type: 'setListItem',
                payload: {
                  property: 'label',
                  lang: 'en',
                  value: e.target.value,
                  listItemGuid: listItem.guid,
                },
              })
            }
            buttons={[
              {
                label: 'translate',
                name: 'reader',
                onClick: async () => {
                  const translation = await translationStation(
                    listItem.label.is,
                  )
                  listsDispatch({
                    type: 'setListItem',
                    payload: {
                      property: 'label',
                      lang: 'en',
                      value: translation,
                      listItemGuid: listItem.guid,
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
              label="Upplýsingabóla"
              backgroundColor="blue"
              size="sm"
              value={listItem.description.is}
              onBlur={blur}
              onFocus={(
                event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => onFocus(event.target.value)}
              onChange={(e) =>
                listsDispatch({
                  type: 'setListItem',
                  payload: {
                    property: 'description',
                    lang: 'is',
                    value: e.target.value,
                    listItemGuid: listItem.guid,
                  },
                })
              }
            />
          </Column>
          <Column span="5/10">
            <Input
              name="info"
              label="Upplýsingabóla (enska)"
              backgroundColor="blue"
              size="sm"
              value={listItem.description.en}
              onBlur={blur}
              onFocus={(
                event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => onFocus(event.target.value)}
              onChange={(e) =>
                listsDispatch({
                  type: 'setListItem',
                  payload: {
                    property: 'description',
                    lang: 'en',
                    value: e.target.value,
                    listItemGuid: listItem.guid,
                  },
                })
              }
              buttons={[
                {
                  label: 'translate',
                  name: 'reader',
                  onClick: async () => {
                    const translation = await translationStation(
                      listItem.description.is,
                    )
                    listsDispatch({
                      type: 'setListItem',
                      payload: {
                        property: 'description',
                        lang: 'en',
                        value: translation,
                        listItemGuid: listItem.guid,
                      },
                    })
                  },
                },
              ]}
            />
          </Column>
        </Row>
      )}
      {/* <Row marginTop={5}>
        <Column span="10/10">
          <Divider weight="regular" />
        </Column>
      </Row> */}
    </Box>
  )
}
