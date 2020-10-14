import { globalStyle } from 'treat'

globalStyle(`.fillandsign__modal`, {
  position: 'fixed',
  top: 20,
  left: 20,
  right: 20,
  bottom: 20,
  zIndex: 99999,
  background: 'white',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3)',
  borderRadius: 8,
  overflow: 'hidden',
  opacity: 0,
  animation: 'fillandsign__modalFadeOut .3s cubic-bezier(.54,.03,.67,.88)',
})

globalStyle(`.fillandsign__modal.fillandsign__modal--active`, {
  opacity: 1,
  animation: 'fillandsign__modalFadeIn .3s cubic-bezier(.22,.62,.4,1)',
})

globalStyle(`.fillandsign__modalBackground`, {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  opacity: 0,
  transition: 'opacity 0.2s linear',
  zIndex: 99997,
})

globalStyle(
  `.fillandsign__modalBackground.fillandsign__modalBackground--active`,
  {
    opacity: 1,
    animation: 'fillandsign__modalBackgroundFadeIn .3s',
  },
)

globalStyle(`.fillandsign__misclickCapture`, {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 10,
  height: 10,
  zIndex: 99998,
})

globalStyle(`.fillandsign__modal iframe`, {
  zIndex: 100,
  margin: '0 !important',
  padding: '0 !important',
  border: '0 !important',
})

globalStyle(`.fillandsign__cssLoaded`, {
  display: 'none',
})
