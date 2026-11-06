// This is the only place the island-ui toast may be imported from in this app.
// Every other module goes through this wrapper so that user-facing errors
// leave a trace in Datadog and are not just shown in a toast.
// eslint-disable-next-line no-restricted-imports
import { toast as uiToast } from '@island.is/island-ui/core'

type ToastOptions = NonNullable<Parameters<typeof uiToast.error>[1]>

interface ErrorToastOptions extends ToastOptions {
  // Logged in place of the toast message when the message contains personal
  // data, e.g. a defendant name. Never put case content in the log message.
  logMessage?: string
}

const error = (message: string, options?: ErrorToastOptions) => {
  const { logMessage, ...toastOptions } = options ?? {}

  // Forwarded to Datadog by the browser-logs SDK
  console.error(`User-facing error: ${logMessage ?? message}`)

  uiToast.error(message, toastOptions)
}

export const toast = {
  error,
  success: (message: string, options?: ToastOptions) =>
    uiToast.success(message, options),
  info: (message: string, options?: ToastOptions) =>
    uiToast.info(message, options),
  warning: (message: string, options?: ToastOptions) =>
    uiToast.warning(message, options),
}
