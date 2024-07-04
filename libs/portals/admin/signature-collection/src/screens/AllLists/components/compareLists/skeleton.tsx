import { SkeletonLoader, Table as T } from '@island.is/island-ui/core'

export const Skeleton = () => {
  return (
    <T.Row>
      <T.Data>
        <SkeletonLoader height={50} width="100%" borderRadius="large" />
      </T.Data>
      <T.Data>
        <SkeletonLoader height={50} width="100%" borderRadius="large" />
      </T.Data>
      <T.Data>
        <SkeletonLoader height={50} width="100%" borderRadius="large" />
      </T.Data>
      <T.Data>
        <SkeletonLoader height={50} width="100%" borderRadius="large" />
      </T.Data>
    </T.Row>
  )
}
