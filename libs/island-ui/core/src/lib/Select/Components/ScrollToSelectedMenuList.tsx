// ScrollToSelectedMenuList.tsx
import React, { useEffect, useRef } from 'react'
import { components } from 'react-select'

export const ScrollToSelectedMenuList = (props: any) => {
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'auto',
      })
    }
  }, [])

  return (
    <components.MenuList {...props}>
      {React.Children.map(props.children, (child: any) => {
        if (!child || !child.props) return child

        const isSelected =
          child.props.isSelected ||
          child.props.data?.value === props.selectProps?.value?.value

        return React.cloneElement(child, {
          innerRef: isSelected ? selectedRef : undefined,
        })
      })}
    </components.MenuList>
  )
}
