import { SkeletonLoader, Stack, Text } from '@island.is/island-ui/core'
import { SimpleCardSkeleton } from '../Card'
import { Advice } from '../../types/viewModels'
import ReviewCard from '../ReviewCard/ReviewCard'

interface Props {
  advices: Array<Advice>
  advicesLoading: boolean
}

const Advices = ({ advices, advicesLoading }: Props) => {
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
      {advices.map((advice: Advice) => {
        return <ReviewCard advice={advice} key={advice.number} />
      })}
    </Stack>
  )
}

export default Advices
