import { FamilyTypes } from '@island.is/form-system/enums'
import {
  FieldTypesEnum,
  FormStatus,
  SectionTypes,
} from '@island.is/form-system/shared'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { randomUUID } from 'crypto'
import { UniqueConstraintError } from 'sequelize'

import { FormsService } from './forms.service'
import { Form } from './models/form.model'
import { ApplicationJsonDto } from '../applications/models/dto/application.json.dto'
import { User } from '@island.is/auth-nest-tools'

describe('FormsService import', () => {
  const user = { nationalId: 'destination', scope: [] } as unknown as User
  const setup = () => {
    const ids = Array.from({ length: 5 }, () => randomUUID())
    const form = {
      id: ids[0],
      identifier: randomUUID(),
      name: { is: 'Test', en: 'Test' },
      slug: 'test',
      organizationId: 'source-org',
      organizationNationalId: 'source',
      status: FormStatus.PUBLISHED,
      beenPublished: true,
      derivedFrom: randomUUID(),
      submissionServiceUrl: 'https://example.is/submit',
      sectionInfo: { title: { is: 'Title', en: 'Title' } },
      delegations: ['delegation'],
      sections: [
        {
          id: ids[1],
          identifier: randomUUID(),
          name: { is: 'Section' },
          displayOrder: 0,
          sectionType: SectionTypes.INPUT,
          screens: [
            {
              id: ids[2],
              identifier: 'screen',
              name: { is: 'Screen' },
              displayOrder: 0,
              fields: [
                {
                  id: ids[3],
                  identifier: 'field',
                  name: { is: 'Field' },
                  displayOrder: 0,
                  fieldType: FieldTypesEnum.TEXTBOX,
                  fieldSettings: { maxLength: 20 },
                  list: [
                    {
                      id: ids[4],
                      identifier: randomUUID(),
                      displayOrder: 0,
                      label: { is: 'Option' },
                      value: 'option',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      dependencies: [
        {
          parentProp: ids[4],
          childProps: [ids[1], ids[2], ids[3]],
          isSelected: true,
        },
      ],
      formCertificationTypes: [
        { id: randomUUID(), certificationTypeId: 'certification' },
      ],
    }
    const model = (data: Record<string, unknown>): unknown => {
      const instance = {
        ...data,
        toJSON: () => JSON.parse(JSON.stringify(data)),
      }
      for (const [key, value] of Object.entries(data)) {
        if (
          Array.isArray(value) &&
          [
            'sections',
            'screens',
            'fields',
            'list',
            'formCertificationTypes',
          ].includes(key)
        ) {
          Object.assign(instance, { [key]: value.map(model) })
        }
      }
      return instance
    }
    const formModel = {
      build: jest.fn(model),
      create: jest.fn().mockResolvedValue(undefined),
    }
    const sectionModel = { bulkCreate: jest.fn() }
    const screenModel = { bulkCreate: jest.fn() }
    const fieldModel = { bulkCreate: jest.fn() }
    const listItemModel = { bulkCreate: jest.fn() }
    const formCertificationTypeModel = { bulkCreate: jest.fn() }
    const transaction = { id: 'transaction' }
    const service = Object.assign(Object.create(FormsService.prototype), {
      formModel,
      sectionModel,
      screenModel,
      fieldModel,
      listItemModel,
      formCertificationTypeModel,
      organizationModel: {
        findOne: jest.fn().mockResolvedValue({
          id: 'destination-org',
          nationalId: 'destination',
        }),
      },
      sequelize: { transaction: jest.fn((callback) => callback(transaction)) },
      logger: { error: jest.fn() },
      getCertificationTypes: jest
        .fn()
        .mockResolvedValue([{ id: 'certification' }]),
      getUniqueCopySlug: jest.fn().mockResolvedValue('test-1'),
      findById: jest.fn((id) => ({ id })),
      buildFormResponse: jest.fn((form) => ({ form })),
    }) as FormsService
    const input = {
      organizationNationalId: 'destination',
      formJson: JSON.stringify({
        format: 'island.is/form-system',
        version: 1,
        form,
      }),
    }
    return {
      service,
      input,
      form,
      formModel,
      sectionModel,
      screenModel,
      fieldModel,
      listItemModel,
      formCertificationTypeModel,
      transaction,
    }
  }

  it('imports the complete tree as a new draft, remapping every relationship', async () => {
    const {
      service,
      input,
      form,
      formModel,
      sectionModel,
      screenModel,
      fieldModel,
      listItemModel,
      formCertificationTypeModel,
      transaction,
    } = setup()
    await service.importForm(user, input)
    const imported = formModel.create.mock.calls[0][0]
    const section = sectionModel.bulkCreate.mock.calls[0][0][0]
    const screen = screenModel.bulkCreate.mock.calls[0][0][0]
    const field = fieldModel.bulkCreate.mock.calls[0][0][0]
    const item = listItemModel.bulkCreate.mock.calls[0][0][0]
    const certification =
      formCertificationTypeModel.bulkCreate.mock.calls[0][0][0]

    expect(imported).toMatchObject({
      status: FormStatus.IN_DEVELOPMENT,
      beenPublished: false,
      derivedFrom: null,
      organizationId: 'destination-org',
      organizationNationalId: 'destination',
      slug: 'test-1',
      submissionServiceUrl: form.submissionServiceUrl,
      sectionInfo: form.sectionInfo,
      delegations: form.delegations,
      dependencies: [
        {
          parentProp: item.id,
          childProps: [section.id, screen.id, field.id],
          isSelected: true,
        },
      ],
    })
    expect(section.formId).toBe(imported.id)
    expect(screen.sectionId).toBe(section.id)
    expect(field.screenId).toBe(screen.id)
    expect(item.fieldId).toBe(field.id)
    expect(certification.formId).toBe(imported.id)
    expect(field.identifier).toBe('field')
    expect(field.fieldSettings).toEqual({ maxLength: 20 })
    const originalIds = [
      form.id,
      form.sections[0].id,
      form.sections[0].screens[0].id,
      form.sections[0].screens[0].fields[0].id,
      form.sections[0].screens[0].fields[0].list[0].id,
    ]
    for (const id of [imported.id, section.id, screen.id, field.id, item.id]) {
      expect(originalIds).not.toContain(id)
    }
    for (const model of [
      formModel,
      sectionModel,
      screenModel,
      fieldModel,
      listItemModel,
      formCertificationTypeModel,
    ]) {
      expect(
        ('create' in model ? model.create : model.bulkCreate).mock.calls[0][1],
      ).toEqual({ transaction })
    }
  })

  it.each([
    'invalid json',
    '{}',
    '{"format":"island.is/form-system","version":2}',
  ])('rejects invalid exports before writing: %s', async (formJson) => {
    const { service, input, formModel } = setup()
    await expect(
      service.importForm(user, { ...input, formJson }),
    ).rejects.toThrow('Invalid or unsupported')
    expect(formModel.create).not.toHaveBeenCalled()
  })

  it('rejects unauthorized destinations', async () => {
    const { service, input, formModel } = setup()
    await expect(
      service.importForm(user, { ...input, organizationNationalId: 'other' }),
    ).rejects.toThrow('permission')
    expect(formModel.build).not.toHaveBeenCalled()
  })

  it('allows administrators to import to another organization', async () => {
    const { service, input, formModel } = setup()
    await service.importForm(
      {
        nationalId: 'admin',
        scope: [AdminPortalScope.formSystemAdmin],
      } as unknown as User,
      input,
    )
    expect(formModel.create).toHaveBeenCalledTimes(1)
  })

  it('imports a newly created form without a slug', async () => {
    const { service, input, form, formModel } = setup()
    input.formJson = JSON.stringify({
      format: 'island.is/form-system',
      version: 1,
      form: { ...form, slug: null },
    })
    await service.importForm(user, input)
    expect(formModel.create).toHaveBeenCalledTimes(1)
  })

  it('rejects a failed transactional write without returning success', async () => {
    const { service, input, fieldModel, formCertificationTypeModel } = setup()
    fieldModel.bulkCreate.mockRejectedValueOnce(new Error('Database error'))
    await expect(service.importForm(user, input)).rejects.toThrow(
      'Unexpected error copying form',
    )
    expect(formCertificationTypeModel.bulkCreate).not.toHaveBeenCalled()
  })

  it('remaps dependencies correctly after retrying a concurrent slug conflict', async () => {
    const {
      service,
      input,
      formModel,
      sectionModel,
      screenModel,
      fieldModel,
      listItemModel,
    } = setup()
    const conflict = Object.assign(new UniqueConstraintError({ errors: [] }), {
      fields: { slug: 'test-1' },
    })
    formModel.create.mockRejectedValueOnce(conflict)

    await service.importForm(user, input)

    expect(formModel.create).toHaveBeenCalledTimes(2)
    const imported = formModel.create.mock.calls[1][0]
    const section = sectionModel.bulkCreate.mock.calls[0][0][0]
    const screen = screenModel.bulkCreate.mock.calls[0][0][0]
    const field = fieldModel.bulkCreate.mock.calls[0][0][0]
    const item = listItemModel.bulkCreate.mock.calls[0][0][0]
    expect(imported.dependencies).toEqual([
      {
        parentProp: item.id,
        childProps: [section.id, screen.id, field.id],
        isSelected: true,
      },
    ])
  })

  it.each(['duplicate', 'dependency', 'certification'])(
    'rejects an invalid %s before writing',
    async (invalid) => {
      const { service, input, form, formModel } = setup()
      if (invalid === 'duplicate') form.sections[0].id = form.id
      if (invalid === 'dependency')
        form.dependencies[0].parentProp = randomUUID()
      if (invalid === 'certification')
        form.formCertificationTypes[0].certificationTypeId = 'unavailable'
      input.formJson = JSON.stringify({
        format: 'island.is/form-system',
        version: 1,
        form,
      })
      await expect(service.importForm(user, input)).rejects.toThrow()
      expect(formModel.create).not.toHaveBeenCalled()
    },
  )
})

describe('FormsService export', () => {
  const form = {
    organizationNationalId: '1234567890',
    sections: [{ screens: [] }],
    dependencies: [],
  }
  const service = Object.assign(Object.create(FormsService.prototype), {
    findById: jest.fn().mockResolvedValue({ ...form, toJSON: () => form }),
  }) as FormsService

  it('exports the complete definition in a versioned envelope', async () => {
    const result = await service.exportForm(
      { nationalId: form.organizationNationalId, scope: [] } as unknown as User,
      'form-id',
    )
    expect(JSON.parse(result)).toEqual({
      format: 'island.is/form-system',
      version: 1,
      form,
    })
  })

  it('rejects another organization', async () => {
    await expect(
      service.exportForm(
        { nationalId: 'other', scope: [] } as unknown as User,
        'form-id',
      ),
    ).rejects.toThrow('permission')
  })
})

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
