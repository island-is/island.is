import { AdviceResult, Case } from '../../../../types/interfaces'
import { Stack, Button, Box } from '@island.is/island-ui/core'
import AdviceCard from '../AdviceCard/AdviceCard'
import { SHOW_INITIAL_REVIEWS_AMOUNT } from '../../../../utils/consts/consts'

import { useState } from 'react'
import { hasDatePassed } from '../../../../utils/helpers/dateFunctions'
import localization from '../../Case.json'

interface Props {
  advices: Array<AdviceResult>
  chosenCase: Case
}
function renderAdvices(publishTypeId, processEnds) {
  if (publishTypeId == 3) {
    return false
  } else if (publishTypeId == 2 && !hasDatePassed(processEnds)) {
    return false
  } else return true
}

export const AdviceList = ({ advices, chosenCase }: Props) => {
  const loc = localization['adviceList']
  const [showAll, setShowAll] = useState<boolean>(false)
  const { advicePublishTypeId, processEnds } = chosenCase
  return (
    <Box dataTestId="advices-list">
      {renderAdvices(advicePublishTypeId, processEnds) && (
        <Stack space={3}>
          {advices?.map((advice: AdviceResult, index) => {
            if (!showAll && index < SHOW_INITIAL_REVIEWS_AMOUNT)
              return <AdviceCard advice={advice} key={advice.id} />
            else if (showAll) {
              return <AdviceCard advice={advice} key={advice.id} />
            }
          })}
          {advices?.length > SHOW_INITIAL_REVIEWS_AMOUNT && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="text"
              icon={showAll ? 'chevronUp' : 'chevronDown'}
            >
              {' '}
              {showAll ? loc.buttonHide : loc.buttonShow}
            </Button>
          )}
        </Stack>
      )}
    </Box>
  )
}

export default AdviceList
