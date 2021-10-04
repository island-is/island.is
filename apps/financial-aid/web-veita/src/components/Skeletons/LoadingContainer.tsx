import React, { ReactNode } from 'react'
import { SkeletonLoader, Box } from '@island.is/island-ui/core'

interface Props {
  isLoading: boolean
  children: ReactNode
  loader: ReactNode
}

const LoadingContainer = ({ isLoading, children, loader }: Props) => {
  return <>{isLoading ? <>{loader}</> : <>{children}</>}</>
}

export default LoadingContainer
