import React, { useState } from 'react'

import { withFigma } from '../../utils/withFigma'
import { Pagination } from './Pagination'
import { Box } from '../Box/Box'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: withFigma('Pagination'),
}

export const Default = ({ totalPages }) => {
  const [page, setPage] = useState(10)

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      renderLink={(page, className, children) => (
        <Box
          cursor="pointer"
          className={className}
          onClick={() => setPage(page)}
        >
          {children}
        </Box>
      )}
    />
  )
}

Default.args = {
  totalPages: 20,
}
