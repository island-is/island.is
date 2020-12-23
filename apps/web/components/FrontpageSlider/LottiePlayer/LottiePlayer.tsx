import { theme } from 'libs/island-ui/theme/src'
import { forwardRef, useEffect, useRef } from 'react'
import { useLottie } from 'lottie-react'
import { useWindowSize } from 'react-use'

type Props = {
  onLoaded: () => void
  animationData: any
}

const LottiePlayer = ({ onLoaded, animationData }: Props) => {
  const options = {
    animationData,
    loop: true,
    autoplay: true,
  }

  const { View, destroy } = useLottie(options)

  const isMobile = useWindowSize().width < theme.breakpoints.md

  useEffect(() => {
    if (animationData) {
      console.log(animationData)
      onLoaded()
    }

    return function cleanup() {
      destroy()
    }
  }, [animationData])

  if (isMobile) {
    return null
  }

  return View
}

export default LottiePlayer
