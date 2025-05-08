import React, { FC } from 'react'
import {
  ToastContainer as ToastifyContainer,
  toast as toastify,
  Slide,
  ToastOptions,
} from 'react-toastify'
import cn from 'classnames'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import * as toastStyles from './Toast.css'
import { Icon } from '../IconRC/Icon'

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
    error: 'warning',
    success: 'checkmarkCircle',
    warning: 'warning',
    info: 'informationCircle',
  } as const

  return (
    <Box display="flex" alignItems="center">
      <Box display="flex">
        <Icon icon={icons[type]} color={colors[type]} size="large" />
      </Box>
      <Box paddingLeft={2}>
        <Text variant="h5">{message}</Text>
      </Box>
    </Box>
  )
}

export const ToastContainer: FC<ToastProps> = ({
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
        icon={false}
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
