import React from 'react'
import Toast, { toast } from './Toast'
import { Button } from '../Button/Button'
import { Box } from '../Box'

export default {
  title: 'Alerts/Toast',
  component: Toast,
}

export const Default = () => (
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
    <Toast />
  </div>
)

export const LongerMessage = () => (
  <div>
    <Box margin={2}>
      <Button
        onClick={() =>
          toast.error('Eitthvað fór úrskeiðis og allt fór í steik')
        }
        variant="text"
      >
        Trigger toast
      </Button>
    </Box>
    <Toast />
  </div>
)
