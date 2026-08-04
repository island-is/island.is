/* eslint-disable @typescript-eslint/no-explicit-any */
// `import 'react'` makes this file a module so the `declare module 'react'` below augments
// (rather than replaces) react's types.
import 'react'

declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

// Type declaration for the Apple Pay Button web component. TSX resolves
// custom elements from the `react` module's JSX namespace, so augment that
// (not the global `JSX` namespace).
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'apple-pay-button': {
        buttonstyle?: 'black' | 'white' | 'white-with-line'
        type?:
          | 'plain'
          | 'pay'
          | 'buy'
          | 'set-up'
          | 'donate'
          | 'check-out'
          | 'book'
          | 'subscribe'
          | 'reload'
          | 'add-money'
          | 'top-up'
          | 'order'
          | 'rent'
          | 'support'
          | 'contribute'
          | 'tip'
        locale?: string
        id?: string
        className?: string
        style?: import('react').CSSProperties
      }
    }
  }
}
