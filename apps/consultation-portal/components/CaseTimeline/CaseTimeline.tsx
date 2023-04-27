import { Case } from '../../types/interfaces'
import { getTimeLineDate } from '../../utils/helpers/dateFormatter'
import {
  FormStepperV2,
  Text,
  Section,
  FormStepperThemes,
  Stack,
} from '@island.is/island-ui/core'

interface CaseTimelineProps {
  chosenCase: Case
}

const Sections = ['Til umsagnar', 'Niðurstöður í vinnslu', 'Niðurstöður birtar']
const SectionsRenamed = ['Til umsagnar', 'Í vinnslu', 'Lokið']

export const CaseTimeline = ({ chosenCase }: CaseTimelineProps) => {
  const sectionItems = Sections.map((item, index) => (
    <Section
      key={index}
      isActive={item === chosenCase.statusName}
      section={SectionsRenamed[index]}
      theme={FormStepperThemes.PURPLE}
      sectionIndex={index}
      subSections={[
        <Text variant="medium" key="sub0">
          {getTimeLineDate({ Case: chosenCase })}
        </Text>,
      ]}
      isComplete={
        Sections.indexOf(chosenCase.statusName) > Sections.indexOf(item)
      }
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
