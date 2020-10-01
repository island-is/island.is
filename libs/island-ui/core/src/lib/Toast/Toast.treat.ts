import { style, styleMap, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  position: 'relative',
})

globalStyle(`${root} .Toastify__toast-container`, {
  zIndex: 9999,
  transform: 'translate3d(0, 0, 9999px)',
  position: 'fixed',
  padding: '4px',
  width: '320px',
  boxSizing: 'border-box',
  color: theme.color.dark400,
  '@media': {
    '(max-width: 480px)': {
      width: '100vw',
      padding: 0,
      left: 0,
      margin: 0,
    },
  },
})

/** Used to define the position of the ToastContainer **/
globalStyle(`${root} .Toastify__toast-container--top-left`, {
  top: '1em',
  left: '1em',
  '@media': {
    '(max-width: 480px)': {
      top: 0,
      transform: 'translateX(0)',
    },
  },
})
globalStyle(`${root} .Toastify__toast-container--top-center`, {
  top: '1em',
  left: '50%',
  transform: 'translateX(-50%)',
  '@media': {
    '(max-width: 480px)': {
      top: 0,
      transform: 'translateX(0)',
    },
  },
})
globalStyle(`${root} .Toastify__toast-container--top-right`, {
  top: '1em',
  right: '1em',
  '@media': {
    '(max-width: 480px)': {
      top: 0,
      transform: 'translateX(0)',
    },
  },
})
globalStyle(`${root} .Toastify__toast-container--bottom-left`, {
  bottom: '1em',
  left: '1em',
  '@media': {
    '(max-width: 480px)': {
      bottom: 0,
      transform: 'translateX(0)',
    },
  },
})
globalStyle(`${root} .Toastify__toast-container--bottom-center`, {
  bottom: '1em',
  left: '50%',
  transform: 'translateX(-50%)',
  '@media': {
    '(max-width: 480px)': {
      bottom: 0,
      transform: 'translateX(0)',
    },
  },
})
globalStyle(`${root} .Toastify__toast-container--bottom-right`, {
  bottom: '1em',
  right: '1em',
  '@media': {
    '(max-width: 480px)': {
      bottom: 0,
      transform: 'translateX(0)',
    },
  },
})

/** Classes for the displayed toast **/
globalStyle(`${root} .Toastify__toast`, {
  position: 'relative',
  minHeight: '64px',
  boxSizing: 'border-box',
  marginBottom: theme.spacing[2],
  padding: theme.spacing[1],
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: theme.border.radius.large,
  display: 'flex',
  justifyContent: 'space-between',
  overflow: 'hidden',
  cursor: 'pointer',
  direction: 'ltr',
  fontWeight: theme.typography.medium,
  '@media': {
    '(max-width: 480px)': {
      marginBottom: 0,
    },
  },
})
globalStyle(`${root} .Toastify__toast--dark`, {
  background: '#121212',
  color: '#fff',
})
globalStyle(`${root} .Toastify__toast--default`, {
  background: `${theme.color.white}`,
  color: '#aaa',
})
globalStyle(`${root} .Toastify__toast--info`, {
  background: theme.color.blue100,
  borderColor: theme.color.mint200,
  boxShadow: `0px 4px 20px rgba(0, 97, 255, 0.15)`,
})
globalStyle(`${root} .Toastify__toast--success`, {
  background: theme.color.mint100,
  borderColor: theme.color.mint200,
  boxShadow: `0px 4px 20px rgba(0, 228, 202, 0.15)`,
})
globalStyle(`${root} .Toastify__toast--warning`, {
  background: theme.color.yellow200,
  borderColor: theme.color.yellow300,
  boxShadow: `0px 4px 20px rgba(255, 240, 102, 0.15)`,
})
globalStyle(`${root} .Toastify__toast--error`, {
  background: theme.color.red100,
  borderColor: theme.color.red200,
  boxShadow: `0px 4px 20px rgba(255, 0, 80, 0.15)`,
})
globalStyle(`${root} .Toastify__toast-body`, {
  flex: '1 1 auto',
  margin: 'auto 0',
})

/** Close button **/
globalStyle(`${root} .Toastify__close-button`, {
  color: '#fff',
  background: 'transparent',
  outline: 'none',
  border: 'none',
  padding: '0',
  cursor: 'pointer',
  opacity: 0.7,
  transition: '0.3s ease',
  alignSelf: 'flex-start',
})
globalStyle(`${root} .Toastify__close-button--default`, {
  color: '#000',
  opacity: 0.5,
})
globalStyle(`${root} .Toastify__close-button > svg`, {
  fill: 'currentColor',
  height: 16,
  width: 14,
})
globalStyle(
  `${root} .Toastify__close-button:hover, .Toastify__close-button:focus`,
  {
    opacity: 1,
  },
)

/** Classes for the progress bar **/
globalStyle(`${root} .Toastify__progress-bar`, {
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  height: '5px',
  zIndex: 9999,
  opacity: 0.7,
  backgroundColor: theme.color.mint400,
  transformOrigin: 'left',
})
globalStyle(`${root} .Toastify__toast--info .Toastify__progress-bar`, {
  background: theme.color.blue400,
})
globalStyle(`${root} .Toastify__toast--success .Toastify__progress-bar`, {
  background: theme.color.mint400,
})
globalStyle(`${root} .Toastify__toast--warning .Toastify__progress-bar`, {
  background: theme.color.yellow600,
})
globalStyle(`${root} .Toastify__toast--error .Toastify__progress-bar`, {
  background: theme.color.red400,
})
globalStyle(`${root} .Toastify__progress-bar--animated`, {
  animation: 'Toastify__trackProgress linear 1 forwards',
})
globalStyle(`${root} .Toastify__progress-bar--animated`, {
  animation: 'Toastify__trackProgress linear 1 forwards',
})
globalStyle(`${root} .Toastify__progress-bar--controlled`, {
  transition: 'transform 0.2s',
})
globalStyle(`${root} .Toastify__progress-bar--default`, {
  background:
    'linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55)',
})
globalStyle(`${root} .Toastify__progress-bar--dark`, {
  background: '#bb86fc',
})

/** Bounce animation */
globalStyle(
  `${root} .Toastify__bounce-enter--top-left, .Toastify__bounce-enter--bottom-left`,
  {
    animationName: 'Toastify__bounceInLeft',
  },
)
globalStyle(
  `${root} .Toastify__bounce-enter--top-right, .Toastify__bounce-enter--bottom-right`,
  {
    animationName: 'Toastify__bounceInRight',
  },
)
globalStyle(`${root} .Toastify__bounce-enter--top-center`, {
  animationName: 'Toastify__bounceInDown',
})
globalStyle(`${root} .Toastify__bounce-enter--bottom-center`, {
  animationName: 'Toastify__bounceInUp',
})
globalStyle(
  `${root} .Toastify__bounce-exit--top-left, .Toastify__bounce-exit--bottom-left`,
  {
    animationName: 'Toastify__bounceOutLeft',
  },
)
globalStyle(
  `${root} .Toastify__bounce-exit--top-right, .Toastify__bounce-exit--bottom-right`,
  {
    animationName: 'Toastify__bounceOutRight',
  },
)
globalStyle(`${root} .Toastify__bounce-exit--top-center`, {
  animationName: 'Toastify__bounceOutUp',
})
globalStyle(`${root} .Toastify__bounce-exit--bottom-center`, {
  animationName: 'Toastify__bounceOutDown',
})

/** Zoom animation */
globalStyle(`${root} .Toastify__zoom-enter`, {
  animationName: 'Toastify__zoomIn',
})
globalStyle(`${root} .Toastify__zoom-exit`, {
  animationName: 'Toastify__zoomOut',
})

/** Flip animation */
globalStyle(`${root} .Toastify__flip-enter`, {
  animationName: 'Toastify__flipIn',
})
globalStyle(`${root} .Toastify__flip-exit`, {
  animationName: 'Toastify__flipOut',
})

/** Slide animation */
globalStyle(
  `${root} .Toastify__slide-enter--top-left, .Toastify__slide-enter--bottom-left`,
  {
    animationName: 'Toastify__slideInLeft',
  },
)
globalStyle(
  `${root} .Toastify__slide-enter--top-right, .Toastify__slide-enter--bottom-right`,
  {
    animationName: 'Toastify__slideInRight',
  },
)
globalStyle(`${root} .Toastify__slide-enter--top-center`, {
  animationName: 'Toastify__slideInDown',
})
globalStyle(`${root} .Toastify__slide-enter--bottom-center`, {
  animationName: 'Toastify__slideInUp',
})
globalStyle(
  `${root} .Toastify__slide-exit--top-left, .Toastify__slide-exit--bottom-left`,
  {
    animationName: 'Toastify__slideOutLeft',
  },
)
globalStyle(
  `${root} .Toastify__slide-exit--top-right, .Toastify__slide-exit--bottom-right`,
  {
    animationName: 'Toastify__slideOutRight',
  },
)
globalStyle(`${root} .Toastify__slide-exit--top-center`, {
  animationName: 'Toastify__slideOutUp',
})
globalStyle(`${root} .Toastify__slide-exit--bottom-center`, {
  animationName: 'Toastify__slideOutDown',
})
