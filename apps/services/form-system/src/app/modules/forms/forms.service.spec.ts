import { FamilyTypes } from '@island.is/form-system/enums'
import { FieldTypesEnum } from '@island.is/form-system/shared'

import { FormsService } from './forms.service'
import { Form } from './models/form.model'
import { ApplicationJsonDto } from '../applications/models/dto/application.json.dto'

describe('FormsService JSON sample', () => {
  const service = Object.create(FormsService.prototype) as {
    mapFormToJsonSample: (form: Form) => ApplicationJsonDto
  }

  it.each([
    [FamilyTypes.CHILD, ['nationalId', 'name']],
    [FamilyTypes.NATIONAL_ID_ESTATE, ['nationalId', 'name']],
    [FamilyTypes.SPOUSE, ['nationalId', 'name', 'maritalStatus']],
  ])('selects the value keys for %s', (familyType, expectedKeys) => {
    const form = {
      sections: [
        {
          screens: [
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.FAMILY,
                  fieldSettings: { familyType },
                },
              ],
            },
          ],
        },
      ],
    } as Form

    const sample = service.mapFormToJsonSample(form)
    const field = sample.fields[0]

    expect(field.fieldSettings?.familyType).toBe(familyType)
    expect(Object.keys(field.values[0].json)).toEqual(expectedKeys)
    expect(field.values[0].json).toMatchObject({
      nationalId: '0101302399',
      name: 'Test Nafn',
    })
    if (familyType === FamilyTypes.SPOUSE) {
      expect(field.values[0].json.maritalStatus).toBeTruthy()
    }
  })
})
