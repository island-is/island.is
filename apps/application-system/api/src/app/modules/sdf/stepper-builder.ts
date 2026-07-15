import {
  Section,
  SubSection,
  FormItemTypes,
} from '@island.is/application/types'
import { StepperDto, StepperSectionDto } from './dto/screen.dto'
import { FormTextResolver } from './i18n-resolver.service'

export const buildStepper = (
  sections: Section[],
  activeSectionIndex: number,
  activeSubSectionIndex: number,
  resolver: FormTextResolver,
): StepperDto => {
  // Sections with an empty title are intentionally untitled (e.g. the
  // prerequisites/external-data sections in NOT_STARTED forms). The legacy
  // `FormStepper` drops these so no empty bullet is shown; mirror that here.
  // We keep each section's original index so `isComplete`/active highlighting
  // stay correct, then remap `activeSectionIndex` to its position in the
  // filtered list.
  const visibleSections = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => resolver.resolve(section.title).trim() !== '')

  const stepperSections: StepperSectionDto[] = visibleSections.map(
    ({ section, index }) => {
      const subSections = (section.children ?? []).filter(
        (child) => child.type === FormItemTypes.SUB_SECTION,
      ) as SubSection[]

      return {
        id: typeof section.id === 'string' ? section.id : `section-${index}`,
        title: resolver.resolve(section.title),
        isComplete: index < activeSectionIndex,
        children: subSections.map((sub, subIdx) => ({
          id:
            typeof sub.id === 'string'
              ? sub.id
              : `subsection-${index}-${subIdx}`,
          title: resolver.resolve(sub.title),
        })),
      }
    },
  )

  const remappedActiveSectionIndex = visibleSections.findIndex(
    ({ index }) => index === activeSectionIndex,
  )

  return {
    sections: stepperSections,
    activeSectionIndex:
      remappedActiveSectionIndex >= 0 ? remappedActiveSectionIndex : 0,
    activeSubSectionIndex,
  }
}
