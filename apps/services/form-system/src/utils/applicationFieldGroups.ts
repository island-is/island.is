import {
  FieldTypesEnum,
  getHiddenMultisetFieldIds,
} from '@island.is/form-system/shared'
import { Dependency } from '../app/dataTypes/dependency.model'
import { FieldDto } from '../app/modules/fields/models/dto/field.dto'
import { ScreenDto } from '../app/modules/screens/models/dto/screen.dto'

interface ApplicationFieldGroup {
  number?: number
  fields: FieldDto[]
}

export const getApplicationFieldGroups = (
  screen: ScreenDto,
  dependencies?: Dependency[],
): ApplicationFieldGroup[] => {
  const fields = (screen.fields ?? []).filter((field) => !field.isHidden)
  const isRepeatedAnswer = (field: FieldDto) =>
    field.fieldType !== FieldTypesEnum.MESSAGE &&
    field.isPartOfMultiset !== false
  const firstRepeatedIndex = screen.isMulti
    ? fields.findIndex(isRepeatedAnswer)
    : -1
  if (firstRepeatedIndex === -1) return [{ fields }]

  const repeatedFields = fields.filter(isRepeatedAnswer)
  const itemCount = Math.max(
    1,
    ...repeatedFields.map((field) => field.values?.length ?? 0),
  )
  const groups: ApplicationFieldGroup[] = []
  const leadingFields = fields.slice(0, firstRepeatedIndex)
  if (leadingFields.length) groups.push({ fields: leadingFields })

  for (let index = 0; index < itemCount; index++) {
    const hiddenFields = getHiddenMultisetFieldIds(screen, dependencies, index)
    const groupFields = repeatedFields
      .filter((field) => !hiddenFields.has(field.id))
      .map((field) => ({
        ...field,
        values: field.values?.slice(index, index + 1),
      }))
    if (groupFields.length) {
      groups.push({
        number: itemCount > 1 ? index + 1 : undefined,
        fields: groupFields,
      })
    }
  }

  const trailingFields = fields
    .slice(firstRepeatedIndex)
    .filter((field) => !isRepeatedAnswer(field))
  if (trailingFields.length) groups.push({ fields: trailingFields })
  return groups
}
