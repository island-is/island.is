import { SkeletonLoader, Table as T } from '@island.is/island-ui/core'

const RowData = () => {
  return (
    <T.Data>
      <SkeletonLoader height={50} width="100%" borderRadius="large" />
    </T.Data>
  )
}

export const Skeleton = () => {
  return (
    <T.Row>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <RowData key={i} />
        ))}
    </T.Row>
  )
}

export const SkeletonSingleRow = () => {
  return <SkeletonLoader height={90} width="100%" borderRadius="large" />
}
