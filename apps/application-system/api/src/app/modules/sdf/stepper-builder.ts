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
  const stepperSections: StepperSectionDto[] = sections.map(
    (section, index) => {
      const subSections = (section.children ?? []).filter(
        (child) => child.type === FormItemTypes.SUB_SECTION,
      ) as SubSection[]

      return {
        id: section.id ?? `section-${index}`,
        title: resolver.resolve(section.title),
        isComplete: index < activeSectionIndex,
        children: subSections.map((sub, subIdx) => ({
          id: sub.id ?? `subsection-${index}-${subIdx}`,
          title: resolver.resolve(sub.title),
        })),
      }
    },
  )

  return {
    sections: stepperSections,
    activeSectionIndex,
    activeSubSectionIndex,
  }
}
