import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import PlaceholderSlide from '../PlaceholderSlide'

const LottiePlayer = dynamic(() => import('../LottiePlayer/LottiePlayer'), {
  ssr: false,
})

const LottieIllustration = ({ animationData, selectedIndex }) => {
  const [loaded, set] = useState(false)

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
