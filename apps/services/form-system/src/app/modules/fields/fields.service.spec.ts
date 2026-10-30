import { User } from '@island.is/auth-nest-tools'
import { FieldTypesEnum } from '@island.is/form-system/shared'

import { Form } from '../forms/models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Screen } from '../screens/models/screen.model'
import { Section } from '../sections/models/section.model'
import { FieldsService } from './fields.service'
import { Field } from './models/field.model'

describe('FieldsService.update', () => {
  const user = { nationalId: 'owner', scope: [] } as unknown as User
  const fieldTypes = [
    FieldTypesEnum.CHECKBOX,
    FieldTypesEnum.DROPDOWN_LIST,
    FieldTypesEnum.RADIO_BUTTONS,
  ]

  const setup = (fieldType: string) => {
    const field = {
      id: 'field-id',
      identifier: 'old-identifier',
      screenId: 'screen-id',
      fieldType,
      list: [{ id: 'list-item-id' }],
      save: jest.fn().mockResolvedValue(undefined),
    }
    const parentProp =
      fieldType === FieldTypesEnum.CHECKBOX ? field.id : field.list[0].id
    const dependencies = [
      { parentProp, childProps: ['child-id'] },
      { parentProp: 'other-parent-id', childProps: ['other-child-id'] },
    ]
    const form = {
      organizationNationalId: user.nationalId,
      dependencies,
      save: jest.fn().mockResolvedValue(undefined),
    }
    const destroy = jest.fn().mockResolvedValue(1)
    const service = new FieldsService(
      {
        findByPk: jest.fn().mockResolvedValue(field),
      } as unknown as typeof Field,
      {
        findByPk: jest.fn().mockResolvedValue({ sectionId: 'section-id' }),
      } as unknown as typeof Screen,
      {
        findByPk: jest.fn().mockResolvedValue({ formId: 'form-id' }),
      } as unknown as typeof Section,
      { findByPk: jest.fn().mockResolvedValue(form) } as unknown as typeof Form,
      { destroy } as unknown as typeof ListItem,
    )

    return { service, field, form, dependencies, destroy }
  }

  describe.each(fieldTypes)('%s', (fieldType) => {
    it.each([false, true])(
      'preserves dependencies when renaming (includes field type: %s)',
      async (includeFieldType) => {
        const { service, field, form, dependencies, destroy } = setup(fieldType)

        await service.update(user, field.id, {
          identifier: 'new-identifier',
          ...(includeFieldType ? { fieldType } : {}),
        })

        expect(field.identifier).toBe('new-identifier')
        expect(field.save).toHaveBeenCalledTimes(1)
        expect(form.dependencies).toBe(dependencies)
        expect(form.save).not.toHaveBeenCalled()
        expect(destroy).not.toHaveBeenCalled()
      },
    )

    it('still removes parent dependencies when the field type changes', async () => {
      const { service, field, form, dependencies, destroy } = setup(fieldType)

      await service.update(user, field.id, {
        fieldType: FieldTypesEnum.TEXTBOX,
      })

      expect(form.dependencies).toEqual([dependencies[1]])
      expect(form.save).toHaveBeenCalledTimes(1)
      expect(field.fieldType).toBe(FieldTypesEnum.TEXTBOX)
      expect(field.save).toHaveBeenCalledTimes(1)
      if (fieldType === FieldTypesEnum.CHECKBOX) {
        expect(destroy).not.toHaveBeenCalled()
      } else {
        expect(destroy).toHaveBeenCalledWith({ where: { fieldId: field.id } })
      }
    })
  })
})
