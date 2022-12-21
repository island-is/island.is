import {
  Box,
  Text,
  FormStepper,
  FormStepperThemes,
} from '@island.is/island-ui/core'

const CaseTimeline = () => {
  return (
    <Box paddingY={3}>
      <Text variant="h3" color="blue400">
        {'Tímalína máls'}
      </Text>
      <FormStepper
        theme={FormStepperThemes.PURPLE}
        sections={[
          {
            name: 'Samráð fyrirhugað',
          },
          {
            name: 'Til umsagnar',
            children: [
              {
                type: 'SUB_SECTION',
                name: '#Dagsetning',
              },
            ],
          },
          {
            name: 'Niðurstöður í vinnslu',
            children: [
              {
                type: 'SUB_SECTION',
                name: '#Dagsetning',
              },
            ],
          },
          {
            name: 'Niðurstöður birtar',
          },
        ]}
        activeSection={2}
      />
    </Box>
  )
}

export default CaseTimeline
