import { FormStepperV2, Section, Text } from '@island.is/island-ui/core'
import { FormSystemSection } from '@island.is/api/schema'

interface Current {
  id?: string
  index?: number
}

interface Props {
  sections: FormSystemSection[]
  currentSection: Current
  currentScreen?: Current
}

export const FormStepper = ({ sections, currentSection, currentScreen }: Props) => {
  // const currentSection = sections.find(
  //   (section) => section.isCompleted === false || section.isCompleted === null,
  // )
  // const currentScreen = currentSection?.screens?.find((screen) => screen)

  return (
    <FormStepperV2
      sections={sections.map((section, sectionIndex) => (
        <Section
          sectionIndex={sectionIndex}
          section={section?.name?.is ?? ''}
          isComplete={section?.isCompleted ?? false}
          isActive={section.id === currentSection?.id}
          key={section?.id}
          subSections={section?.screens?.map((screen, screenIndex) => {
            return <Text key={screenIndex} variant={screen?.id === currentScreen?.id ? "h5" : "default"}> {screen?.name?.is ?? ''}</Text>
          })}
        />
      ))}
    />
  )
}
