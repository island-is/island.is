import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useWindowSize } from 'react-use'
import PlaceholderSlide from '../PlaceholderSlide'
import { theme } from 'libs/island-ui/theme/src'

const LottiePlayer = dynamic(() => import('../LottiePlayer/LottiePlayer'), {
  ssr: false,
})

const LottieIllustration = ({ animationData, selectedIndex }) => {
  const [loaded, set] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  if (isMobile) {
    return null
  }

  return (
    <>
      {!loaded && <PlaceholderSlide />}
      {animationData.map((animation: JSON, index: number) => (
        <LottiePlayer
          key={index}
          animationData={animation}
          isVisible={loaded && index === selectedIndex}
          onLoaded={set}
        />
      ))}
    </>
  )
}

export default LottieIllustration
