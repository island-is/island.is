/* eslint-disable @typescript-eslint/no-explicit-any */
// `import 'react'` makes this file a module so the `declare module 'react'` below augments
// (rather than replaces) react's types.
import 'react'

declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

// Type declaration for the Apple Pay Button web component.
// @types/react 19 scopes JSX under the `react` module (`React.JSX`), so the custom element
// must augment that namespace — the global `JSX` namespace is no longer consulted by TSX.
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
