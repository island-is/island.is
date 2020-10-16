import * as React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { ArrowLink } from '../Link/ArrowLink/ArrowLink'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'

type CTA = {
  /**
   * CTA label
   */
  label: string
  /**
   * 'primary' renders a button, 'secondary' renders a link
   * TODO: Change both to links or buttons to simplify?
   */
  variant?: 'primary' | 'secondary'
  /**
   * 'primary' variant expects onClick
   */
  onClick?: () => void
  /**
   * 'secondary' variant expects a href
   */
  href?: string
}

type ActionCardProps = {
  heading: string
  text?: string
  tag?: string
  eyebrow?: string
  cta: CTA
  disabled?: boolean
  disabledLabel?: string
  disabledMessage?: string
}

const defaultCta = {
  variant: 'primary',
  onClick: () => console.log('No on click?'),
  href: '/',
} as const

const renderCta = (cta: CTA) => {
  switch (cta.variant) {
    case 'primary': {
      return (
        <Button size="small" onClick={cta.onClick}>
          {cta.label}
        </Button>
      )
    }

    case 'secondary': {
      return <ArrowLink href={cta.href}>{cta.label}</ArrowLink>
    }
  }
}

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

  const renderBasic = () => (
    <Stack space="gutter">
      {tag && <Tag label>{tag}</Tag>}
      {renderCta(callToAction)}
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
        {disabled ? renderDisabled() : renderBasic()}
      </Box>
    </Box>
  )
}
