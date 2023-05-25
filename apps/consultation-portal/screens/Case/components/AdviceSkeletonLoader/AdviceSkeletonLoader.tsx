import { CardSkeleton } from '../../../../components'
import { SkeletonLoader } from '@island.is/island-ui/core'

export const CardSkeletonLoader = () => {
  return (
    <CardSkeleton>
      <SkeletonLoader repeat={4} space={1} />
    </CardSkeleton>
  )
}
export default CardSkeletonLoader
