import { Case, UserAdvice } from '../../../../types/interfaces'
import { Stack, Text, Button } from '@island.is/island-ui/core'
import AdviceCard from '../AdviceCard/AdviceCard'
import { SHOW_INITIAL_REVIEWS_AMOUNT } from '../../../../utils/consts/consts'

import { useState } from 'react'
import {
  advicePublishTypeKey,
  advicePublishTypeKeyHelper,
} from '../../../../types/enums'
import { hasDatePassed } from '../../../../utils/helpers/dateFormatter'

interface Props {
  advices: Array<UserAdvice>
  chosenCase: Case
}

export const AdviceList = ({ advices, chosenCase }: Props) => {
  const [showAll, setShowAll] = useState<boolean>(false)
  const { advicePublishTypeId, processEnds } = chosenCase
  if (advicePublishTypeId == 3) {
    return (
      <Text>
        {advicePublishTypeKey[advicePublishTypeKeyHelper[advicePublishTypeId]]}
      </Text>
    )
  }

  if (advicePublishTypeId == 2 && !hasDatePassed(processEnds)) {
    return (
      <Text>
        {` ${
          advicePublishTypeKey[advicePublishTypeKeyHelper[advicePublishTypeId]]
        } `}
      </Text>
    )
  }

  if (advices.length === 0)
    return <Text>Engar umsagnir fundust fyrir þetta mál.</Text>

  return (
    <Stack space={3}>
      {advices?.map((advice: UserAdvice, index) => {
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
          {showAll ? 'Fela umsagnir' : 'Sjá allar umsagnir'}
        </Button>
      )}
    </Stack>
  )
}

export default AdviceList
