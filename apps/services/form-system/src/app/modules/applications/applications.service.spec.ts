import { User } from '@island.is/auth-nest-tools'
import {
  AssetTypes,
  FamilyTypes,
  FieldTypesEnum,
  FormStatus,
} from '@island.is/form-system/shared'
import { ApplicationsService } from './applications.service'

describe('ApplicationsService.create value JSON', () => {
  it.each([
    {
      fieldType: FieldTypesEnum.ASSETS,
      fieldSettings: { assetType: AssetTypes.REAL_ESTATE },
      expectedJson: {
        address: '',
        postalCode: '',
        municipality: '',
        propertyNumber: '',
      },
    },
    {
      fieldType: FieldTypesEnum.ASSETS,
      fieldSettings: { assetType: AssetTypes.VEHICLE },
      expectedJson: { color: null, model: '', registrationNumber: '' },
    },
    {
      fieldType: FieldTypesEnum.FAMILY,
      fieldSettings: { familyType: FamilyTypes.CHILD },
      expectedJson: { nationalId: '', name: '' },
    },
    {
      fieldType: FieldTypesEnum.FAMILY,
      fieldSettings: { familyType: FamilyTypes.NATIONAL_ID_ESTATE },
      expectedJson: { nationalId: '', name: '' },
    },
    {
      fieldType: FieldTypesEnum.FAMILY,
      fieldSettings: { familyType: FamilyTypes.SPOUSE },
      expectedJson: { nationalId: '', name: '', maritalStatus: '' },
    },
    {
      fieldType: FieldTypesEnum.TEXTBOX,
      fieldSettings: {},
      expectedJson: { text: '' },
    },
  ])(
    'persists only subtype keys for $fieldType with $fieldSettings',
    async ({ fieldType, fieldSettings, expectedJson }) => {
      const transaction = {}
      const createValue = jest.fn().mockResolvedValue(undefined)
      const service = {
        getForm: jest.fn().mockResolvedValue({
          id: 'form-id',
          status: FormStatus.IN_DEVELOPMENT,
          sections: [
            {
              screens: [
                { fields: [{ id: 'field-id', fieldType, fieldSettings }] },
              ],
            },
          ],
        }),
        isFakeUserAllowed: jest.fn().mockReturnValue(true),
        getAllowedLoginTypes: jest.fn().mockResolvedValue([]),
        getLoginTypes: jest.fn().mockResolvedValue([]),
        isLoginAllowed: jest.fn().mockReturnValue(true),
        hasDelegation: jest.fn().mockReturnValue(true),
        applicationModel: {
          create: jest.fn().mockResolvedValue({ id: 'application-id' }),
        },
        applicationEventModel: {
          create: jest.fn().mockResolvedValue(undefined),
        },
        valueModel: { create: createValue },
        sequelize: {
          transaction: jest
            .fn()
            .mockImplementation((callback) => callback(transaction)),
        },
        logger: { error: jest.fn() },
        getApplication: jest.fn().mockResolvedValue({ id: 'application-id' }),
      }
      const user = { nationalId: '0101307789' } as User

      await ApplicationsService.prototype.create.call(
        service as unknown as ApplicationsService,
        'form-slug',
        user,
      )

      expect(createValue).toHaveBeenCalledTimes(1)
      expect(createValue).toHaveBeenCalledWith(
        {
          fieldId: 'field-id',
          fieldType,
          applicationId: 'application-id',
          json: expectedJson,
        },
        { transaction },
      )
    },
  )
})
