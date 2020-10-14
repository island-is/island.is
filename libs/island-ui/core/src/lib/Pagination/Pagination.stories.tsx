import React, { useState } from 'react'
import { number } from '@storybook/addon-knobs'
import { withDesign } from 'storybook-addon-designs'
import { Pagination } from './Pagination'
import { Box } from '../Box/Box'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=342%3A143'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  decorators: [withDesign],
  parameters: {
    docs: {
      description: {
        component: `[View in Figma](${figmaLink})`,
      },
    },
    design: {
      type: 'figma',
      url: figmaLink,
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
