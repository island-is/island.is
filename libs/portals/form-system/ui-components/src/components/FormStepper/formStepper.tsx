import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { FormStepperV2, Section, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldTypesEnum, SectionTypes } from '../../lib'

interface Current<T> {
  data?: T
  index?: number
}

interface Props {
  sections: FormSystemSection[]
  currentSection: Current<FormSystemSection>
  currentScreen?: Current<FormSystemScreen>
  hasSummaryScreen: boolean
  hasPayment: boolean
}

export const FormStepper = ({
  sections,
  currentSection,
  currentScreen,
  hasSummaryScreen,
  hasPayment,
}: Props) => {
  const { lang } = useLocale()

  const visibleSections = (sections ?? []).filter(
    (s) =>
      !!s &&
      !s.isHidden &&
      s.sectionType !== SectionTypes.PREMISES &&
      (s.sectionType !== SectionTypes.SUMMARY || hasSummaryScreen) &&
      (s.sectionType !== SectionTypes.COMPLETED ||
        currentSection.data?.sectionType === SectionTypes.COMPLETED) &&
      (s.sectionType !== SectionTypes.PAYMENT ||
        (hasPayment && !hasSummaryScreen)),
  )
  const activeSectionId = currentSection?.data?.id
  const activeScreenId = currentScreen?.data?.id

  return (
    <FormStepperV2
      sections={visibleSections.map((section, visIndex) => (
        <Section
          key={section.id}
          sectionIndex={visIndex}
          section={section?.name?.[lang] ?? ''}
          isComplete={Boolean(section?.isCompleted)}
          isActive={section?.id === activeSectionId}
          subSections={(section?.screens ?? [])
            .filter((screen) => !!screen && !screen.isHidden)
            .map((screen) => (
              <Text
                key={screen?.id ?? ''}
                variant={screen?.id === activeScreenId ? 'h5' : 'default'}
              >
                {section.sectionType === SectionTypes.PARTIES
                  ? (screen?.fields ?? []).find(
                      (f) => f?.fieldType === FieldTypesEnum.APPLICANT,
                    )?.name?.[lang] ??
                    screen?.name?.[lang] ??
                    ''
                  : screen?.name?.[lang] ?? ''}
              </Text>
            ))}
        />
      ))}
    />
  )
}
