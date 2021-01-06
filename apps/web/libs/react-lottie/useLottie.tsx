/* eslint-disable no-unused-expressions */

import React, {
  CSSProperties,
  useEffect,
  useRef,
  ReactElement,
  useState,
} from 'react'
import lottie, {
  AnimationConfigWithData,
  AnimationItem,
  AnimationDirection,
  AnimationSegment,
} from 'lottie-web'
import {
  Listener,
  LottieOptions,
  LottieRefCurrentProps,
  PartialListener,
} from './types'

const useLottie = (
  props: LottieOptions,
  style?: CSSProperties,
): { View: ReactElement } & LottieRefCurrentProps => {
  const {
    animationData,
    loop,
    autoplay,
    initialSegment,
    onComplete,
    onLoopComplete,
    onEnterFrame,
    onSegmentStart,
    onConfigReady,
    onDataReady,
    onDataFailed,
    onLoadedImages,
    onDOMLoaded,
    onDestroy,
    lottieRef,
    renderer,
    name,
    assetsPath,
    rendererSettings,
    quality = 8,
    ...rest
  } = props

  const [animationLoaded, setAnimationLoaded] = useState(false)
  const animationInstanceRef = useRef<AnimationItem>()
  const animationContainer = useRef<HTMLDivElement>(null)

  const play = (): void => {
    animationInstanceRef.current?.play()
  }

  const stop = (): void => {
    animationInstanceRef.current?.stop()
  }

  const pause = (): void => {
    animationInstanceRef.current?.pause()
  }

  const setSpeed = (speed: number): void => {
    animationInstanceRef.current?.setSpeed(speed)
  }

  const goToAndPlay = (value: number, isFrame?: boolean): void => {
    animationInstanceRef.current?.goToAndPlay(value, isFrame)
  }

  const goToAndStop = (value: number, isFrame?: boolean): void => {
    animationInstanceRef.current?.goToAndStop(value, isFrame)
  }

  const setDirection = (direction: AnimationDirection): void => {
    animationInstanceRef.current?.setDirection(direction)
  }

  const playSegments = (
    segments: AnimationSegment | AnimationSegment[],
    forceFlag?: boolean,
  ): void => {
    animationInstanceRef.current?.playSegments(segments, forceFlag)
  }

  const setSubframe = (useSubFrames: boolean): void => {
    animationInstanceRef.current?.setSubframe(useSubFrames)
  }

  /**
   * Get animation duration
   */
  const getDuration = (inFrames?: boolean): number | undefined => {
    return animationInstanceRef.current?.getDuration(inFrames)
  }

  /**
   * Destroy animation
   */
  const destroy = (): void => {
    animationInstanceRef.current?.destroy()
  }

  /**
   * Load a new animation, and if it's the case, destroy the previous one
   */
  const loadAnimation = (forcedConfigs = {}) => {
    // Return if the container ref is null
    if (!animationContainer.current) {
      return
    }

    // Destroy any previous instance
    animationInstanceRef.current?.destroy()

    // Build the animation configuration
    const config: AnimationConfigWithData = {
      ...props,
      ...forcedConfigs,
      container: animationContainer.current,
    }

    // Save the animation instance
    lottie.setQuality(quality)
    animationInstanceRef.current = lottie.loadAnimation(config)

    setAnimationLoaded(!!animationInstanceRef.current)
  }

  /**
   * Initialize and listen for changes that affect the animation state
   */
  // Reinitialize when animation data changed
  useEffect(() => {
    loadAnimation()
  }, [animationData])

  // Update the loop state
  useEffect(() => {
    if (!animationInstanceRef.current) {
      return
    }

    animationInstanceRef.current.loop = !!loop

    if (loop && animationInstanceRef.current.isPaused) {
      animationInstanceRef.current.play()
    }
  }, [loop])

  // Update the autoplay state
  useEffect(() => {
    if (!animationInstanceRef.current) {
      return
    }

    animationInstanceRef.current.autoplay = !!autoplay
  }, [autoplay])

  // Update the initial segment state
  useEffect(() => {
    if (!animationInstanceRef.current) {
      return
    }

    // When null should reset to default animation length
    if (!initialSegment) {
      animationInstanceRef.current.resetSegments(false)
      return
    }

    // If it's not a valid segment, do nothing
    if (!Array.isArray(initialSegment) || !initialSegment.length) {
      return
    }

    // If the current position it's not in the new segment
    // set the current position to start
    if (
      animationInstanceRef.current.currentRawFrame < initialSegment[0] ||
      animationInstanceRef.current.currentRawFrame > initialSegment[1]
    ) {
      animationInstanceRef.current.currentRawFrame = initialSegment[0]
    }

    // Update the segment
    animationInstanceRef.current.setSegment(
      initialSegment[0],
      initialSegment[1],
    )
  }, [initialSegment])

  /**
   * Reinitialize listener on change
   */
  useEffect(() => {
    const partialListeners: PartialListener[] = [
      { name: 'complete', handler: onComplete },
      { name: 'loopComplete', handler: onLoopComplete },
      { name: 'enterFrame', handler: onEnterFrame },
      { name: 'segmentStart', handler: onSegmentStart },
      { name: 'config_ready', handler: onConfigReady },
      { name: 'data_ready', handler: onDataReady },
      { name: 'data_failed', handler: onDataFailed },
      { name: 'loaded_images', handler: onLoadedImages },
      { name: 'DOMLoaded', handler: onDOMLoaded },
      { name: 'destroy', handler: onDestroy },
    ]

    const listeners = partialListeners.filter(
      (listener: PartialListener): listener is Listener =>
        listener.handler != null,
    )

    if (!listeners.length) {
      return
    }

    const deregisterList = listeners.map((listener: Listener) => {
      animationInstanceRef.current?.addEventListener(
        listener.name,
        listener.handler,
      )

      // Return a function to deregister this listener
      return () => {
        animationInstanceRef.current?.removeEventListener(
          listener.name,
          listener.handler,
        )
      }
    })

    // Deregister listeners on unmount
    return () => {
      deregisterList.forEach((deregister) => deregister())
    }
  }, [
    onComplete,
    onLoopComplete,
    onEnterFrame,
    onSegmentStart,
    onConfigReady,
    onDataReady,
    onDataFailed,
    onLoadedImages,
    onDOMLoaded,
    onDestroy,
  ])

  /**
   * Build the animation view
   */
  const View = <div style={style} ref={animationContainer} {...rest} />

  return {
    View,
    play,
    stop,
    pause,
    setSpeed,
    goToAndStop,
    goToAndPlay,
    setDirection,
    playSegments,
    setSubframe,
    getDuration,
    destroy,
    animationLoaded,
    animationItem: animationInstanceRef.current,
  }
}

export default useLottie
