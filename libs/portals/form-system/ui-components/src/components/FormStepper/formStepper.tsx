import { FormStepperV2, Section, Text } from '@island.is/island-ui/core'
import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '../../lib'
import { useLocale } from '@island.is/localization'

interface Current<T> {
  data?: T
  index?: number
}

interface Props {
  sections: FormSystemSection[]
  currentSection: Current<FormSystemSection>
  currentScreen?: Current<FormSystemScreen>
}

export const FormStepper = ({
  sections,
  currentSection,
  currentScreen,
}: Props) => {
  const { lang } = useLocale()

  const visibleSections = (sections ?? []).filter(
    (s) => !!s && !s.isHidden && s.sectionType !== SectionTypes.PREMISES,
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
                {screen?.name?.[lang] ?? ''}
              </Text>
            ))}
        />
      ))}
    />
  )
}
