import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <>
      <SkeletonLoader height={70} width="80%" borderRadius="large" />
      <Box marginY={2}>
        <SkeletonLoader height={200} borderRadius="large" />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <SkeletonLoader height={70} width="30%" borderRadius="large" />
        <SkeletonLoader height={70} width="30%" borderRadius="large" />
        <SkeletonLoader height={70} width="30%" borderRadius="large" />
      </Box>
      <Box marginTop={5}>
        <SkeletonLoader height={70} width="40%" borderRadius="large" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={300} borderRadius="large" />
      </Box>
    </>
  )
}

export default Skeleton
