import type { FC } from 'react'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { Conclusion } from '@island.is/judicial-system-web/src/components'

import {
  getCourtOfAppealsConclusion,
  getDistrictCourtConclusion,
} from '../VerdictAppealOverview/VerdictAppealConclusions.logic'

interface Props {
  workingCase: WorkingCase
}

/**
 * The district court's concluding words and, once the court has recorded
 * them and the appeal is marked "Lokið" or completed, its own, in the boxes
 * the ruling appeal's summary uses. The court's
 * own carry no name beneath them: the panel is named on the info card a
 * finished appeal shows.
 */
const VerdictAppealConclusionBoxes: FC<Props> = ({ workingCase }) => {
  const districtCourtConclusion = getDistrictCourtConclusion(workingCase)
  const courtOfAppealsConclusion = getCourtOfAppealsConclusion(workingCase)

  return (
    <>
      {districtCourtConclusion && (
        <Conclusion
          title={districtCourtConclusion.title}
          conclusionText={districtCourtConclusion.text}
          judgeName={districtCourtConclusion.signedBy.join(', ')}
        />
      )}
      {courtOfAppealsConclusion && (
        <Conclusion
          title={courtOfAppealsConclusion.title}
          conclusionText={courtOfAppealsConclusion.text}
        />
      )}
    </>
  )
}

export default VerdictAppealConclusionBoxes
