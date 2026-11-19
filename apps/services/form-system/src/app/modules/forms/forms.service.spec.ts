import { FamilyTypes } from '@island.is/form-system/enums'
import {
  ApplicationStatus,
  FieldTypesEnum,
  FormStatus,
  SectionTypes,
} from '@island.is/form-system/shared'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { randomUUID } from 'crypto'
import { Transaction, UniqueConstraintError } from 'sequelize'

import { FormsService } from './forms.service'
import { Form } from './models/form.model'
import { UpdateFormDto } from './models/dto/updateForm.dto'
import { ApplicationJsonDto } from '../applications/models/dto/application.json.dto'
import { User } from '@island.is/auth-nest-tools'

describe.each(['archive', 'publish replacement'])(
  'FormsService draft cleanup when using %s',
  (action) => {
    const setup = () => {
      const user = { nationalId: 'owner', scope: [] } as unknown as User
      const transaction = { id: 'transaction' }
      const form = {
        id: 'published-form-id',
        organizationNationalId: user.nationalId,
        status: FormStatus.PUBLISHED,
        slug: 'form',
        reload: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockResolvedValue(undefined),
      }
      const replacement = {
        ...form,
        id: 'replacement-form-id',
        derivedFrom: form.id,
        status: FormStatus.PUBLISHED_BEING_CHANGED,
        reload: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockResolvedValue(undefined),
      }
      const applications = [
        { formId: form.id, status: ApplicationStatus.DRAFT, isTest: false },
        { formId: form.id, status: ApplicationStatus.DRAFT, isTest: true },
        { formId: form.id, status: ApplicationStatus.COMPLETED, isTest: false },
        {
          formId: 'other-form-id',
          status: ApplicationStatus.DRAFT,
          isTest: false,
        },
      ].map((application, index) => ({
        ...application,
        id: `application-${index}`,
        values: [
          {
            id: `value-${index}`,
            fieldType: FieldTypesEnum.FILE,
            json: { s3Key: [`file-${index}`] },
          },
        ],
        destroy: jest.fn().mockResolvedValue(undefined),
      }))
      const applicationModel = {
        findAll: jest.fn(
          async ({ where }: { where: { formId: string; status?: string } }) =>
            applications.filter(
              (application) =>
                application.formId === where.formId &&
                (!where.status || application.status === where.status),
            ),
        ),
      }
      const fileService = {
        deleteFile: jest.fn().mockResolvedValue(undefined),
        deleteFileFromStorage: jest.fn().mockResolvedValue(undefined),
      }
      const applicationEventModel = {
        destroy: jest.fn().mockResolvedValue(1),
      }
      const commit = jest.fn().mockResolvedValue(undefined)
      const service = Object.assign(Object.create(FormsService.prototype), {
        formModel: {
          findByPk: jest.fn(async (id) =>
            id === replacement.id ? replacement : form,
          ),
        },
        applicationModel,
        applicationEventModel,
        fileService,
        logger: { debug: jest.fn() },
        sequelize: {
          transaction: jest.fn(async (callback) => {
            const result = await callback(transaction)
            expect(fileService.deleteFileFromStorage).not.toHaveBeenCalled()
            await commit()
            return result
          }),
        },
        validateZendeskSettingsForPublish: jest
          .fn()
          .mockResolvedValue(undefined),
        copyForm: jest.fn().mockResolvedValue(replacement),
        buildFormResponse: jest.fn().mockResolvedValue({}),
      }) as FormsService
      const updateStatus = () =>
        service.updateStatus(
          user,
          action === 'archive' ? form.id : replacement.id,
          {
            newStatus:
              action === 'archive' ? FormStatus.ARCHIVED : FormStatus.PUBLISHED,
          },
        )

      return {
        updateStatus,
        form,
        replacement,
        transaction,
        applications,
        applicationModel,
        applicationEventModel,
        fileService,
        commit,
      }
    }

    it('deletes only drafts for the archived form, including test drafts and their files', async () => {
      const {
        updateStatus,
        form,
        replacement,
        transaction,
        applications,
        applicationModel,
        applicationEventModel,
        fileService,
      } = setup()

      await updateStatus()

      expect(form.reload).toHaveBeenCalledWith({
        transaction,
        lock: Transaction.LOCK.UPDATE,
      })
      expect(form.reload.mock.invocationCallOrder[0]).toBeLessThan(
        applicationModel.findAll.mock.invocationCallOrder[0],
      )
      if (action === 'publish replacement') {
        expect(replacement.reload).toHaveBeenCalledWith({
          transaction,
          lock: Transaction.LOCK.UPDATE,
        })
        expect(replacement.reload.mock.invocationCallOrder[0]).toBeLessThan(
          applicationModel.findAll.mock.invocationCallOrder[0],
        )
      }
      expect(applicationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { formId: form.id, status: ApplicationStatus.DRAFT },
          transaction,
          lock: Transaction.LOCK.UPDATE,
          include: [
            expect.objectContaining({
              as: 'values',
              separate: true,
              where: { fieldType: FieldTypesEnum.FILE },
              required: false,
            }),
          ],
        }),
      )
      for (const index of [0, 1]) {
        expect(fileService.deleteFileFromStorage).toHaveBeenCalledWith(
          `file-${index}`,
        )
        expect(applications[index].destroy).toHaveBeenCalledWith({
          transaction,
        })
        expect(applicationEventModel.destroy).toHaveBeenCalledWith({
          where: { applicationId: applications[index].id },
          transaction,
        })
        expect(
          applicationEventModel.destroy.mock.invocationCallOrder[index],
        ).toBeLessThan(applications[index].destroy.mock.invocationCallOrder[0])
      }
      expect(applicationEventModel.destroy).toHaveBeenCalledTimes(2)
      expect(fileService.deleteFileFromStorage).toHaveBeenCalledTimes(2)
      expect(fileService.deleteFile).not.toHaveBeenCalled()
      expect(applications[2].destroy).not.toHaveBeenCalled()
      expect(applications[3].destroy).not.toHaveBeenCalled()
      expect(form.status).toBe(FormStatus.ARCHIVED)
      expect(form.save).toHaveBeenCalledWith({ transaction })
    })

    it('rechecks the form status under the lock before draft cleanup', async () => {
      const { updateStatus, form, applicationModel } = setup()
      form.reload.mockImplementationOnce(async () => {
        form.status = FormStatus.ARCHIVED
      })

      await expect(updateStatus()).rejects.toThrow()

      expect(applicationModel.findAll).not.toHaveBeenCalled()
      expect(form.save).not.toHaveBeenCalled()
    })

    it('surfaces storage deletion failures after database cleanup has committed', async () => {
      const { updateStatus, form, applications, fileService } = setup()
      fileService.deleteFileFromStorage.mockRejectedValue(
        new Error('File deletion failed'),
      )

      await expect(updateStatus()).rejects.toThrow('File deletion failed')

      expect(form.save).toHaveBeenCalled()
      expect(applications[0].destroy).toHaveBeenCalled()
    })

    it('does not delete the application or archive the form if event deletion fails', async () => {
      const {
        updateStatus,
        form,
        applications,
        applicationEventModel,
        fileService,
      } = setup()
      applicationEventModel.destroy.mockRejectedValue(
        new Error('Event deletion failed'),
      )

      await expect(updateStatus()).rejects.toThrow()

      expect(form.save).not.toHaveBeenCalled()
      expect(applications[0].destroy).not.toHaveBeenCalled()
      expect(fileService.deleteFileFromStorage).not.toHaveBeenCalled()
    })

    it.each(['save', 'commit'])(
      'does not delete stored files if the archive transaction fails during %s',
      async (failure) => {
        const { updateStatus, form, commit, fileService } = setup()
        const operation = failure === 'save' ? form.save : commit
        operation.mockRejectedValue(new Error('Transaction failed'))

        await expect(updateStatus()).rejects.toThrow()

        expect(fileService.deleteFileFromStorage).not.toHaveBeenCalled()
      },
    )
  },
)

describe('FormsService publishing a form in development', () => {
  it.each([false, true])(
    'deletes application events before applications (event deletion fails: %s)',
    async (eventDeletionFails) => {
      const user = { nationalId: 'owner', scope: [] } as unknown as User
      const transaction = { id: 'transaction' }
      const form = {
        id: 'form-id',
        organizationNationalId: user.nationalId,
        status: FormStatus.IN_DEVELOPMENT,
        save: jest.fn().mockResolvedValue(undefined),
      }
      const application = {
        id: 'application-id',
        values: [],
        destroy: jest.fn().mockResolvedValue(undefined),
      }
      const applicationEventModel = {
        destroy: eventDeletionFails
          ? jest.fn().mockRejectedValue(new Error('Event deletion failed'))
          : jest.fn().mockResolvedValue(1),
      }
      const service = Object.assign(Object.create(FormsService.prototype), {
        formModel: { findByPk: jest.fn().mockResolvedValue(form) },
        applicationModel: {
          findAll: jest.fn().mockResolvedValue([application]),
        },
        applicationEventModel,
        sequelize: {
          transaction: jest.fn((callback) => callback(transaction)),
        },
        validateZendeskSettingsForPublish: jest
          .fn()
          .mockResolvedValue(undefined),
      }) as FormsService

      const publish = service.updateStatus(user, form.id, {
        newStatus: FormStatus.PUBLISHED,
      })

      if (eventDeletionFails) {
        await expect(publish).rejects.toThrow(
          `Unexpected error publishing form '${form.id}'.`,
        )
        expect(application.destroy).not.toHaveBeenCalled()
        expect(form.save).not.toHaveBeenCalled()
      } else {
        await publish
        expect(application.destroy).toHaveBeenCalledWith({ transaction })
        expect(
          applicationEventModel.destroy.mock.invocationCallOrder[0],
        ).toBeLessThan(application.destroy.mock.invocationCallOrder[0])
        expect(form.save).toHaveBeenCalledWith({ transaction })
      }

      expect(applicationEventModel.destroy).toHaveBeenCalledWith({
        where: { applicationId: application.id },
        transaction,
      })
    },
  )
})

describe('FormsService publishing accessibility', () => {
  it.each([FormStatus.IN_DEVELOPMENT, FormStatus.PUBLISHED_BEING_CHANGED])(
    'makes an inaccessible %s form accessible when published',
    async (status) => {
      const user = { nationalId: 'owner', scope: [] } as unknown as User
      const transaction = { id: 'transaction' }
      const form = {
        id: 'form-id',
        organizationNationalId: user.nationalId,
        status,
        slug: 'form-i-breytingu',
        derivedFrom: 'published-form-id',
        isInaccessible: true,
        reload: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockImplementation(async () => {
          expect(form.status).toBe(FormStatus.PUBLISHED)
          expect(form.isInaccessible).toBe(false)
        }),
      }
      const publishedForm = {
        id: 'published-form-id',
        status: FormStatus.PUBLISHED,
        slug: 'form',
        reload: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockResolvedValue(undefined),
      }
      const service = Object.assign(Object.create(FormsService.prototype), {
        formModel: {
          findByPk: jest.fn(async (id) =>
            id === form.id ? form : publishedForm,
          ),
        },
        applicationModel: { findAll: jest.fn().mockResolvedValue([]) },
        sequelize: {
          transaction: jest.fn((callback) => callback(transaction)),
        },
        validateZendeskSettingsForPublish: jest
          .fn()
          .mockResolvedValue(undefined),
        buildFormResponse: jest.fn().mockResolvedValue({}),
      }) as FormsService

      await service.updateStatus(user, form.id, {
        newStatus: FormStatus.PUBLISHED,
      })

      expect(form.status).toBe(FormStatus.PUBLISHED)
      expect(form.isInaccessible).toBe(false)
      expect(form.save).toHaveBeenCalledWith({ transaction })
    },
  )
})

describe('FormsService update draft steps', () => {
  it.each(
    [0, 1, 3].flatMap((inputSections) =>
      [false, true].flatMap((hasSummaryScreen) =>
        [false, true].map((hasPayment) => ({
          inputSections,
          hasSummaryScreen,
          hasPayment,
        })),
      ),
    ),
  )(
    'recalculates draft steps from sections and settings: %j',
    async (settings) => {
      const user = { nationalId: 'owner', scope: [] } as unknown as User
      const form = {
        id: 'form-id',
        organizationNationalId: user.nationalId,
        hasSummaryScreen: false,
        hasPayment: false,
        draftTotalSteps: 99,
        save: jest.fn().mockResolvedValue(undefined),
      }
      const transaction = { id: 'transaction' }
      const sectionModel = {
        count: jest.fn().mockResolvedValue(settings.inputSections),
      }
      const service = Object.assign(Object.create(FormsService.prototype), {
        formModel: { findByPk: jest.fn().mockResolvedValue(form) },
        sectionModel,
        sequelize: {
          transaction: jest.fn((callback) => callback(transaction)),
        },
      }) as FormsService

      await service.update(user, form.id, {
        hasSummaryScreen: settings.hasSummaryScreen,
        hasPayment: settings.hasPayment,
      })

      expect(sectionModel.count).toHaveBeenCalledWith({
        where: { formId: form.id, sectionType: SectionTypes.INPUT },
        transaction,
      })
      expect(form.draftTotalSteps).toBe(
        settings.inputSections +
          1 +
          (settings.hasSummaryScreen || settings.hasPayment ? 1 : 0),
      )
      expect(form.save).toHaveBeenCalledWith({ transaction })
    },
  )
})

describe('FormsService dependency updates', () => {
  const setup = () => {
    const user = { nationalId: 'owner', scope: [] } as unknown as User
    const form = {
      id: 'form-id',
      organizationNationalId: user.nationalId,
      save: jest.fn().mockResolvedValue(undefined),
      sections: [
        {
          id: 'section-id',
          screens: [
            {
              id: 'screen-id',
              fields: [{ id: 'field-id', list: [{ id: 'option-id' }] }],
            },
          ],
        },
      ],
    }
    const transaction = { id: 'transaction' }
    const service = Object.assign(Object.create(FormsService.prototype), {
      formModel: { findByPk: jest.fn().mockResolvedValue(form) },
      sectionModel: { count: jest.fn().mockResolvedValue(1) },
      sequelize: { transaction: jest.fn((callback) => callback(transaction)) },
    }) as FormsService
    return { service, form, user, transaction }
  }

  it.each(['parent', 'child'])(
    'rejects a stale or foreign %s reference without saving',
    async (invalid) => {
      const { service, form, user } = setup()
      await expect(
        service.update(user, form.id, {
          dependencies: [
            {
              parentProp: invalid === 'parent' ? 'missing-id' : 'option-id',
              childProps: [
                'field-id',
                ...(invalid === 'child' ? ['missing-id'] : []),
              ],
              isSelected: false,
            },
          ],
        }),
      ).rejects.toThrow('do not belong to this form')
      expect(form.save).not.toHaveBeenCalled()
    },
  )

  it.each([
    { dependencies: [] },
    { dependencies: null },
    {
      dependencies: [
        {
          parentProp: 'option-id',
          childProps: ['section-id', 'screen-id', 'field-id'],
          isSelected: false,
        },
      ],
    },
  ])('accepts valid dependencies: %j', async ({ dependencies }) => {
    const { service, form, user, transaction } = setup()
    await service.update(user, form.id, { dependencies } as UpdateFormDto)
    expect(form.save).toHaveBeenCalledWith({ transaction })
  })
})

describe('FormsService dependency cleanup on opening a form', () => {
  const user = { nationalId: 'owner', scope: [] } as unknown as User
  const validDependency = {
    parentProp: 'option-id',
    childProps: ['section-id', 'screen-id', 'field-id'],
    isSelected: true,
  }
  const corruptedDependencies = [
    { ...validDependency, parentProp: 'missing-parent' },
    { ...validDependency, childProps: ['field-id', 'missing-child'] },
    { ...validDependency, childProps: ['missing-child'] },
    validDependency,
  ]
  const setup = (
    dependencies: typeof corruptedDependencies | null = corruptedDependencies,
  ) => {
    const form = {
      id: 'form-id',
      organizationNationalId: user.nationalId,
      dependencies,
      status: FormStatus.PUBLISHED,
      sections: [
        {
          id: 'section-id',
          screens: [
            {
              id: 'screen-id',
              fields: [{ id: 'field-id', list: [{ id: 'option-id' }] }],
            },
          ],
        },
      ],
      save: jest.fn().mockResolvedValue(undefined),
    }
    const currentForm = {
      ...form,
      save: jest.fn().mockResolvedValue(undefined),
    }
    const transaction = { id: 'transaction' }
    const formModel = {
      findByPk: jest
        .fn()
        .mockResolvedValueOnce(form)
        .mockResolvedValueOnce({ id: form.id })
        .mockResolvedValue(currentForm),
    }
    const sequelize = {
      transaction: jest.fn((callback) => callback(transaction)),
    }
    const buildFormResponse = jest.fn(async (definition) => ({
      form: definition,
    }))
    const service = Object.assign(Object.create(FormsService.prototype), {
      formModel,
      sequelize,
      buildFormResponse,
    }) as FormsService
    return {
      service,
      form,
      currentForm,
      formModel,
      sequelize,
      transaction,
      buildFormResponse,
    }
  }

  it('persists cleanup and returns it while preserving valid references and selection state', async () => {
    const { service, form, currentForm, formModel, transaction } = setup()

    const response = await service.findOne(user, form.id)

    expect(currentForm.dependencies).toEqual([
      { ...validDependency, childProps: ['field-id'] },
      validDependency,
    ])
    expect(response.form).toBe(currentForm)
    expect(currentForm.save).toHaveBeenCalledWith({
      fields: ['dependencies'],
      transaction,
    })
    expect(currentForm.status).toBe(FormStatus.PUBLISHED)
    expect(form.dependencies).toEqual(corruptedDependencies)
    expect(formModel.findByPk.mock.calls[1]).toEqual([
      form.id,
      { attributes: ['id'], lock: Transaction.LOCK.UPDATE, transaction },
    ])
    expect(formModel.findByPk.mock.calls[2][1]).toEqual(
      expect.objectContaining({ transaction }),
    )
  })

  it.each([null, [], [validDependency]])(
    'does not write or lock an already-valid form: %j',
    async (dependencies) => {
      const { service, form, currentForm, sequelize } = setup(dependencies)
      const response = await service.findOne(user, form.id)
      expect(response.form).toBe(form)
      expect(sequelize.transaction).not.toHaveBeenCalled()
      expect(form.save).not.toHaveBeenCalled()
      expect(currentForm.save).not.toHaveBeenCalled()
    },
  )

  it('uses the latest definition rather than overwriting a concurrent editor save', async () => {
    const { service, form, currentForm } = setup()
    currentForm.dependencies = [
      { ...validDependency, childProps: ['screen-id'] },
    ]
    const response = await service.findOne(user, form.id)
    expect(response.form?.dependencies).toEqual(currentForm.dependencies)
    expect(currentForm.save).not.toHaveBeenCalled()
  })

  it('does not clean records for an unauthorized caller', async () => {
    const { service, form, currentForm, sequelize } = setup()
    await expect(
      service.findOne(
        { nationalId: 'other', scope: [] } as unknown as User,
        form.id,
      ),
    ).rejects.toThrow('permission')
    expect(sequelize.transaction).not.toHaveBeenCalled()
    expect(currentForm.save).not.toHaveBeenCalled()
  })

  it('propagates cleanup failures rather than returning unpersisted changes', async () => {
    const { service, form, currentForm, buildFormResponse } = setup()
    currentForm.save.mockRejectedValueOnce(new Error('Database error'))
    await expect(service.findOne(user, form.id)).rejects.toThrow(
      'Database error',
    )
    expect(buildFormResponse).not.toHaveBeenCalled()
  })
})

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
      organizationDisplayName: { is: 'Source organization', en: 'Source' },
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
      delegations: [],
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

  it.each([true, false])(
    'resets the imported organization display name and delegations only when organizations differ: %s',
    async (differentOrganization) => {
      const { service, input, form, formModel } = setup()
      input.formJson = JSON.stringify({
        format: 'island.is/form-system',
        version: 1,
        form: {
          ...form,
          organizationNationalId: differentOrganization
            ? 'source'
            : 'destination',
        },
      })

      await service.importForm(user, input)

      expect(formModel.create.mock.calls[0][0].organizationDisplayName).toEqual(
        differentOrganization
          ? { is: '', en: '' }
          : form.organizationDisplayName,
      )
      expect(formModel.create.mock.calls[0][0].delegations).toEqual(
        differentOrganization ? [] : form.delegations,
      )
    },
  )

  it.each([true, false])(
    'resets the copied organization display name and delegations only when organizations differ: %s',
    async (differentOrganization) => {
      const { service, form, formModel } = setup()
      Object.assign(service, {
        findById: jest.fn().mockResolvedValue(formModel.build(form)),
      })

      await service.copy(
        {
          nationalId: 'admin',
          scope: [AdminPortalScope.formSystemAdmin],
        } as unknown as User,
        form.id,
        {
          organizationNationalId: differentOrganization
            ? 'destination'
            : 'source',
        },
      )

      expect(formModel.create.mock.calls[0][0].organizationDisplayName).toEqual(
        differentOrganization
          ? { is: '', en: '' }
          : form.organizationDisplayName,
      )
      expect(formModel.create.mock.calls[0][0].delegations).toEqual(
        differentOrganization ? [] : form.delegations,
      )
    },
  )

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

  it('remaps selected currency field IDs on every copy without mutating the source', async () => {
    const { service, form, formModel, fieldModel } = setup()
    const sourceScreen = form.sections[0].screens[0]
    const sourceField = sourceScreen.fields[0]
    const beforeId = randomUUID()
    const afterId = randomUUID()
    const fieldsToSum = [afterId, beforeId, randomUUID()]
    Object.assign(sourceScreen, {
      fields: [
        {
          ...sourceField,
          id: beforeId,
          identifier: 'before',
          fieldType: FieldTypesEnum.ISK_NUMBERBOX,
          fieldSettings: { minAmount: 0 },
          list: [],
        },
        {
          ...sourceField,
          identifier: 'sum',
          displayOrder: 1,
          fieldType: FieldTypesEnum.ISK_SUMBOX,
          fieldSettings: { fieldsToSum, zendeskCustomFieldId: 'custom' },
        },
        {
          ...sourceField,
          id: afterId,
          identifier: 'after',
          displayOrder: 2,
          fieldType: FieldTypesEnum.ISK_NUMBERBOX,
          fieldSettings: { maxAmount: 1000 },
          list: [],
        },
      ],
    })
    const source = formModel.build(form) as Form
    const sourceJson = source.toJSON()
    const copyService = service as unknown as {
      copyForm: (...args: unknown[]) => Promise<Form>
    }

    for (const slug of ['first-copy', 'second-copy']) {
      await copyService.copyForm(
        form.id,
        false,
        false,
        slug,
        undefined,
        undefined,
        source,
      )

      const [before, sum, after] = fieldModel.bulkCreate.mock.lastCall[0]
      expect(before.id).not.toBe(beforeId)
      expect(after.id).not.toBe(afterId)
      expect(sum.fieldSettings).toEqual({
        fieldsToSum: [after.id, before.id],
        zendeskCustomFieldId: 'custom',
      })
      expect(before.fieldSettings).toEqual({ minAmount: 0 })
      expect(after.fieldSettings).toEqual({ maxAmount: 1000 })
      expect(source.toJSON()).toEqual(sourceJson)
    }
  })

  it.each([{ fieldsToSum: [] }, { fieldsToSum: null }, {}])(
    'preserves default sum settings when copying: %j',
    async (fieldSettings) => {
      const { service, form, formModel, fieldModel } = setup()
      Object.assign(form.sections[0].screens[0].fields[0], {
        fieldType: FieldTypesEnum.ISK_SUMBOX,
        fieldSettings,
      })
      const copyService = service as unknown as {
        copyForm: (...args: unknown[]) => Promise<Form>
      }

      await copyService.copyForm(
        form.id,
        false,
        false,
        'copy',
        undefined,
        undefined,
        formModel.build(form),
      )

      expect(fieldModel.bulkCreate.mock.calls[0][0][0].fieldSettings).toEqual(
        fieldSettings,
      )
    },
  )

  it('drops dangling references when copying without mutating the source', async () => {
    const {
      service,
      form,
      formModel,
      sectionModel,
      screenModel,
      fieldModel,
      listItemModel,
    } = setup()
    const original = form.dependencies[0]
    const missingChild = randomUUID()
    const missingParent = randomUUID()
    form.dependencies = [
      { ...original, childProps: [...original.childProps, missingChild] },
      { ...original, parentProp: missingParent },
      {
        ...original,
        parentProp: form.sections[0].id,
        childProps: [missingChild],
      },
    ]
    const source = formModel.build(form)
    const copyService = service as unknown as {
      copyForm: (...args: unknown[]) => Promise<Form>
    }

    await copyService.copyForm(
      form.id,
      false,
      false,
      'copy',
      undefined,
      undefined,
      source,
    )

    const copied = formModel.create.mock.calls[0][0]
    expect(copied.dependencies).toEqual([
      {
        parentProp: listItemModel.bulkCreate.mock.calls[0][0][0].id,
        childProps: [
          sectionModel.bulkCreate.mock.calls[0][0][0].id,
          screenModel.bulkCreate.mock.calls[0][0][0].id,
          fieldModel.bulkCreate.mock.calls[0][0][0].id,
        ],
        isSelected: true,
      },
    ])
    expect(form.dependencies[0].childProps).toContain(missingChild)
    expect(form.dependencies[0].parentProp).toBe(original.parentProp)
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
    [FamilyTypes.APPLICANT_INFO, ['nationalId', 'name']],
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
