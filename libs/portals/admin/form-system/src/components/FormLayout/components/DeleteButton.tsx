import React from 'react'
import { Button } from '@island.is/island-ui/core'

export const DeleteButton = React.forwardRef<
  HTMLButtonElement,
  { onClick: () => void; label: string } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value'
  >
>(({ onClick, label, ...props }, ref) => (
  <Button
    variant="ghost"
    colorScheme="destructive"
    size="small"
    icon="trash"
    onClick={onClick}
    ref={ref}
    {...props}
  >
    {label}
  </Button>
))
