import { User } from '@island.is/auth-nest-tools'
import {
  AssetTypes,
  FamilyTypes,
  FieldTypesEnum,
  FormStatus,
  SectionTypes,
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
      save: jest.fn().mockResolvedValue(undefined),
    }
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
    }

    return {
      service,
      submit: (submittingUser?: User) =>
        ApplicationsService.prototype.submit.call(
          service as unknown as ApplicationsService,
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
})
