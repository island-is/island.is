import React from 'react'
import {
  Box,
  FormStepperV2,
  Text,
  Section,
  // FormStepper,
  FormStepperThemes,
} from '@island.is/island-ui/core'

interface CaseTimelineProps {
  status: string
}

const CaseTimeline: React.FC<CaseTimelineProps> = ({ status }) => {
  status = 'Niðurstöður í vinnslu'
  const sections = [
    {
      section: 'Samráð fyrirhugað',
      index: 1,
    },
    {
      section: 'Til umsagnar',
      index: 2,
    },
    {
      section: 'Niðurstöður í vinnslu',
      index: 3,
    },
    {
      section: 'Niðurstöður birtar',
      index: 4,
    },
  ]

  const getSections = (sections) => {
    console.log('in getSection')
    console.log('sections:', sections)
    const finalSections = []

    sections.map(({ section, index }) => {
      if (section === status) {
        finalSections.push(
          <Section
            key={index}
            isActive
            section={section}
            theme={FormStepperThemes.PURPLE}
            sectionIndex={index}
          />,
        )
      } else {
        finalSections.push(
          <Section
            key={index}
            section={section}
            theme={FormStepperThemes.PURPLE}
            sectionIndex={index}
          />,
        )
      }
    })
    return finalSections
  }
  return (
    <Box paddingY={3}>
      <Text variant="h3" color="blue400">
        {'Tímalína máls'}
      </Text>
      {/* <FormStepperV2
        sections={[
          <Section
            key={0}
            isComplete
            section="Samráð fyrirhugað"
            theme={FormStepperThemes.PURPLE}
            sectionIndex={0}
          />,

          <Section
            key={1}
            isComplete
            section="Til umsagnar"
            theme={FormStepperThemes.PURPLE}
            sectionIndex={1}
            subSections={[<Text key="sub1">Dagsetning</Text>]} // TODO: change to fontsize 16
          />,
          <Section
            key={2}
            isComplete
            section="Niðurstöður í vinnslu"
            theme={FormStepperThemes.PURPLE}
            sectionIndex={2}
            isActive
            subSections={[<Text key="sub1">Dagsetning</Text>]} // TODO: change to fontsize 16
          />,
          <Section
            key={3}
            isComplete
            section="Niðurstöður birtar"
            theme={FormStepperThemes.PURPLE}
            sectionIndex={3}
          />,
        ]}
      /> */}
      <FormStepperV2 sections={getSections(sections)} />
    </Box>
  )
}
export default CaseTimeline
