import { Box, SkeletonLoader } from '@island.is/island-ui/core'

export const Skeleton = () => {
  return (
    <Box marginTop={[5, 10]}>
      <SkeletonLoader
        height={150}
        borderRadius="default"
        repeat={3}
        space={2}
      />
    </Box>
  )
}

export const OwnerParliamentarySkeleton = () => {
  return (
    <SkeletonLoader height={150} borderRadius="default" repeat={6} space={2} />
  )
}

export const SkeletonTable = () => {
  return (
    <Box marginTop={5}>
      <SkeletonLoader height={700} borderRadius="default" />
    </Box>
  )
}

export const CollectorSkeleton = () => {
  return <SkeletonLoader height={50} borderRadius="default" />
}

export const SingleListSkeleton = () => {
  return <SkeletonLoader height={150} borderRadius="default" />
}
