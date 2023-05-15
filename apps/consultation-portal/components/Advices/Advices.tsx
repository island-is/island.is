import { Button, Stack, Text } from '@island.is/island-ui/core'
import ReviewCard from '../ReviewCard/ReviewCard'
import { UserAdvice } from '../../types/interfaces'
import { useState } from 'react'
import {
  advicePublishTypeKey,
  advicePublishTypeKeyHelper,
} from '../../types/enums'
import { hasDatePassed } from '../../utils/helpers/dateFormatter'
import { SHOW_INITIAL_REVIEWS_AMOUNT } from '../../utils/consts/consts'

interface Props {
  advices: Array<UserAdvice>
  publishType?: number
  processEndDate: Date | string
}

const Advices = ({ advices, publishType, processEndDate }: Props) => {
  const [showAll, setShowAll] = useState<boolean>(false)

  if (publishType == 3) {
    return (
      <Text>
        {advicePublishTypeKey[advicePublishTypeKeyHelper[publishType]]}
      </Text>
    )
  }

  if (publishType == 2 && !hasDatePassed(processEndDate)) {
    return (
      <Text>
        {` ${advicePublishTypeKey[advicePublishTypeKeyHelper[publishType]]} `}
      </Text>
    )
  }

  return (
    <Stack space={3}>
      {advices?.map((advice: UserAdvice, index) => {
        if (!showAll && index < SHOW_INITIAL_REVIEWS_AMOUNT)
          return <ReviewCard advice={advice} key={advice.id} />
        else if (showAll) {
          return <ReviewCard advice={advice} key={advice.id} />
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

export default Advices
