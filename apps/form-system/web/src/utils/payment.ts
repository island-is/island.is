import { FormSystemSection } from '@island.is/api/schema'
import {
  ApplicationState,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/ui'

export const getVisiblePaymentFields = (sections: FormSystemSection[] = []) =>
  sections
    .filter(
      (section) =>
        !section.isHidden || section.sectionType === SectionTypes.PAYMENT,
    )
    .flatMap((section) => section.screens ?? [])
    .filter((screen) => screen && !screen.isHidden)
    .flatMap((screen) => screen?.fields ?? [])
    .filter(
      (field) =>
        field != null &&
        field.fieldType === FieldTypesEnum.PAYMENT &&
        !field.isHidden,
    )

export const updatePaymentSectionVisibility = (
  sections: FormSystemSection[],
  hasPayment?: boolean | null,
): FormSystemSection[] => {
  const isHidden =
    hasPayment === false || getVisiblePaymentFields(sections).length === 0

  return sections.map((section) =>
    section.sectionType === SectionTypes.PAYMENT
      ? { ...section, isHidden }
      : section,
  )
}

export const getPaymentFlow = (state: ApplicationState) => {
  const requiresPayment =
    state.application.hasPayment !== false &&
    getVisiblePaymentFields(state.sections).length > 0
  const currentSectionType = state.currentSection.data.sectionType
  const hasSummary =
    state.application.hasSummaryScreen !== false &&
    state.sections.some(
      (section) =>
        section.sectionType === SectionTypes.SUMMARY && !section.isHidden,
    )
  const lastVisibleScreen = state.sections
    .filter(
      (section) =>
        !section.isHidden &&
        section.sectionType !== SectionTypes.COMPLETED &&
        section.sectionType !== SectionTypes.PAYMENT,
    )
    .flatMap((section) => section.screens ?? [])
    .filter((screen) => screen && !screen.isHidden)
    .at(-1)

  return {
    shouldShowPay:
      requiresPayment &&
      (currentSectionType === SectionTypes.PAYMENT ||
        currentSectionType === SectionTypes.SUMMARY),
    onSubmit:
      currentSectionType === SectionTypes.PAYMENT ||
      (currentSectionType === SectionTypes.SUMMARY && !requiresPayment) ||
      (!requiresPayment &&
        !hasSummary &&
        lastVisibleScreen?.id != null &&
        state.currentScreen?.data?.id === lastVisibleScreen.id),
  }
}
