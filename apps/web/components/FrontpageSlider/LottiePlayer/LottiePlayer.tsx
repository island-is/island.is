import { theme } from 'libs/island-ui/theme/src'
import { forwardRef, useEffect, useRef } from 'react'
import { useLottie, Lottie } from 'react-lottie-hook'
import { useWindowSize } from 'react-use'
import testJSON from '../json/slide1.json'

type Props = {
  onLoaded: () => void
}

const LottiePlayer = ({ onLoaded }: Props) => {
  const [lottieRef, { isPaused, isStopped, firstFrame }, controls] = useLottie({
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: testJSON,
    rendererSettings: {
      progressiveLoad: false,
    },
  })

  useEffect(() => {
    if (lottieRef.current) {
      console.log('calling onLoaded')
      onLoaded()
    }
  }, [lottieRef])

  const isMobile = useWindowSize().width < theme.breakpoints.md
  if (isMobile) {
    return null
  }

  return <Lottie lottieRef={lottieRef} style={{ opacity: 0.5 }} />
}

export default LottiePlayer
