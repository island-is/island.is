import {
  Box,
  FormStepperV2,
  Text,
  Section,
  // FormStepper,
  FormStepperThemes,
} from '@island.is/island-ui/core'

const CaseTimeline = () => {
  return (
    <Box paddingY={3}>
      <Text variant="h3" color="blue400">
        {'Tímalína máls'}
      </Text>
      <FormStepperV2
        sections={[
          // eslint-disable-next-line react/jsx-key
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
      />
    </Box>
  )
}

export default CaseTimeline
