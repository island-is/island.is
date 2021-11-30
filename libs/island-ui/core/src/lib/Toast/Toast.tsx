import * as React from 'react'
import {
  ToastContainer as ToastifyContainer,
  toast as toastify,
  Slide,
} from 'react-toastify'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Icon } from '../Icon/Icon'
import { Text } from '../Text/Text'
import * as toastStyles from './Toast.css'

interface ToastProps {
  hideProgressBar?: boolean
  timeout?: number
  closeButton?: boolean
  useKeyframeStyles?: boolean
}

const RenderMessage = ({
  message,
  type,
}: {
  message: string
  type: 'error' | 'success' | 'warning' | 'info'
}) => {
  const colors = {
    error: 'red400' as const,
    success: 'mint400' as const,
    warning: 'yellow600' as const,
    info: 'blue400' as const,
  }
  const icons = {
    error: 'toasterError' as const,
    success: 'toasterSuccess' as const,
    warning: 'toasterWarning' as const,
    info: 'toasterInfo' as const,
  }
  return (
    <Box display="flex" padding={1} alignItems="flexStart">
      <Box flexShrink={0}>
        <Icon type={icons[type]} color={colors[type]} />
      </Box>
      <Box paddingLeft={2}>
        <Text variant="h5">{message}</Text>
      </Box>
    </Box>
  )
}

export const ToastContainer: React.FC<ToastProps> = ({
  hideProgressBar = false,
  timeout = 5000,
  closeButton = false,
  useKeyframeStyles = true,
}) => {
  return (
    <div
      className={cn(toastStyles.root, {
        [toastStyles.useMotion]: useKeyframeStyles,
      })}
    >
      <ToastifyContainer
        position="bottom-right"
        autoClose={timeout}
        hideProgressBar={hideProgressBar}
        closeButton={closeButton}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </div>
  )
}

export const toast = {
  success: (message: string) =>
    toastify.success(<RenderMessage type="success" message={message} />),
  error: (message: string) =>
    toastify.error(<RenderMessage type="error" message={message} />),
  info: (message: string) =>
    toastify.info(<RenderMessage type="info" message={message} />),
  warning: (message: string) =>
    toastify.warning(<RenderMessage type="warning" message={message} />),
}
