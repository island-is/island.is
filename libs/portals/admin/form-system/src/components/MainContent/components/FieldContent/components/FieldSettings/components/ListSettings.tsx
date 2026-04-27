import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum, ListTypesEnum } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Button,
  GridColumn as Column,
  RadioButton,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'

export const ListSettings = () => {
  const { control, setInListBuilder, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField
  const [isCustom, setIsCustom] = useState(
    !currentItem.fieldSettings?.listType ||
      currentItem.fieldSettings?.listType === ListTypesEnum.CUSTOM,
  )

  const { formatMessage } = useLocale()

  const predeterminedLists = [
    { label: 'Landalisti', value: ListTypesEnum.COUNTRIES },
    // { label: 'Sveitarfélög', value: ListTypesEnum.MUNICIPALITIES },
    // { label: 'Póstnúmer', value: ListTypesEnum.POSTAL_CODES },
  ]

  const selectedPredetermined =
    predeterminedLists.find(
      (o) => o.value === currentItem.fieldSettings?.listType,
    ) ?? null

  const selectCustomRadio = () => {
    if (isReadOnly) return
    setIsCustom(true)
    controlDispatch({
      type: 'SET_LIST_TYPE',
      payload: { listType: ListTypesEnum.CUSTOM, update: updateActiveItem },
    })
  }

  const selectPredeterminedRadio = () => {
    if (isReadOnly) return
    setIsCustom(false)
  }

  return (
    <Stack space={2}>
      {currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <>
          <RadioButton
            id="listType-custom"
            name="listTypeMode"
            label={formatMessage(m.customList)}
            disabled={isReadOnly}
            checked={isCustom}
            onChange={selectCustomRadio}
          />

          <RadioButton
            id="listType-predetermined"
            name="listTypeMode"
            label={formatMessage(m.predeterminedLists)}
            disabled={isReadOnly}
            checked={!isCustom}
            onChange={selectPredeterminedRadio}
          />
        </>
      )}
      {isCustom && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          {formatMessage(m.listBuilder)}
        </Button>
      )}
      {!isCustom && (
        <Column span="5/10">
          <Select
            placeholder={formatMessage(m.chooseListType)}
            name="predeterminedLists"
            label={formatMessage(m.predeterminedLists)}
            options={predeterminedLists}
            value={selectedPredetermined}
            isDisabled={isReadOnly}
            backgroundColor="blue"
            onChange={(option) => {
              controlDispatch({
                type: 'SET_LIST_TYPE',
                payload: {
                  listType: option?.value ?? ListTypesEnum.CUSTOM,
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
