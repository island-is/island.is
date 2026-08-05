import { FormSystemField } from '@island.is/api/schema'
import { Checkbox } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { FieldTypesEnum } from 'libs/portals/form-system/ui-components/src/lib/enums'

export const NationalIdSettings = () => {
  const { control, controlDispatch, updateActiveItem, fieldTypes } =
    useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField

  return (
    fieldTypes?.some(
      (ft) => ft?.id === FieldTypesEnum.NATIONAL_ID_WITH_ADDRESS,
    ) && (
      <Checkbox
        label="Sýna heimilisfang"
        checked={currentItem.fieldSettings?.showAddress ?? false}
        disabled={control.isReadOnly}
        onChange={(e) =>
          controlDispatch({
            type: 'SET_ANY_FIELD_SETTING',
            payload: {
              property: 'showAddress',
              value: e.target.checked,
              update: updateActiveItem,
            },
          })
        }
      />
    )
  )
}
