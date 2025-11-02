// ScrollToSelectedMenuList.tsx
import React, { useEffect, useRef } from 'react'
import { components, MenuListProps } from 'react-select'

export const ScrollToSelectedMenuList = (props: MenuListProps) => {
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedRef?.current?.scrollIntoView) {
      selectedRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'auto',
      })
    }
  }, [])

  return (
    <components.MenuList {...props}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {React.Children.map(props.children, (child: any) => {
        if (!child || !child.props) return child

        const isSelected =
          child.props.isSelected ||
          child.props.data?.value === props.selectProps?.value

        return React.cloneElement(child, {
          innerRef: isSelected ? selectedRef : undefined,
        })
      })}
    </components.MenuList>
  )
}
