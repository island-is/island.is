import React, { ReactNode } from 'react'

interface Props {
  isLoading: boolean
  children: ReactNode
  loader: ReactNode
}

const LoadingContainer = ({ isLoading, children, loader }: Props) => {
  return <>{isLoading ? <>{loader}</> : <>{children}</>}</>
}

export default LoadingContainer
