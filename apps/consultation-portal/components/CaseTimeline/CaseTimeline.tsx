import {
  FormStepperV2,
  Text,
  Section,
  FormStepperThemes,
  Stack,
} from '@island.is/island-ui/core'

interface CaseTimelineProps {
  status: string
  updatedDate: string
}

const Sections = ['Til umsagnar', 'Niðurstöður í vinnslu', 'Niðurstöður birtar']

export const CaseTimeline = ({ status, updatedDate }: CaseTimelineProps) => {
  const sectionItems = Sections.map((item, index) => (
    <Section
      key={index}
      isActive={item === status}
      section={item}
      theme={FormStepperThemes.PURPLE}
      sectionIndex={index}
      subSections={
        item === status && [
          <Text variant="medium" key="sub1">
            {updatedDate}
          </Text>,
        ]
      }
      isComplete={Sections.indexOf(status) > Sections.indexOf(item)}
    />
  ))

  return (
    <Stack space={[2, 2, 2, 1, 1]}>
      <Text variant="h3" color="blue400">
        Tímalína máls
      </Text>
      <FormStepperV2 sections={sectionItems} />
    </Stack>
  )
}
export default CaseTimeline
