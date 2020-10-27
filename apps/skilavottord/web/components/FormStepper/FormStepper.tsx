import React from 'react'
import {
  Box,
  FormStepper as IslandUIFormStepper,
  FormStepperSection,
  Stack,
  Text,
} from '@island.is/island-ui/core'

interface ProcessProps {
  title: string
  completedText: string
  sections: FormStepperSection[]
  activeSection: number
  activeCar?: string
}

const FormStepper = ({
  title,
  completedText,
  sections,
  activeSection,
  activeCar,
}: ProcessProps) => (
  <Box padding={4}>
    <Stack space={4}>
      <Box>
        <Text variant="h3">{title}</Text>
        <Text variant="intro">{activeCar}</Text>
        <Text variant="intro">
          {activeSection < sections.length
            ? `Step ${activeSection + 1} out of ${sections.length}`
            : completedText}
        </Text>
      </Box>
      <IslandUIFormStepper sections={sections} activeSection={activeSection} />
    </Stack>
  </Box>
)

export default FormStepper
