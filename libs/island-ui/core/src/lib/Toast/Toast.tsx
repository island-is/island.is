import React from 'react'
import { ToastContainer, toast as toastify, ToastOptions } from 'react-toastify'
import { Box } from '../Box'
import Icon from '../Icon/Icon'
import { Inline } from '../Inline/Inline'
import Typography from '../Typography/Typography'
import * as toastStyles from './Toast.treat'
import { toastKeyframes } from './toastKeyframes'

declare module 'react' {
  // Make React recognize `jsx` prop on the style element.
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean
  }
}

interface ToastProps {
  hideProgressBar?: boolean
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
    <Box display="flex" padding={1}>
      <Icon type={icons[type]} color={colors[type]} />
      <Box paddingLeft={1}>
        <Typography variant="h5">{message}</Typography>
      </Box>
    </Box>
  )
}

// return (
//   <Inline space="gutter" alignY="center">
//     <Icon type={icons[type]} color={colors[type]} />
//     {message}
//   </Inline>
// )

const Toast: React.FC<ToastProps> = ({ hideProgressBar = false }) => {
  return (
    <div className={toastStyles.root}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={hideProgressBar}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <style jsx>{toastKeyframes}</style>
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

export default Toast
