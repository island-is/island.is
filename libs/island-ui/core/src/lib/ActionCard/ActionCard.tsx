import * as React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'

type ActionCardProps = {
  heading: string
  text?: string
  tag?: string
  eyebrow?: string
  cta: {
    /**
     * CTA label
     */
    label: string
    /**
     * 'primary' renders a button, 'secondary' renders a text button
     */
    variant?: 'primary' | 'secondary'
    onClick?: () => void
  }
  disabled?: boolean
  disabledLabel?: string
  disabledMessage?: string
}

const defaultCta = {
  variant: 'primary',
  onClick: () => null,
} as const

// DRAFT
export const ActionCard: React.FC<ActionCardProps> = ({
  cta,
  eyebrow,
  heading,
  tag,
  text,
  disabled,
  disabledLabel,
  disabledMessage,
}) => {
  const callToAction = { ...defaultCta, ...cta }

  const renderDisabled = () => (
    <Box display="flex">
      <Text variant="small">{disabledLabel}&nbsp;</Text>
      <Tooltip placement="top" as="button" text={disabledMessage} />
    </Box>
  )

  const renderDefault = () => (
    <Stack space="gutter">
      {tag && <Tag label>{tag}</Tag>}
      <Button
        variant={callToAction.variant === 'secondary' ? 'text' : 'primary'}
        onClick={callToAction.onClick}
      >
        {callToAction.label}
      </Button>
    </Stack>
  )

  return (
    <Box
      alignItems="center"
      borderColor="blue200"
      borderRadius="standard"
      borderWidth="standard"
      display="flex"
      paddingX={4}
      paddingY={3}
    >
      <Box>
        {eyebrow && (
          <Text color="red400" variant="eyebrow">
            {eyebrow}
          </Text>
        )}
        <Text variant="h3">{heading}</Text>
        <Text paddingTop={1}>{text}</Text>
      </Box>

      <Box
        alignItems="flexEnd"
        display="flex"
        flexDirection="column"
        marginLeft="auto"
      >
        {disabled ? renderDisabled() : renderDefault()}
      </Box>
    </Box>
  )
}
