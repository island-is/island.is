import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import InitialSlide from './InitialSlide'

const LottiePlayer = dynamic(() => import('../LottiePlayer/LottiePlayer'), {
  ssr: false,
})

const LottieIllustration = ({ animationData }) => {
  const [ready, set] = useState(false)
  const showInitialSlide = !ready

  return (
    <>
      {showInitialSlide && <InitialSlide />}
      <LottiePlayer
        animationData={animationData}
        onLoaded={() => {
          set(true)
        }}
      />
    </>
  )
}

export default LottieIllustration
