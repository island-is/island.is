import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <>
      <SkeletonLoader height={70} width="80%" borderRadius="default" />
      <Box marginY={2}>
        <SkeletonLoader height={200} borderRadius="default" />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <SkeletonLoader height={70} width="30%" borderRadius="default" />
        <SkeletonLoader height={70} width="30%" borderRadius="default" />
        <SkeletonLoader height={70} width="30%" borderRadius="default" />
      </Box>
      <Box marginTop={5}>
        <SkeletonLoader height={70} width="40%" borderRadius="default" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={300} borderRadius="default" />
      </Box>
    </>
  )
}

export default Skeleton
