import React, { FC } from 'react'

import { BaseProps } from './MarkdownEditor'

interface ButtonProps extends BaseProps {
  active: boolean
  icon: string
}

export const ICONS = [
  { id: 'format_bold', src: '/translation-namespace-assets/bold.png' },
  {
    id: 'format_italic',
    src: '/translation-namespace-assets/italic.png',
  },
  {
    id: 'format_underlined',
    src: '/translation-namespace-assets/underlined.png',
  },
  {
    id: 'insert_link',
    src: '/translation-namespace-assets/insert_link.png',
  },
  {
    id: 'looks_two',
    src: '/translation-namespace-assets/looks_two.png',
  },
  {
    id: 'looks_three',
    src: '/translation-namespace-assets/looks_three.png',
  },
  {
    id: 'looks_four',
    src: '/translation-namespace-assets/looks_four.png',
  },
  {
    id: 'format_list_numbered',
    src: '/translation-namespace-assets/list_numbered.png',
  },
  {
    id: 'format_list_bulleted',
    src: '/translation-namespace-assets/list_bulleted.png',
  },
]

export const Button: FC<React.PropsWithChildren<ButtonProps>> = ({
  active,
  icon,
  ...props
}) => {
  const displayedIcon =
    ICONS.find((item) => item.id === icon)?.src ?? ICONS[0].src

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
        src={displayedIcon}
        style={{
          width: '18px',
          height: '18px',
          maxWidth: 'unset',
        }}
        alt={icon}
      />
    </button>
  )
}
