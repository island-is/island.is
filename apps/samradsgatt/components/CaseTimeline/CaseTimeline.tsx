import React from 'react'
import {
  Box,
  FormStepperV2,
  Text,
  Section,
  // FormStepper,
  FormStepperThemes,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'

interface CaseTimelineProps {
  status: string
  updatedDate: string
}

const CaseTimeline: React.FC<CaseTimelineProps> = ({ status, updatedDate }) => {
  const sections = [
    {
      section: 'Samráð fyrirhugað',
      index: 0,
    },
    {
      section: 'Til umsagnar',
      index: 1,
    },
    {
      section: 'Niðurstöður í vinnslu',
      index: 2,
    },
    {
      section: 'Niðurstöður birtar',
      index: 3,
    },
  ]
  const getSections = (sections) => {
    console.log('in getSection')
    console.log('status:', status)

    const finalSections = []

    let activeSection

    sections.map(({ section, index }) => {
      if (section === status) {
        finalSections.push(
          <Section
            key={index}
            isActive
            section={section}
            theme={FormStepperThemes.PURPLE}
            sectionIndex={index}
            subSections={[
              <Text variant="medium" key="sub1">
                frá {format(new Date(updatedDate), 'dd.MM.yyyy')}
              </Text>,
            ]}
          />,
        )
        activeSection = index
      } else if (section !== status && index > activeSection) {
        finalSections.push(
          <Section
            key={index}
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
            isComplete
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
      <FormStepperV2 sections={getSections(sections)} />
    </Box>
  )
}
export default CaseTimeline
