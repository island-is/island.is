// apollo.d.ts

import '@apollo/client'

declare module '@apollo/client' {
  interface DefaultContext {
    skipToastError?: boolean
    [key: string]: unknown
  }
}
