import { Button, ButtonBaseProps } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { AllHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { useWindowSize } from 'react-use'

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>

interface FormButtonProps {
  children?: ReactNode
  onClick?: NativeButtonProps['onClick']
  submit?: boolean
  disabled?: boolean
  icon?: ButtonBaseProps['icon']
}

export const FormButton = ({
  children,
  onClick,
  submit,
  ...rest
}: PropsWithChildren<FormButtonProps>) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm
  if (submit) {
    return isMobile ? (
      <Button type="submit" variant="ghost" size="small" {...rest}>
        {children}
      </Button>
    ) : (
      <Button as="button" type="submit" variant="text" size="small" {...rest}>
        {children}
      </Button>
    )
  }
  return (
    <Button
      onClick={onClick}
      variant={isMobile ? 'ghost' : 'text'}
      size="small"
      {...rest}
    >
      {children}
    </Button>
  )
}
