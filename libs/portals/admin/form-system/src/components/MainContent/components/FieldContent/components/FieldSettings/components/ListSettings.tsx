import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum, ListTypesEnum } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridColumn as Column,
  RadioButton,
  GridRow as Row,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'

const predeterminedLists = [
  {
    label: 'Landalisti',
    value: 0,
  },
  // {
  //   label: 'Sveitarfélög',
  //   value: 1,
  // },
  // {
  //   label: 'Póstnúmer',
  //   value: 2,
  // },
  // {
  //   label: 'Gjaldmiðlar',
  //   value: 3,
  // }
]

export const ListSettings = () => {
  const { control, setInListBuilder, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem, isReadOnly } = control
  const { dependencies } = control.form
  const currentItem = activeItem.data as FormSystemField
  const [radio, setRadio] = useState([true, false, false])
  const radioHandler = (index: number) => {
    setRadio((prev) =>
      prev.map((_, i) => {
        return index === i
      }),
    )
  }

  const { formatMessage } = useLocale()

  const listTypes = [
    ListTypesEnum.COUNTRIES,
    ListTypesEnum.MUNICIPALITIES,
    ListTypesEnum.POSTAL_CODES,
  ]
  const getListType = (index: number) =>
    listTypes[index] || ListTypesEnum.CUSTOM

  const onClickRadioHandler = (index: number) => {
    radioHandler(index)
    controlDispatch({
      type: 'SET_LIST_TYPE',
      payload: {
        listType: index === 0 ? ListTypesEnum.CUSTOM : 'other',
        update: updateActiveItem,
      },
    })
  }

  const hasDependency = (): boolean => {
    const listItemIds = Array.from(
      new Set(
        currentItem.list
          ?.map((item) => item?.id)
          .filter((id) => id !== undefined),
      ),
    ) as string[]
    return (
      dependencies?.some(
        (dep) =>
          listItemIds.includes(dep?.parentProp as string) ||
          dep?.childProps?.some((child) =>
            listItemIds.includes(child as string),
          ),
      ) ?? false
    )
  }

  return (
    <Stack space={2}>
      {currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <>
          <Row>
            <Column>
              <Box onClick={() => onClickRadioHandler(0)}>
                <RadioButton
                  label={formatMessage(m.customList)}
                  disabled={isReadOnly}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                  checked={radio[0]}
                />
              </Box>
            </Column>
          </Row>
          <Row>
            <Column>
              <Box onClick={() => onClickRadioHandler(1)}>
                <RadioButton
                  label={formatMessage(m.predeterminedLists)}
                  disabled={isReadOnly}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                  checked={radio[1]}
                />
              </Box>
            </Column>
          </Row>
        </>
      )}
      {radio[0] && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          {formatMessage(m.listBuilder)}
        </Button>
      )}
      {radio[1] && (
        <Column span="5/10">
          <Select
            placeholder={formatMessage(m.chooseListType)}
            name="predeterminedLists"
            label={formatMessage(m.predeterminedLists)}
            options={predeterminedLists}
            isDisabled={isReadOnly}
            backgroundColor="blue"
            onChange={(option) => {
              const listType = getListType(option?.value as number)
              controlDispatch({
                type: 'SET_LIST_TYPE',
                payload: {
                  listType: listType,
                  update: updateActiveItem,
                },
              })
            }}
          />
        </Column>
      )}
    </Stack>
  )
}
