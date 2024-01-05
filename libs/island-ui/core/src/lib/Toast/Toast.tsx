import * as React from 'react'
import {
  ToastContainer as ToastifyContainer,
  toast as toastify,
  Slide,
  ToastOptions,
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
    error: 'red400',
    success: 'mint400',
    warning: 'yellow600',
    info: 'blue400',
  } as const
  const icons = {
    error: 'toasterError',
    success: 'toasterSuccess',
    warning: 'toasterWarning',
    info: 'toasterInfo',
  } as const

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

export const ToastContainer: React.FC<React.PropsWithChildren<ToastProps>> = ({
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

type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastFunction = (message: string, options?: ToastOptions) => void

type Toast = {
  [key in ToastType]: ToastFunction
}

export const toast: Toast = {
  success: (message, options) =>
    toastify.success(
      <RenderMessage type="success" message={message} />,
      options,
    ),
  error: (message, options) =>
    toastify.error(<RenderMessage type="error" message={message} />, options),
  info: (message, options) =>
    toastify.info(<RenderMessage type="info" message={message} />, options),
  warning: (message, options) =>
    toastify.warning(
      <RenderMessage type="warning" message={message} />,
      options,
    ),
}
