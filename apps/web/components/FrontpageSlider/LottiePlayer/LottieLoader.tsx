import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@island.is/island-ui/core'
import SlideBackgroundGrid from '../SlideBackgroundGrid'

const LottiePlayer = dynamic(() => import('../LottiePlayer/LottiePlayer'), {
  ssr: false,
})

const LottieIllustration = ({ animationData, selectedIndex }) => {
  const [loaded, set] = useState(false)

  console.log("From lottie", animationData) 
  return (
    <Box position="relative">
      {animationData.map((animation: JSON, index: number) => (
        <LottiePlayer
          key={index}
          animationData={animation}
          isVisible={loaded && index === selectedIndex}
          onLoaded={set}
        />
      ))}
      <SlideBackgroundGrid />
    </Box>
  )
}

export default LottieIllustration
