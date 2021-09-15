import React, { useEffect } from 'react'
import { useLifecycles } from 'react-use'
import { useLottie } from '@island.is/web/libs'

type Props = {
  animationData: JSON
  isVisible: boolean
  onLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const LottiePlayer = ({ animationData, isVisible, onLoaded }: Props) => {
  const options = {
    animationData,
    loop: true,
    autoplay: false,
  }

  const { View, destroy, stop, play } = useLottie(options)

  useLifecycles(() => {
    onLoaded(true)
  }, destroy)

  useEffect(() => {
    if (isVisible) {
      play()
    } else {
      stop()
    }
  }, [isVisible, play, stop])

  return <div style={{ display: isVisible ? 'block' : 'none' }}>{View}</div>
}

export default LottiePlayer
