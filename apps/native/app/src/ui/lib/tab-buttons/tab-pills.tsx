import React, { useCallback, useEffect, useRef } from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import styled from 'styled-components/native'

import { Typography } from '../typography/typography'

const Pill = styled.Pressable<{ isSelected: boolean }>`
  height: 32px;
  padding-horizontal: 8px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.blue400 : theme.color.blue100};
`

const PillText = styled(Typography)<{ isSelected: boolean }>`
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.white : theme.color.blue400};
`

interface TabPill {
  title: string
}

interface TabPillsProps {
  buttons: TabPill[]
  selectedTab: number
  setSelectedTab: (index: number) => void
}

const EDGE_PADDING = 16

export const TabPills = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabPillsProps) => {
  const scrollRef = useRef<ScrollView>(null)
  const layoutsRef = useRef<Record<number, { x: number; width: number }>>({})
  const scrollXRef = useRef(0)
  const containerWidthRef = useRef(0)

  const scrollSelectedIntoView = useCallback((index: number) => {
    const layout = layoutsRef.current[index]
    const containerWidth = containerWidthRef.current
    if (!layout || !containerWidth) return
    const viewLeft = scrollXRef.current
    const viewRight = viewLeft + containerWidth
    const pillLeft = layout.x - EDGE_PADDING
    const pillRight = layout.x + layout.width + EDGE_PADDING
    let target = viewLeft
    if (pillRight > viewRight) {
      target = pillRight - containerWidth
    } else if (pillLeft < viewLeft) {
      target = pillLeft
    } else {
      return
    }
    scrollRef.current?.scrollTo({ x: Math.max(0, target), animated: true })
  }, [])

  useEffect(() => {
    scrollSelectedIntoView(selectedTab)
  }, [selectedTab, scrollSelectedIntoView])

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      containerWidthRef.current = e.nativeEvent.layout.width
      scrollSelectedIntoView(selectedTab)
    },
    [selectedTab, scrollSelectedIntoView],
  )

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollXRef.current = e.nativeEvent.contentOffset.x
    },
    [],
  )

  const onPillLayout = useCallback(
    (index: number, e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout
      layoutsRef.current[index] = { x, width }
      if (index === selectedTab) scrollSelectedIntoView(index)
    },
    [selectedTab, scrollSelectedIntoView],
  )

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 16 }}
      contentContainerStyle={{ gap: 8 }}
      onLayout={onContainerLayout}
      onScroll={onScroll}
      scrollEventThrottle={16}
      accessibilityRole="tablist"
    >
      {buttons.map((button, index) => {
        const isSelected = selectedTab === index
        return (
          <Pill
            key={index}
            isSelected={isSelected}
            onPress={() => setSelectedTab(index)}
            onLayout={(e) => onPillLayout(index, e)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${button.title} tab`}
          >
            <PillText
              variant="eyebrow"
              isSelected={isSelected}
              numberOfLines={1}
            >
              {button.title}
            </PillText>
          </Pill>
        )
      })}
    </ScrollView>
  )
}
