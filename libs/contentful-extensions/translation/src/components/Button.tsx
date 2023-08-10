import React, { FC } from 'react'

import { BaseProps } from './MarkdownEditor'

interface ButtonProps extends BaseProps {
  active: boolean
  icon: string
}

export const ICONS = [
  { id: 'format_bold', src: require('../assets/bold.png') },
  { id: 'format_italic', src: require('../assets/italic.png') },
  { id: 'format_underlined', src: require('../assets/underlined.png') },
  { id: 'insert_link', src: require('../assets/insert_link.png') },
  { id: 'looks_two', src: require('../assets/looks_two.png') },
  { id: 'looks_three', src: require('../assets/looks_three.png') },
  { id: 'looks_four', src: require('../assets/looks_four.png') },
  { id: 'format_list_numbered', src: require('../assets/list_numbered.png') },
  { id: 'format_list_bulleted', src: require('../assets/list_bulleted.png') },
]

export const Button: FC<React.PropsWithChildren<ButtonProps>> = ({
  active,
  icon,
  ...props
}) => {
  const getIcon = ICONS.find((item) => item.id === icon)?.src ?? ICONS[0].src

  return (
    <button
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',

        margin: '0 18px 0 0',

        width: '18px',
        height: '18px',

        opacity: active ? 1 : 0.4,
        background: 'transparent',

        cursor: 'pointer',
        border: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      <img
        src={getIcon}
        style={{
          width: '18px',
          height: '18px',
        }}
      />
    </button>
  )
}
