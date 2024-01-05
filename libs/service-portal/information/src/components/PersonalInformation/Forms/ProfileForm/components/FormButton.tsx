import React, { FC } from 'react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { AllHTMLAttributes, ReactNode } from 'react'
import { Button } from '@island.is/island-ui/core'

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>

interface Props {
  children?: ReactNode
  onClick?: NativeButtonProps['onClick']
  submit?: boolean
  disabled?: boolean
}

export const FormButton: FC<React.PropsWithChildren<Props>> = ({
  children,
  onClick,
  disabled,
  submit,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm
  if (submit) {
    return isMobile ? (
      <Button type="submit" variant="ghost" size="small" disabled={disabled}>
        {children}
      </Button>
    ) : (
      <Button
        as="button"
        type="submit"
        variant="text"
        size="small"
        disabled={disabled}
      >
        {children}
      </Button>
    )
  }
  return (
    <Button
      onClick={onClick}
      variant={isMobile ? 'ghost' : 'text'}
      size="small"
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
