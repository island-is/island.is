import React, { useState } from 'react'
import Pagination from './Pagination'
import { number } from '@storybook/addon-knobs'
import { Box } from '../Box'

export default {
  title: 'Components/Pagination',
  component: Pagination,
}

export const Default = () => {
  const [page, setPage] = useState(10)
  const totalPages = number('Total pages', 20)

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
