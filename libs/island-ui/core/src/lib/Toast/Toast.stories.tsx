import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Button } from '../Button/Button'
import { Box } from '../Box/Box'
import { ToastContainer, toast } from './Toast'

export default {
  title: 'Alerts/Toast',
  component: ToastContainer,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=205%3A62',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=1%3A12',
  }),
}

const Template = (args) => (
  <div>
    <Box margin={2}>
      <Button onClick={() => toast.success('Success message')} variant="text">
        Trigger success
      </Button>
    </Box>
    <Box margin={2}>
      <Button onClick={() => toast.error('Error message')} variant="text">
        Trigger error
      </Button>
    </Box>
    <Box margin={2}>
      <Button onClick={() => toast.info('Info message')} variant="text">
        Trigger info
      </Button>
    </Box>
    <Box margin={2}>
      <Button onClick={() => toast.warning('Warning message')} variant="text">
        Trigger warning
      </Button>
    </Box>
    <ToastContainer {...args} />
  </div>
)

export const Primary = Template.bind({})
