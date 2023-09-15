import { Case } from '../../../../types/interfaces'
import { getStatusEndDate } from '../../../../utils/helpers/dateFunctions'
import {
  FormStepperV2,
  Text,
  Section,
  FormStepperThemes,
  Stack,
} from '@island.is/island-ui/core'
import localization from '../../Case.json'
import { MapCaseStatuses } from '../../../../types/enums'
import { useIsMobile } from '../../../../hooks'

interface CaseTimelineProps {
  chosenCase: Case
}

const Sections = ['Til umsagnar', 'Niðurstöður í vinnslu', 'Niðurstöður birtar']

export const CaseTimeline = ({ chosenCase }: CaseTimelineProps) => {
  const loc = localization['timeline']
  const { isMobile } = useIsMobile()

  const sectionItems = Sections.map((item, index) => (
    <Section
      key={index}
      isActive={
        Sections.indexOf(chosenCase.statusName) == 0
          ? item === chosenCase.statusName
          : Sections.indexOf(chosenCase.statusName) == 1 &&
            Sections.indexOf(item) == 2
          ? false
          : true
      }
      section={MapCaseStatuses[Sections[index]]}
      theme={FormStepperThemes.PURPLE}
      sectionIndex={index}
      subSections={[
        <Text variant="medium" key="sub0">
          {getStatusEndDate(Sections[index], chosenCase)}
        </Text>,
      ]}
      isComplete={
        Sections.indexOf(chosenCase.statusName) > Sections.indexOf(item)
      }
    />
  ))

  return (
    <Stack space={[2, 2, 2, 1, 1]}>
      {!isMobile && (
        <Text variant="h3" color="blue400">
          {loc.title}
        </Text>
      )}
      <FormStepperV2 sections={sectionItems} />
    </Stack>
  )
}
export default CaseTimeline
