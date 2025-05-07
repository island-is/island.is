import { Button, ButtonBaseProps } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { AllHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { useWindowSize } from 'react-use'

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>

type FormButtonProps = {
  children?: ReactNode
  onClick?: NativeButtonProps['onClick']
  submit?: boolean
  disabled?: boolean
} & Pick<ButtonBaseProps, 'icon' | 'loading' | 'variant' | 'nowrap'>

export const FormButton = ({
  children,
  onClick,
  submit,
  variant,
  ...rest
}: PropsWithChildren<FormButtonProps>) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  if (submit) {
    return isMobile ? (
      <Button type="submit" variant={variant ?? 'ghost'} size="small" {...rest}>
        {children}
      </Button>
    ) : (
      <Button
        as="button"
        type="submit"
        variant={variant ?? 'text'}
        size="small"
        {...rest}
      >
        {children}
      </Button>
    )
  }
  return (
    <Button
      onClick={onClick}
      variant={variant ?? (isMobile ? 'ghost' : 'text')}
      size="small"
      {...rest}
    >
      {children}
    </Button>
  )
}
