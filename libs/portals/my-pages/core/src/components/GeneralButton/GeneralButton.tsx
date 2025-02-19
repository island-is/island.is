import { Button, ButtonProps } from '@island.is/island-ui/core'

type Props = Pick<
  ButtonProps,
  | 'children'
  | 'onClick'
  | 'onBlur'
  | 'onFocus'
  | 'loading'
  | 'icon'
  | 'iconType'
  | 'as'
  | 'disabled'
>

export const GeneralButton = ({
  variant = 'text',
  icon,
  iconType,
  children,
  ...restOfProps
}: Props & { variant?: 'utility' | 'text' }) => {
  if (variant === 'text') {
    return (
      <Button
        size="small"
        variant="text"
        unfocusable
        icon={icon}
        iconType={iconType}
        {...restOfProps}
      >
        {children}
      </Button>
    )
  }
  return (
    <Button
      colorScheme="default"
      icon={icon}
      iconType={iconType}
      size="default"
      type="text"
      variant="utility"
      unfocusable
      {...restOfProps}
    >
      {children}
    </Button>
  )
}
