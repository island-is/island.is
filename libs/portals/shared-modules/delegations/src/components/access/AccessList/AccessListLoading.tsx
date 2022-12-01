import { SkeletonLoader } from '@island.is/island-ui/core'

const ROW_LOADING_HEIGHT = 56

interface AccessListLoadingProps {
  rows: number
}

export const AccessListLoading = ({ rows }: AccessListLoadingProps) => (
  <SkeletonLoader
    height={
      // HEADER + ROWS
      ROW_LOADING_HEIGHT + ROW_LOADING_HEIGHT * rows
    }
  />
)
