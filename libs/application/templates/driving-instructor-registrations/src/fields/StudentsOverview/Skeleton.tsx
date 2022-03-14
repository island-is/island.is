import React from 'react'
import {
  Box,
  SkeletonLoader,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <T.Body>
      {Array(10).fill(
        <T.Row>
          <T.Data box={{ textAlign: 'center' }}>
            <SkeletonLoader height={30} width="100%" borderRadius="large" />
          </T.Data>
          <T.Data box={{ textAlign: 'center' }}>
            <SkeletonLoader height={30} width="100%" borderRadius="large" />
          </T.Data>
          <T.Data box={{ textAlign: 'center' }}>
            <SkeletonLoader height={30} width="50%" borderRadius="large" />
          </T.Data>
          <T.Data></T.Data>
        </T.Row>,
      )}
    </T.Body>
  )
}

export default Skeleton
