import React, { useState } from 'react'
import { number } from '@storybook/addon-knobs'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Pagination } from './Pagination'
import { Box } from '../Box/Box'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  decorators: [withDesign],
  parameters: withFigma('Pagination'),
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
