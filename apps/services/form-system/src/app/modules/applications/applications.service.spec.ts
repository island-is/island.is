import { User } from '@island.is/auth-nest-tools'
import {
  ApplicationStatus,
  AssetTypes,
  FamilyTypes,
  FieldTypesEnum,
  FormStatus,
  SectionTypes,
} from '@island.is/form-system/shared'
import { Transaction } from 'sequelize'
import { ApplicationsService } from './applications.service'
import { SectionDto } from '../sections/models/dto/section.dto'
import axios from 'axios'
import PDFDocument from 'pdfkit'

describe('ApplicationsService.createApplicationPdf', () => {
  const nationalId = '1234567890'
  const logo = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64',
  )
  const createService = (organizationLogo: {
    is: string | null
    en: string | null
  }) => {
    const findOne = jest.fn().mockResolvedValue({ logo: organizationLogo })
    const warn = jest.fn()
    const service = Object.assign(
      Object.create(ApplicationsService.prototype),
      {
        organizationModel: { findOne },
        logger: { warn },
      },
    ) as ApplicationsService
    return { service, findOne, warn }
  }

  afterEach(() => jest.restoreAllMocks())

  it.each(['is', 'en'] as const)(
    'loads the Icelandic logo even for a %s PDF',
    async (locale) => {
      const get = jest.spyOn(axios, 'get').mockResolvedValue({ data: logo })
      const image = jest.spyOn(PDFDocument.prototype, 'image')
      const { service, findOne } = createService({
        is: 'https://images.ctfassets.net/space/icelandic-logo.png',
        en: 'https://images.ctfassets.net/space/english-logo.png',
      })

      const pdf = await service.createApplicationPdf(
        { organizationNationalId: nationalId },
        locale,
      )

      expect(findOne).toHaveBeenCalledWith({ where: { nationalId } })
      expect(get).toHaveBeenCalledWith(
        'https://images.ctfassets.net/space/icelandic-logo.png?fm=png&w=240&h=120&fit=pad',
        expect.objectContaining({
          responseType: 'arraybuffer',
          maxRedirects: 0,
        }),
      )
      expect(image.mock.calls[0][0]).toEqual(logo)
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    },
  )

  it('does not fall back to the English logo when logo.is is missing', async () => {
    const get = jest.spyOn(axios, 'get')
    const image = jest.spyOn(PDFDocument.prototype, 'image')
    const { service } = createService({
      is: null,
      en: 'https://images.ctfassets.net/space/english-logo.png',
    })

    await service.createApplicationPdf({ organizationNationalId: nationalId })

    expect(get).not.toHaveBeenCalled()
    expect(image).not.toHaveBeenCalled()
  })

  it('rejects non-Contentful logo URLs without fetching them', async () => {
    const get = jest.spyOn(axios, 'get')
    const { service } = createService({
      is: 'https://example.com/logo.png',
      en: null,
    })

    await expect(
      service.createApplicationPdf({ organizationNationalId: nationalId }),
    ).rejects.toThrow('Organization logo must be a Contentful image')
    expect(get).not.toHaveBeenCalled()
  })

  it('logs download failures and generates the PDF without a logo', async () => {
    const error = new Error('Logo unavailable')
    jest.spyOn(axios, 'get').mockRejectedValue(error)
    const image = jest.spyOn(PDFDocument.prototype, 'image')
    const { service, warn } = createService({
      is: 'https://images.ctfassets.net/space/logo.png',
      en: null,
    })

    const pdf = await service.createApplicationPdf({
      id: 'application-id',
      organizationNationalId: nationalId,
    })
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    expect(image).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(
      'Failed to download organization logo for PDF',
      { applicationId: 'application-id', error },
    )
  })
})

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
        formModel: {
          findByPk: jest.fn().mockResolvedValue({
            status: FormStatus.IN_DEVELOPMENT,
          }),
        },
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

describe('ApplicationsService.create form locking', () => {
  const setup = (status = FormStatus.PUBLISHED) => {
    const transaction = { id: 'transaction' }
    const form = {
      id: 'form-id',
      status,
      isInaccessible: false,
      sections: [],
    }
    const lockedForm = { ...form }
    const formModel = {
      findByPk: jest.fn().mockResolvedValue(lockedForm),
    }
    const applicationModel = {
      create: jest.fn().mockResolvedValue({ id: 'application-id' }),
    }
    const applicationEventModel = {
      create: jest.fn().mockResolvedValue(undefined),
    }
    const service = Object.assign(
      Object.create(ApplicationsService.prototype),
      {
        getForm: jest.fn().mockResolvedValue(form),
        formModel,
        applicationModel,
        applicationEventModel,
        isFakeUserAllowed: jest.fn().mockReturnValue(true),
        getAllowedLoginTypes: jest.fn().mockResolvedValue([]),
        getLoginTypes: jest.fn().mockResolvedValue([]),
        isLoginAllowed: jest.fn().mockReturnValue(true),
        hasDelegation: jest.fn().mockReturnValue(true),
        sequelize: {
          transaction: jest.fn((callback) => callback(transaction)),
        },
        logger: { error: jest.fn() },
        getApplication: jest.fn().mockResolvedValue({}),
      },
    ) as ApplicationsService

    return {
      create: () =>
        service.create('form-slug', { nationalId: '0101307789' } as User),
      lockedForm,
      transaction,
      formModel,
      applicationModel,
      applicationEventModel,
    }
  }

  it.each([
    FormStatus.PUBLISHED,
    FormStatus.IN_DEVELOPMENT,
    FormStatus.PUBLISHED_BEING_CHANGED,
  ])('locks an eligible %s form before inserting a draft', async (status) => {
    const { create, transaction, formModel, applicationModel } = setup(status)

    await create()

    expect(formModel.findByPk).toHaveBeenCalledWith('form-id', {
      transaction,
      lock: Transaction.LOCK.UPDATE,
    })
    expect(formModel.findByPk.mock.invocationCallOrder[0]).toBeLessThan(
      applicationModel.create.mock.invocationCallOrder[0],
    )
    expect(applicationModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ApplicationStatus.DRAFT,
        isTest: status !== FormStatus.PUBLISHED,
      }),
      { transaction },
    )
  })

  it.each(['archived', 'inaccessible', 'deleted', 'changed status'])(
    'does not insert a draft if the form is %s after the initial read',
    async (change) => {
      const {
        create,
        lockedForm,
        formModel,
        applicationModel,
        applicationEventModel,
      } = setup()
      if (change === 'archived') {
        lockedForm.status = FormStatus.ARCHIVED
      } else if (change === 'inaccessible') {
        lockedForm.isInaccessible = true
      } else if (change === 'deleted') {
        formModel.findByPk.mockResolvedValueOnce(null)
      } else {
        lockedForm.status = FormStatus.PUBLISHED_BEING_CHANGED
      }

      await expect(create()).rejects.toThrow()

      expect(formModel.findByPk).toHaveBeenCalledWith(
        'form-id',
        expect.objectContaining({ lock: Transaction.LOCK.UPDATE }),
      )
      expect(applicationModel.create).not.toHaveBeenCalled()
      expect(applicationEventModel.create).not.toHaveBeenCalled()
    },
  )
})

describe.each([
  { hasSummaryScreen: true, withScreens: true },
  { hasSummaryScreen: true, withScreens: false },
  { hasSummaryScreen: false, withScreens: true },
  { hasSummaryScreen: false, withScreens: false },
])(
  'ApplicationsService.saveScreen hasSummaryScreen=$hasSummaryScreen withScreens=$withScreens',
  ({ hasSummaryScreen, withScreens }) => {
    const setupSaveScreen = () => {
      const application = {
        id: 'application',
        formId: 'form',
        completed: [] as string[],
        draftFinishedSteps: 1,
        draftTotalSteps: 0,
        save: jest.fn().mockResolvedValue(undefined),
      }
      const sections: SectionDto[] = [
        { id: 'input', sectionType: SectionTypes.INPUT },
        { id: 'payment', sectionType: SectionTypes.PAYMENT },
        { id: 'next-input', sectionType: SectionTypes.INPUT },
      ].map((section, displayOrder) => ({
        ...section,
        name: { is: '', en: '' },
        displayOrder,
        isHidden: false,
        isCompleted: false,
        screens:
          section.sectionType === SectionTypes.PAYMENT && withScreens
            ? [
                {
                  id: 'payment-screen',
                  identifier: 'payment-screen',
                  sectionId: section.id,
                  name: { is: '', en: '' },
                  displayOrder: 0,
                  isHidden: false,
                  isCompleted: false,
                  multiMax: 1,
                  isMulti: false,
                  shouldValidate: false,
                  fields: [],
                },
              ]
            : [],
      }))
      const service = Object.assign(
        Object.create(ApplicationsService.prototype),
        {
          applicationModel: {
            findByPk: jest.fn().mockResolvedValue(application),
          },
          formModel: {
            findByPk: jest.fn().mockResolvedValue({ hasSummaryScreen }),
          },
          getLoginTypes: jest.fn().mockResolvedValue([]),
          hasDelegation: jest.fn().mockReturnValue(true),
          doesUserMatchApplication: jest.fn().mockReturnValue(true),
          sequelize: {
            transaction: jest
              .fn()
              .mockImplementation((callback) => callback({})),
          },
        },
      ) as ApplicationsService

      return {
        application,
        save: (sectionId: string, increment: boolean) =>
          service.saveScreen(
            {
              applicationId: application.id,
              sectionId,
              screenId:
                sectionId === 'payment' && withScreens
                  ? 'payment-screen'
                  : undefined,
              sections,
              increment,
            },
            { nationalId: '0101307789' } as User,
          ),
      }
    }

    it('only counts payment completion as a separate step without a summary', async () => {
      const { application, save } = setupSaveScreen()

      await save('payment', true)

      expect(application.draftFinishedSteps).toBe(hasSummaryScreen ? 1 : 2)
      expect(application.completed).toContain('payment')
      if (withScreens) {
        expect(application.completed).toContain('payment-screen')
      }

      await save('payment', true)
      expect(application.draftFinishedSteps).toBe(hasSummaryScreen ? 1 : 2)
    })

    it('only reverses a payment step without a summary, while clearing completion IDs', async () => {
      const { application, save } = setupSaveScreen()
      application.completed = [
        'payment',
        ...(withScreens ? ['payment-screen'] : []),
      ]
      application.draftFinishedSteps = hasSummaryScreen ? 1 : 2

      await save('next-input', false)

      expect(application.draftFinishedSteps).toBe(1)
      expect(application.completed).not.toContain('payment')
      expect(application.completed).not.toContain('payment-screen')
    })

    it('continues counting ordinary sections in either summary configuration', async () => {
      const { application, save } = setupSaveScreen()

      await save('input', true)
      expect(application.draftFinishedSteps).toBe(2)

      await save('payment', false)
      expect(application.draftFinishedSteps).toBe(1)
      expect(application.completed).not.toContain('input')
    })
  },
)

describe.each([
  FieldTypesEnum.CHECKBOX,
  FieldTypesEnum.DROPDOWN_LIST,
  FieldTypesEnum.RADIO_BUTTONS,
])('ApplicationsService.saveScreen hidden %s values', (fieldType) => {
  it.each([
    { hiddenLevel: 'field', onCurrentScreen: false },
    { hiddenLevel: 'screen', onCurrentScreen: false },
    { hiddenLevel: 'section', onCurrentScreen: false },
    { hiddenLevel: 'field', onCurrentScreen: true },
    { hiddenLevel: 'screen', onCurrentScreen: true },
    { hiddenLevel: 'section', onCurrentScreen: true },
  ])(
    'clears stored values for hidden $hiddenLevel with onCurrentScreen=$onCurrentScreen',
    async ({ hiddenLevel, onCurrentScreen }) => {
      const transaction = {}
      const application = {
        id: 'application',
        formId: 'form',
        save: jest.fn().mockResolvedValue(undefined),
      }
      const sections: SectionDto[] = ['current', 'other'].map((id) => ({
        id,
        name: { is: '', en: '' },
        sectionType: SectionTypes.INPUT,
        displayOrder: 0,
        isHidden: id === 'other' && hiddenLevel === 'section',
        isCompleted: false,
        screens: [
          {
            id: `${id}-screen`,
            identifier: `${id}-screen`,
            sectionId: id,
            name: { is: '', en: '' },
            displayOrder: 0,
            isHidden: id === 'other' && hiddenLevel === 'screen',
            isCompleted: false,
            multiMax: 1,
            isMulti: false,
            shouldValidate: false,
            fields: [fieldType, FieldTypesEnum.TEXTBOX].map((type) => ({
              id: `${id}-${type}`,
              identifier: `${id}-${type}`,
              screenId: `${id}-screen`,
              name: { is: '', en: '' },
              informationText: { is: '', en: '' },
              tooltip: { is: '', en: '' },
              displayOrder: 0,
              fieldType: type,
              isHidden: id === 'other' && hiddenLevel === 'field',
              isPartOfMultiset: onCurrentScreen && type === fieldType,
              isRequired: false,
              values: [],
            })),
          },
        ],
      }))
      const update = jest.fn().mockResolvedValue([2])
      const destroy = jest.fn()
      const create = jest.fn()
      const literal = jest.fn((sql: string) => sql)
      const escape = jest.fn((json: string) => `'${json}'`)
      const service = Object.assign(
        Object.create(ApplicationsService.prototype),
        {
          applicationModel: {
            findByPk: jest.fn().mockResolvedValue(application),
          },
          formModel: { findByPk: jest.fn().mockResolvedValue({}) },
          getLoginTypes: jest.fn().mockResolvedValue([]),
          hasDelegation: jest.fn().mockReturnValue(true),
          doesUserMatchApplication: jest.fn().mockReturnValue(true),
          valueModel: { update, destroy, create },
          sequelize: {
            transaction: jest
              .fn()
              .mockImplementation((callback) => callback(transaction)),
            literal,
            escape,
          },
        },
      ) as ApplicationsService

      await service.saveScreen(
        {
          applicationId: application.id,
          sectionId: onCurrentScreen ? 'other' : 'current',
          screenId: onCurrentScreen ? 'other-screen' : 'current-screen',
          sections,
        },
        { nationalId: '0101307789' } as User,
      )

      const resetJson = JSON.stringify(
        fieldType === FieldTypesEnum.CHECKBOX
          ? { checkboxValue: false }
          : { label: null, value: null },
      )
      expect(escape).toHaveBeenCalledWith(resetJson)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(
        { json: `COALESCE("json", '{}'::jsonb) || '${resetJson}'::jsonb` },
        {
          where: {
            applicationId: application.id,
            fieldId: `other-${fieldType}`,
          },
          transaction,
        },
      )
      expect(destroy).not.toHaveBeenCalled()
      expect(create).not.toHaveBeenCalled()
      expect(application.save).toHaveBeenCalledWith({ transaction })
    },
  )
})

describe('ApplicationsService.calculateDraftTotalSteps', () => {
  it.each([
    { hasSummaryScreen: true, hiddenTotal: 3, visibleTotal: 3 },
    { hasSummaryScreen: false, hiddenTotal: 2, visibleTotal: 3 },
  ])(
    'counts a newly visible payment with hasSummaryScreen=$hasSummaryScreen',
    async ({ hasSummaryScreen, hiddenTotal, visibleTotal }) => {
      const paymentSection = {
        id: 'payment',
        sectionType: SectionTypes.PAYMENT,
        isHidden: true,
      }
      const sections = [
        { id: 'premises', sectionType: SectionTypes.PREMISES, isHidden: false },
        { id: 'parties', sectionType: SectionTypes.PARTIES, isHidden: false },
        { id: 'input', sectionType: SectionTypes.INPUT, isHidden: false },
        { id: 'hidden-input', sectionType: SectionTypes.INPUT, isHidden: true },
        {
          id: 'summary',
          sectionType: SectionTypes.SUMMARY,
          isHidden: !hasSummaryScreen,
        },
        paymentSection,
        {
          id: 'completed',
          sectionType: SectionTypes.COMPLETED,
          isHidden: false,
        },
      ].map((section, displayOrder) => ({
        ...section,
        name: { is: '', en: '' },
        displayOrder,
        isCompleted: false,
      }))

      await expect(
        ApplicationsService.prototype['calculateDraftTotalSteps'](
          sections,
          hasSummaryScreen,
        ),
      ).resolves.toBe(hiddenTotal)

      const visibleSections = sections.map((section) =>
        section.id === paymentSection.id
          ? { ...section, isHidden: false }
          : section,
      )

      await expect(
        ApplicationsService.prototype['calculateDraftTotalSteps'](
          visibleSections,
          hasSummaryScreen,
        ),
      ).resolves.toBe(visibleTotal)
    },
  )
})

describe('ApplicationsService.getApplication transaction', () => {
  it.each([false, true])(
    'loads the application and its form with a transaction supplied: %s',
    async (withTransaction) => {
      const transaction: Transaction | undefined = withTransaction
        ? {
            commit: jest.fn(),
            rollback: jest.fn(),
            afterCommit: jest.fn(),
            LOCK: Transaction.LOCK,
          }
        : undefined
      const application = { id: 'application-id', formId: 'form-id' }
      const form = {
        id: 'form-id',
        slug: 'form-slug',
        sections: [{ sectionType: SectionTypes.PARTIES, screens: [] }],
      }
      const applicationModel = {
        findOne: jest.fn().mockResolvedValue(application),
      }
      const formModel = {
        findOne: jest.fn().mockResolvedValue(form),
      }
      const service = Object.assign(
        Object.create(ApplicationsService.prototype),
        {
          applicationModel,
          formModel,
          applicationMapper: {
            mapFormToApplicationDto: jest.fn().mockReturnValue({
              id: application.id,
            }),
          },
          logger: { warn: jest.fn(), error: jest.fn() },
        },
      ) as ApplicationsService

      const response = withTransaction
        ? await service.getApplication(
            application.id,
            form.slug,
            null,
            transaction,
          )
        : await service.getApplication(application.id, form.slug, null)

      expect(response.application).toMatchObject({ id: application.id })
      expect(applicationModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: application.id },
          transaction,
        }),
      )
      expect(formModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: form.id },
          transaction,
        }),
      )
    },
  )
})

describe('ApplicationsService.submit payment visibility', () => {
  const user = { nationalId: '0101307789' } as User

  const setupSubmission = ({
    fieldHidden = false,
    screenHidden = false,
    sectionHidden = false,
    fulfilled = false,
    hasSummaryScreen = false,
    fieldType = FieldTypesEnum.PAYMENT as string,
  } = {}) => {
    const application = {
      id: 'application-id',
      formId: 'form-id',
      status: ApplicationStatus.DRAFT as string,
      save: jest.fn().mockResolvedValue(undefined),
    }
    const transaction = { id: 'transaction' }
    const service = {
      applicationModel: {
        findByPk: jest.fn().mockResolvedValue(application),
      },
      formModel: {
        findByPk: jest.fn().mockResolvedValue({
          id: 'form-id',
          hasPayment: true,
          hasSummaryScreen,
        }),
      },
      getLoginTypes: jest.fn().mockResolvedValue([]),
      hasDelegation: jest.fn().mockReturnValue(true),
      doesUserMatchApplication: jest.fn().mockReturnValue(true),
      getApplication: jest.fn().mockResolvedValue({
        application: {
          id: 'application-id',
          hasSummaryScreen,
          sections: [
            {
              sectionType: SectionTypes.PAYMENT,
              isHidden: sectionHidden,
              screens: [
                {
                  isHidden: screenHidden,
                  fields: [{ fieldType, isHidden: fieldHidden }],
                },
              ],
            },
          ],
        },
      }),
      paymentModel: {
        findOne: jest.fn().mockResolvedValue(fulfilled ? { fulfilled } : null),
      },
      applicationEventModel: {
        create: jest.fn().mockResolvedValue({ destroy: jest.fn() }),
      },
      serviceManager: { send: jest.fn().mockResolvedValue(true) },
      logger: { info: jest.fn() },
      sequelize: {
        transaction: jest.fn((callback) => callback(transaction)),
      },
    }
    const instance = Object.assign(
      Object.create(ApplicationsService.prototype),
      service,
    ) as ApplicationsService

    return {
      service,
      application,
      transaction,
      submit: (submittingUser?: User) =>
        ApplicationsService.prototype.submit.call(
          instance,
          application.id,
          submittingUser,
        ),
    }
  }

  it.each([false, true])(
    'submits with hidden payment fields and hasSummaryScreen=%s',
    async (hasSummaryScreen) => {
      const { service, submit } = setupSubmission({
        fieldHidden: true,
        hasSummaryScreen,
      })

      await expect(submit(user)).resolves.toMatchObject({
        submissionFailed: false,
      })
      expect(service.paymentModel.findOne).not.toHaveBeenCalled()
      expect(service.serviceManager.send).toHaveBeenCalledTimes(1)
    },
  )

  it.each([
    { screenHidden: true },
    { sectionHidden: true },
    { fieldType: FieldTypesEnum.PAYMENT_QUANTITY },
  ])('does not require payment for %j', async (settings) => {
    const { service, submit } = setupSubmission(settings)

    await expect(submit(user)).resolves.toMatchObject({
      submissionFailed: false,
    })
    expect(service.paymentModel.findOne).not.toHaveBeenCalled()
  })

  it('rejects an unfulfilled visible payment', async () => {
    const { service, submit } = setupSubmission()

    await expect(submit(user)).rejects.toThrow('Payment not fulfilled')
    expect(service.serviceManager.send).not.toHaveBeenCalled()
  })

  it('allows a fulfilled visible payment to submit without user context', async () => {
    const { submit } = setupSubmission({ fulfilled: true })

    await expect(submit()).resolves.toMatchObject({ submissionFailed: false })
  })

  it('still requires user context when every payment is hidden', async () => {
    const { service, submit } = setupSubmission({ fieldHidden: true })

    await expect(submit()).rejects.toThrow('without user context')
    expect(service.serviceManager.send).not.toHaveBeenCalled()
  })

  it('holds the application lock through sending and saving the completed status', async () => {
    const { service, application, transaction, submit } = setupSubmission({
      fieldHidden: true,
    })
    let transactionActive = false
    service.sequelize.transaction.mockImplementation(async (callback) => {
      transactionActive = true
      try {
        return await callback(transaction)
      } finally {
        transactionActive = false
      }
    })
    service.serviceManager.send.mockImplementation(async () => {
      expect(transactionActive).toBe(true)
      expect(service.applicationModel.findByPk).toHaveBeenCalledWith(
        application.id,
        { transaction, lock: Transaction.LOCK.UPDATE },
      )
      expect(application.save).not.toHaveBeenCalled()
      return true
    })
    application.save.mockImplementation(async () => {
      expect(transactionActive).toBe(true)
      expect(application.status).toBe(ApplicationStatus.COMPLETED)
    })

    await expect(submit(user)).resolves.toMatchObject({
      submissionFailed: false,
    })

    expect(application.save).toHaveBeenCalledWith({ transaction })
    expect(service.getApplication).toHaveBeenCalledWith(
      application.id,
      '',
      null,
      transaction,
    )
    expect(service.applicationEventModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ applicationId: application.id }),
      { transaction },
    )
    expect(transactionActive).toBe(false)
  })

  it.each(['completed', 'deleted'])(
    'does not send if the application was %s while waiting for the row lock',
    async (state) => {
      const { service, application, submit } = setupSubmission({
        fieldHidden: true,
      })
      let releaseLock!: () => void
      const lockReleased = new Promise<void>((resolve) => {
        releaseLock = resolve
      })
      service.applicationModel.findByPk.mockImplementation(async () => {
        await lockReleased
        application.status = ApplicationStatus.COMPLETED
        return state === 'deleted' ? null : application
      })

      const result = submit(user)
      expect(service.serviceManager.send).not.toHaveBeenCalled()
      const rejection = expect(result).rejects.toThrow(
        state === 'deleted' ? 'not found' : 'not a draft',
      )
      releaseLock()
      await rejection

      expect(service.serviceManager.send).not.toHaveBeenCalled()
      expect(service.applicationEventModel.create).not.toHaveBeenCalled()
      expect(application.save).not.toHaveBeenCalled()
    },
  )

  it('keeps the draft eligible for retry when sending fails', async () => {
    const { service, application, transaction, submit } = setupSubmission({
      fieldHidden: true,
    })
    const destroy = jest.fn().mockResolvedValue(undefined)
    service.applicationEventModel.create.mockResolvedValue({ destroy })
    service.serviceManager.send.mockResolvedValue(false)

    await expect(submit(user)).resolves.toMatchObject({
      submissionFailed: true,
    })

    expect(application.status).toBe(ApplicationStatus.DRAFT)
    expect(application.save).not.toHaveBeenCalled()
    expect(destroy).toHaveBeenCalledWith({ transaction })
  })
})
