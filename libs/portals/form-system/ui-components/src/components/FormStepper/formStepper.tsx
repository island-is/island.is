import { FormStepperV2, Section, Text } from '@island.is/island-ui/core'
import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '../../lib'

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
  const filteredSections = sections.filter(
    (section) => section.sectionType !== SectionTypes.PREMISES,
  )
  if (currentSection.index === 0) return null

  return (
    <FormStepperV2
      sections={filteredSections.map((section, sectionIndex) => (
        <Section
          sectionIndex={sectionIndex}
          section={section?.name?.is ?? ''}
          isComplete={section?.isCompleted ?? false}
          isActive={section.id === currentSection?.data?.id}
          key={section?.id}
          subSections={section?.screens?.map((screen) => {
            return (
              <Text
                key={screen?.id}
                variant={
                  screen?.id === currentScreen?.data?.id ? 'h5' : 'default'
                }
              >
                {' '}
                {screen?.name?.is ?? ''}
              </Text>
            )
          })}
        />
      ))}
    />
  )
}
