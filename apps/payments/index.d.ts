/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

// Type declaration for Apple Pay Button web component
declare namespace JSX {
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
      style?: React.CSSProperties
    }
  }
}
