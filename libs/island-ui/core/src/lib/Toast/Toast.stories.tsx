import React from 'react'
import ToastContainer, { toast } from './Toast'
import { Button } from '../Button/Button'
import { Box } from '../Box'

export default {
  title: 'Alerts/Toast',
  component: ToastContainer,
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
    <ToastContainer />
  </div>
)

export const WithCloseButton = () => (
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
    <ToastContainer closeButton />
  </div>
)

export const LongerMessage = () => (
  <div>
    <Box margin={2}>
      <Button
        onClick={() =>
          toast.error(
            'Eitthvað fór úrskeiðis og allt fór í steik. Heyrðu, hinkraðu augnablik.',
          )
        }
        variant="text"
      >
        Trigger toast
      </Button>
    </Box>
    <ToastContainer />
  </div>
)
