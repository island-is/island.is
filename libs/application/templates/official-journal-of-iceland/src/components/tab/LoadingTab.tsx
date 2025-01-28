import { SkeletonLoader } from '@island.is/island-ui/core'

interface Props {
  loading?: boolean
  children: React.ReactNode
}

export const LoadingTab = ({ loading, children }: Props) => {
  return loading ? <SkeletonLoader /> : children
}
