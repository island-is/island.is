import * as React from 'react'

import type { Colors } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Button, ButtonSizes, ButtonTypes } from '../Button/Button'
import { Tag, TagVariant } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import { Inline } from '../Inline/Inline'
import * as styles from './ActionCard.css'
import { Hidden } from '../Hidden/Hidden'
import { Icon as IconType } from '../IconRC/iconMap'
import { Icon } from '../IconRC/Icon'
import DialogPrompt from '../DialogPrompt/DialogPrompt'

type ActionCardProps = {
  date?: string
  heading?: string
  headingVariant?: 'h3' | 'h4'
  text?: string
  eyebrow?: string
  backgroundColor?: 'white' | 'blue' | 'red'
  focused?: boolean
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
  cta: {
    label: string
    /** Allows for simple variant configuration of the button. If buttonType is defined it will supersede this property. */
    variant?: ButtonTypes['variant']
    /** Allows for full buttonType control. Supersedes the variant property when both are defined. */
    buttonType?: ButtonTypes
    size?: ButtonSizes
    icon?: IconType
    iconType?: 'filled' | 'outline'
    onClick?: () => void
    disabled?: boolean
  }
  secondaryCta?: {
    label: string
    visible?: boolean
    size?: ButtonSizes
    icon?: IconType
    onClick?: () => void
    disabled?: boolean
  }
  unavailable?: {
    active?: boolean
    label?: string
    message?: string
  }
  avatar?: boolean
  deleteButton?: {
    visible?: boolean
    onClick?: () => void
    disabled?: boolean
    icon?: IconType
    dialogTitle?: string
    dialogDescription?: string
    dialogConfirmLabel?: string
    dialogCancelLabel?: string
  }
}

const defaultCta = {
  variant: 'primary',
  icon: 'arrowForward',
  onClick: () => null,
} as const
const defaultTag = {
  variant: 'blue',
  outlined: true,
  label: '',
} as const

const defaultUnavailable = {
  active: false,
  label: '',
  message: '',
} as const

const defaultDelete = {
  visible: false,
  onClick: () => null,
  disabled: true,
  icon: 'trash',
  dialogTitle: '',
  dialogDescription: '',
  dialogConfirmLabel: '',
  dialogCancelLabel: '',
} as const

export const ActionCard: React.FC<React.PropsWithChildren<ActionCardProps>> = ({
  date,
  heading,
  headingVariant = 'h3',
  text,
  eyebrow,
  backgroundColor = 'white',
  cta: _cta,
  secondaryCta,
  tag: _tag,
  unavailable: _unavailable,
  deleteButton: _delete,
  avatar,
  focused = false,
}) => {
  const cta = { ...defaultCta, ..._cta }
  const tag = { ...defaultTag, ..._tag }
  const unavailable = { ...defaultUnavailable, ..._unavailable }
  const deleteButton = { ...defaultDelete, ..._delete }
  const backgroundMap: Record<typeof backgroundColor, Colors> = {
    blue: 'blue100',
    red: 'red100',
    white: 'white',
  }
  const colorMap: Record<typeof backgroundColor, Colors> = {
    blue: 'blue600',
    red: 'red600',
    white: 'currentColor',
  }
  const bgr = backgroundMap[backgroundColor]
  const color = colorMap[backgroundColor]

  const renderAvatar = () => {
    if (!avatar) {
      return null
    }

    return heading ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexShrink={0}
        marginRight={[2, 3]}
        borderRadius="circle"
        background="blue100"
        className={styles.avatar}
      >
        <Text variant="h3" as="p" color="blue400">
          {getTitleAbbreviation(heading)}
        </Text>
      </Box>
    ) : null
  }

  const renderDisabled = () => {
    const { label, message } = unavailable

    return (
      <Box display="flex">
        <Text variant="small">{label}&nbsp;</Text>
        <Tooltip placement="top" as="button" text={message} />
      </Box>
    )
  }

  const renderEyebrow = () => {
    if (!eyebrow) {
      return null
    }

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent={eyebrow ? 'spaceBetween' : 'flexEnd'}
        marginBottom={[0, 1]}
      >
        <Text variant="eyebrow" color="purple400">
          {eyebrow}
        </Text>

        {renderTag()}
        {renderDelete()}
      </Box>
    )
  }
  const renderDate = () => {
    if (!date) {
      return null
    }

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent={date ? 'spaceBetween' : 'flexEnd'}
        marginBottom={[0, 2]}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" marginRight={1} justifyContent="center">
            <Icon icon="time" size="medium" type="outline" color="blue400" />
          </Box>
          <Box display="flex" justifyContent="center">
            <Text variant="small">{date}</Text>
          </Box>
        </Box>
        <Inline alignY="center" space={1}>
          {!eyebrow && renderTag()}
          {!eyebrow && renderDelete()}
        </Inline>
      </Box>
    )
  }

  const renderTag = () => {
    if (!tag.label) {
      return null
    }

    return (
      <Tag outlined={tag.outlined} variant={tag.variant} disabled>
        {tag.label}
      </Tag>
    )
  }

  const renderDelete = () => {
    if (!deleteButton.visible) {
      return null
    }

    return (
      <DialogPrompt
        baseId="delete_dialog"
        title={deleteButton.dialogTitle}
        description={deleteButton.dialogDescription}
        ariaLabel="delete"
        img={
          <img
            src={`assets/images/settings.svg`}
            alt={'globe'}
            style={{ float: 'right' }}
            width="80%"
          />
        }
        disclosureElement={
          <Tag outlined={tag.outlined} variant={tag.variant}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Icon icon={deleteButton.icon} size="small" type="outline" />
            </Box>
          </Tag>
        }
        onConfirm={deleteButton.onClick}
        buttonTextConfirm={deleteButton.dialogConfirmLabel}
        buttonTextCancel={deleteButton.dialogCancelLabel}
      />
    )
  }

  const renderDefault = () => {
    const hasCTA = !!cta.label
    const hasSecondaryCTA =
      hasCTA && secondaryCta?.label && secondaryCta?.visible

    return (
      hasCTA && (
        <Box
          paddingTop={tag.label ? 'gutter' : 0}
          display="flex"
          justifyContent={['flexStart', 'flexEnd']}
          alignItems="center"
          flexDirection="row"
        >
          {hasSecondaryCTA && (
            <Box paddingRight={4} paddingLeft={2}>
              <Button
                variant="text"
                size={secondaryCta?.size}
                onClick={secondaryCta?.onClick}
                icon={secondaryCta?.icon}
                disabled={secondaryCta?.disabled}
              >
                {secondaryCta?.label}
              </Button>
            </Box>
          )}
          <Box marginLeft={[0, 3]}>
            <Button
              {...(cta.buttonType ?? { variant: cta.variant })}
              size="small"
              onClick={cta.onClick}
              disabled={cta.disabled}
              icon={cta.icon}
              iconType={cta.iconType}
            >
              {cta.label}
            </Button>
          </Box>
        </Box>
      )
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={
        focused
          ? 'mint400'
          : backgroundColor === 'red'
          ? 'red200'
          : backgroundColor === 'blue'
          ? 'blue100'
          : 'blue200'
      }
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background={bgr}
    >
      {renderEyebrow()}

      {renderDate()}
      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
      >
        {renderAvatar()}
        <Box flexDirection="row" width="full">
          {heading && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              alignItems={['flexStart', 'flexStart', 'flexEnd']}
            >
              <Text variant={headingVariant} color={color}>
                {heading}
              </Text>
              <Hidden above="xs">
                <Box>{!date && !eyebrow && renderTag()}</Box>
              </Hidden>
            </Box>
          )}

          {text && (
            <Text color={color} paddingTop={heading ? 1 : 0}>
              {text}
            </Text>
          )}
        </Box>
        <Box
          display="flex"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          marginTop={[1, 'auto']}
          marginBottom={[0, 'auto']}
          marginLeft={[0, 'auto']}
          className={styles.button}
        >
          <Hidden below="sm">{!date && !eyebrow && renderTag()}</Hidden>
          {unavailable.active ? renderDisabled() : renderDefault()}
        </Box>
      </Box>
    </Box>
  )
}

const getTitleAbbreviation = (title: string) => {
  const words = title.split(' ')
  let initials = words[0].substring(0, 1).toUpperCase()

  if (words.length > 1)
    initials += words[words.length - 1].substring(0, 1).toUpperCase()

  return initials
}
