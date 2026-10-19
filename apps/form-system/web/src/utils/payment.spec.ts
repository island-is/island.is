import { FormSystemSection } from '@island.is/api/schema'
import {
  ApplicationState,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/ui'
import { setFieldValue } from '../reducers/fieldReducerUtils'
import {
  getPaymentFlow,
  getVisiblePaymentFields,
  updatePaymentSectionVisibility,
} from './payment'

jest.mock('@island.is/form-system/ui', () => ({
  FieldTypesEnum: {
    PAYMENT: 'PAYMENT',
    PAYMENT_QUANTITY: 'PAYMENT_QUANTITY',
    CHECKBOX: 'CHECKBOX',
  },
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
}))

const paymentSections = (
  fieldHidden: boolean,
  screenHidden = false,
): FormSystemSection[] => [
  {
    id: 'payment-section',
    sectionType: SectionTypes.PAYMENT,
    isHidden: true,
    screens: [
      {
        id: 'payment-screen',
        sectionId: 'payment-section',
        isHidden: screenHidden,
        fields: [
          {
            id: 'payment',
            screenId: 'payment-screen',
            name: { is: 'Payment', en: 'Payment' },
            isPartOfMultiset: false,
            isRequired: false,
            fieldType: FieldTypesEnum.PAYMENT,
            isHidden: fieldHidden,
          },
          {
            id: 'payment-quantity',
            screenId: 'payment-screen',
            name: { is: 'Quantity', en: 'Quantity' },
            isPartOfMultiset: false,
            isRequired: false,
            fieldType: FieldTypesEnum.PAYMENT_QUANTITY,
          },
        ],
      },
    ],
  },
]

describe('getVisiblePaymentFields', () => {
  it('excludes hidden payments', () => {
    expect(getVisiblePaymentFields(paymentSections(true))).toEqual([])
  })

  it('excludes payments on hidden screens', () => {
    expect(getVisiblePaymentFields(paymentSections(false, true))).toEqual([])
  })

  it('finds visible payments even when the payment section was hidden', () => {
    expect(getVisiblePaymentFields(paymentSections(false))).toEqual([
      expect.objectContaining({ id: 'payment' }),
    ])
  })

  it('excludes payments in hidden input sections', () => {
    const sections = paymentSections(false)
    sections[0].sectionType = SectionTypes.INPUT
    expect(getVisiblePaymentFields(sections)).toEqual([])
  })

  it('handles an application without payment sections', () => {
    expect(getVisiblePaymentFields()).toEqual([])
  })
})

const applicationState = (
  paymentHidden = true,
  hasSummaryScreen = false,
): ApplicationState => {
  const sections: FormSystemSection[] = [
    {
      id: 'input-section',
      sectionType: SectionTypes.INPUT,
      isHidden: false,
      screens: [
        {
          id: 'input',
          sectionId: 'input-section',
          isHidden: false,
          fields: [
            {
              id: 'controller',
              screenId: 'input',
              name: { is: 'Controller', en: 'Controller' },
              isPartOfMultiset: false,
              isRequired: false,
              fieldType: FieldTypesEnum.CHECKBOX,
            },
          ],
        },
        { id: 'hidden-input', sectionId: 'input-section', isHidden: true },
      ],
    },
    {
      id: 'summary-section',
      sectionType: SectionTypes.SUMMARY,
      isHidden: !hasSummaryScreen,
    },
    ...paymentSections(paymentHidden),
    {
      id: 'completed-section',
      sectionType: SectionTypes.COMPLETED,
      screens: [
        { id: 'completed', sectionId: 'completed-section', isHidden: false },
      ],
    },
  ]

  return {
    application: { id: 'application', hasPayment: true, hasSummaryScreen },
    sections,
    screens: [],
    currentSection: { index: 0, data: sections[0] },
    currentScreen: { index: 0, data: sections[0].screens?.[0] ?? undefined },
    errors: [],
    screenError: {
      hasError: false,
      title: { is: '', en: '' },
      message: { is: '', en: '' },
    },
  }
}

describe('payment submission flow', () => {
  it('submits from the last visible input screen when all payments are hidden', () => {
    expect(getPaymentFlow(applicationState())).toEqual({
      shouldShowPay: false,
      onSubmit: true,
    })
  })

  it('does not submit from earlier input screens', () => {
    const state = applicationState()
    state.sections[0].screens?.push({
      id: 'later-input',
      sectionId: 'input-section',
      isHidden: false,
    })
    expect(getPaymentFlow(state).onSubmit).toBe(false)
  })

  it('continues to the summary when payments are hidden', () => {
    expect(getPaymentFlow(applicationState(true, true))).toEqual({
      shouldShowPay: false,
      onSubmit: false,
    })
  })

  it('submits instead of paying on the summary when payments are hidden', () => {
    const state = applicationState(true, true)
    state.currentSection = { index: 1, data: state.sections[1] }
    state.currentScreen = undefined
    expect(getPaymentFlow(state)).toEqual({
      shouldShowPay: false,
      onSubmit: true,
    })
  })

  it.each([SectionTypes.SUMMARY, SectionTypes.PAYMENT])(
    'keeps the pay action on %s when a payment is visible',
    (sectionType) => {
      const state = applicationState(false, true)
      const index = state.sections.findIndex(
        (section) => section.sectionType === sectionType,
      )
      state.currentSection = { index, data: state.sections[index] }
      expect(getPaymentFlow(state).shouldShowPay).toBe(true)
    },
  )

  it('hides and restores the payment section as payments change visibility', () => {
    expect(
      updatePaymentSectionVisibility(paymentSections(true), true)[0].isHidden,
    ).toBe(true)
    expect(
      updatePaymentSectionVisibility(paymentSections(false), true)[0].isHidden,
    ).toBe(false)
    expect(
      updatePaymentSectionVisibility(paymentSections(false), false)[0].isHidden,
    ).toBe(true)
  })

  it('updates navigation and submission after changing a payment dependency', () => {
    const state = applicationState()
    state.application.dependencies = [
      {
        parentProp: 'controller',
        childProps: ['payment', 'hidden-input'],
        isSelected: false,
      },
    ]

    const paidState = setFieldValue(state, 'checkboxValue', 'controller', true)
    expect(paidState.sections[2].isHidden).toBe(false)
    expect(paidState.sections[1].isHidden).toBe(true)
    expect(getPaymentFlow(paidState).onSubmit).toBe(false)

    const unpaidState = setFieldValue(
      paidState,
      'checkboxValue',
      'controller',
      false,
    )
    expect(unpaidState.sections[2].isHidden).toBe(true)
    expect(unpaidState.sections[1].isHidden).toBe(true)
    expect(getPaymentFlow(unpaidState)).toEqual({
      shouldShowPay: false,
      onSubmit: true,
    })
  })
})
