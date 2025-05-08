import { FormStepperV2, Section, Text } from '@island.is/island-ui/core'
import { FormSystemSection } from '@island.is/api/schema'

interface Props {
  sections: FormSystemSection[]
}

export const FormStepper = ({ sections }: Props) => {
  const currentSection = sections.find(
    (section) => section.isCompleted === false || section.isCompleted === null,
  )

  return (
    <FormStepperV2
      sections={sections.map((section, sectionIndex) => (
        <Section
          sectionIndex={sectionIndex}
          section={section?.name?.is ?? ''}
          isComplete={section?.isCompleted ?? false}
          isActive={section.id === currentSection?.id}
          subSections={section?.screens?.map((screen, screenIndex) => {
            return <Text key={screenIndex}> {screen?.name?.is ?? ''}</Text>
          })}
        />
      ))}
    />
  )
}
