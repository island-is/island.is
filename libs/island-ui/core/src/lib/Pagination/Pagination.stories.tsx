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
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=342%3A143',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=119%3A2',
  }),
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
