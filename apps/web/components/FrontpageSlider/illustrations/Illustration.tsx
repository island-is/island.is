import { theme } from '@island.is/island-ui/theme'
import React, { FC, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useWindowSize } from 'react-use'
import InitialSlide from './InitialSlide'

// const illustration = dynamic(() => import('./InitialSlide'))

const LottiePlayer = dynamic(() => import('../LottiePlayer/LottiePlayer'), {
  ssr: false,
})

const Illustration = () => {
  const [ready, set] = useState(false)

  return (
    <>
      {!ready && <InitialSlide />}
      <LottiePlayer
        onLoaded={() => {
          set(true)
        }}
      />
    </>
  )
}

export default Illustration
