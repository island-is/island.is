import React, { useRef, useEffect, useState } from 'react'
import { throttle } from 'lodash'
import cn from 'classnames'

import * as styles from './ContentSlider.treat'

const ContentSlider = ({
  children,
  containerClassName,
  innerContainerClassName,
  slideContainerClassName,
  containerRef,
  scrollContainerRef,
  scrollInnerContainerRef,
}) => {
  return (
    <div
      className={cn(styles.container, containerClassName)}
      ref={scrollContainerRef}
    >
      <div className={innerContainerClassName} ref={scrollInnerContainerRef}>
        <div
          className={cn(styles.slideContainer, slideContainerClassName)}
          ref={containerRef}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default ContentSlider

export const useSlider = (opt) => {
  const options = Object.assign(
    {
      jumpSize: 1,
      loop: false,
    },
    opt,
  )
  const containerRef = useRef()
  const scrollContainerRef = useRef()
  const scrollInnerContainerRef = useRef()
  const [lastSetIndex, setLastSetIndex] = useState(0)
  const [hasScroll, setHasScroll] = useState(false)
  const throttleInterval = 150

  useEffect(() => {
    if (typeof window === 'undefined') return
    const setMargin = () => {
      containerRef.current.style.marginRight = `${getContainerOffset() - 1}px`
    }
    const handleSetScroll = () => {
      const containerHasScroll =
        scrollContainerRef.current.scrollWidth >
        scrollContainerRef.current.clientWidth
      if (containerHasScroll !== hasScroll) {
        setHasScroll(containerHasScroll)
      }
    }
    const handleResize = throttle(() => {
      setMargin()
      handleSetScroll()
    }, throttleInterval)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getContainerOffset = () =>
    scrollContainerRef.current.offsetLeft +
    scrollInnerContainerRef.current.offsetLeft

  const getSlidesOffset = () =>
    [].slice
      .call(containerRef.current.children)
      .map((slide) => slide.offsetLeft)

  const goToIndex = (idx) => {
    setLastSetIndex(idx)
    scrollContainerRef.current.scroll({
      left: getSlidesOffset()[idx] - getContainerOffset(),
      behavior: 'smooth',
    })
  }

  const getSlidesLength = () =>
    [].slice.call(containerRef.current.children).length

  const getNextIndex = () => {
    const paddingLeft =
      containerRef.current.offsetLeft -
      scrollInnerContainerRef.current.offsetLeft

    const currentScrollTarget =
      scrollContainerRef.current.scrollLeft + getContainerOffset() + paddingLeft

    const scrollLength =
      scrollContainerRef.current.scrollLeft +
      scrollContainerRef.current.clientWidth

    const slidesOffsets = getSlidesOffset()

    const loopIndex = options.loop ? 0 : slidesOffsets.length - 1

    if (
      Math.ceil(scrollLength) >=
      Math.ceil(scrollContainerRef.current.scrollWidth)
    ) {
      return loopIndex
    } else {
      const closestAbove = slidesOffsets.reduce(
        (prev, curr, index) => {
          if (
            Math.ceil(curr) > Math.ceil(currentScrollTarget) &&
            prev.value === null
          ) {
            return {
              value: curr,
              index,
            }
          }
          return prev
        },
        {
          value: null,
          index: null,
        },
      )
      return closestAbove.index + (options.jumpSize - 1) >
        slidesOffsets.length - 1
        ? loopIndex
        : closestAbove.index + (options.jumpSize - 1)
    }
  }

  const getPrevIndex = () => {
    const scrollLeft = scrollContainerRef?.current?.scrollLeft

    if (!scrollLeft) return

    const currentScrollTarget = scrollLeft + getContainerOffset()

    const slidesOffsets = getSlidesOffset()

    const closestBelowIdx = slidesOffsets.reduce((prev, curr, index) => {
      if (curr < currentScrollTarget) {
        return index
      }
      return prev
    }, null)

    const indexJumpSize = closestBelowIdx - (options.jumpSize - 1)

    const loopIndex = options.loop ? slidesOffsets.length - 1 : 0

    return closestBelowIdx === null
      ? loopIndex
      : indexJumpSize < 0
      ? 0
      : indexJumpSize
  }

  const nextBtnClick = () => {
    goToIndex(getNextIndex())
  }

  const prevBtnClick = () => {
    goToIndex(getPrevIndex())
  }

  return {
    goToIndex,
    getNextIndex,
    getPrevIndex,
    getSlidesLength,
    lastSetIndex,
    hasScroll,
    prevBtn: {
      onClick: prevBtnClick,
    },
    nextBtn: {
      onClick: nextBtnClick,
    },
    slider: {
      containerRef,
      scrollContainerRef,
      scrollInnerContainerRef,
    },
  }
}
