import React, { useState } from 'react'
import Pagination from './Pagination'
import { number } from '@storybook/addon-knobs'
import { Box } from '../Box'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          '[View in Figma](https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=342%3A143)',
      },
    },
  },
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
