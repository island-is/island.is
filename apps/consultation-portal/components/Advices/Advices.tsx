import { Button, SkeletonLoader, Stack, Text } from '@island.is/island-ui/core'
import { SimpleCardSkeleton } from '../Card'
import ReviewCard from '../ReviewCard/ReviewCard'
import { UserAdvice } from '../../types/interfaces'
import { useState } from 'react'

interface Props {
  advices: Array<UserAdvice>
  advicesLoading: boolean
}

const Advices = ({ advices, advicesLoading }: Props) => {
  const [showAll, setShowAll] = useState<boolean>(false)
  const showAmount = 4
  if (advicesLoading) {
    return (
      <SimpleCardSkeleton borderColor="blue200">
        <SkeletonLoader repeat={4} space={1} />
      </SimpleCardSkeleton>
    )
  }
  if (!advicesLoading && advices?.length === 0) {
    return <Text>Engar umsagnir fundust fyrir þetta mál.</Text>
  }

  return (
    <Stack space={3}>
      {advices.map((advice: UserAdvice, index) => {
        if (!showAll && index < showAmount)
          return <ReviewCard advice={advice} key={advice.id} />
        else if (showAll) {
          return <ReviewCard advice={advice} key={advice.id} />
        }
      })}
      <Button
        onClick={() => setShowAll(!showAll)}
        variant="text"
        icon={showAll ? 'chevronUp' : 'chevronDown'}
      >
        {' '}
        {showAll ? 'Fela umsagnir' : 'Sjá allar umsagnir'}
      </Button>
    </Stack>
  )
}

export default Advices
