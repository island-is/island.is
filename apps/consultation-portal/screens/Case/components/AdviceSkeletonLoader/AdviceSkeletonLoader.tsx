import { SimpleCardSkeleton } from '../../../../components/Card'
import { SkeletonLoader } from '@island.is/island-ui/core'

export const CardSkeletonLoader = () => {
  return (
    <SimpleCardSkeleton>
      <SkeletonLoader repeat={4} space={1} />
    </SimpleCardSkeleton>
  )
}
export default CardSkeletonLoader
