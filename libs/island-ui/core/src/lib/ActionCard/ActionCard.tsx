import * as React from 'react'

import type { Colors } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Tag } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import * as styles from './ActionCard.css'
import { Hidden } from '../Hidden/Hidden'
import { Icon } from '../IconRC/Icon'
import { ProgressMeter } from '../ProgressMeter/ProgressMeter'
import type { ActionCardProps, BackgroundColor } from './types'

const defaultCta = {
  variant: 'primary',
  icon: 'arrowForward',
  onClick: () => null,
  fluid: true,
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

const backgroundMap: Record<BackgroundColor, Colors> = {
  blue: 'blue100',
  red: 'red100',
  white: 'white',
}
const colorMap: Record<BackgroundColor, Colors> = {
  blue: 'blue600',
  red: 'red600',
  white: 'currentColor',
}

const eyebrowMap: Record<BackgroundColor, Colors> = {
  blue: 'purple400',
  red: 'purple400',
  white: 'blue400',
}

const borderMap: Record<BackgroundColor, Colors> = {
  blue: 'blue100',
  red: 'red200',
  white: 'blue200',
}

const avatarMap: Record<BackgroundColor, { circle: Colors; text: Colors }> = {
  blue: { circle: 'blue200', text: 'blue400' },
  red: { circle: 'red200', text: 'red600' },
  white: { circle: 'blue100', text: 'blue400' },
}

export const ActionCard: React.FC<React.PropsWithChildren<ActionCardProps>> = ({
  date,
  heading,
  headingVariant = 'h3',
  renderHeading,
  text,
  subText,
  eyebrow,
  backgroundColor = 'white',
  eyebrowColor = eyebrowMap[backgroundColor],
  cta: _cta,
  tag: _tag,
  unavailable: _unavailable,
  avatar,
  focused = false,
  progressMeter,
}) => {
  const cta = { ...defaultCta, ..._cta }
  const tag = { ...defaultTag, ..._tag }
  const unavailable = { ...defaultUnavailable, ..._unavailable }

  const bgr = backgroundMap[backgroundColor]
  const color = colorMap[backgroundColor]
  const avatarColors = avatarMap[backgroundColor]
  const borderColor = borderMap[backgroundColor]

  const hasEyebrowElements = Boolean(date || eyebrow)
  const hasCTAElements = Boolean(cta?.label || unavailable?.active)
  const hasTag = Boolean(tag?.label)

  const renderAvatar = () => {
    if (!avatar || !heading) {
      return null
    }

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexShrink={0}
        marginRight={[2, 3]}
        borderRadius="full"
        background={avatarColors.circle}
        className={styles.avatar}
      >
        <Text variant="h3" as="p" color={avatarColors.text}>
          {getTitleAbbreviation(heading)}
        </Text>
      </Box>
    )
  }

  const renderDisabled = () => {
    if (!unavailable?.active) {
      return null
    }

    return (
      <Box display="flex">
        <Text variant="small">{unavailable.label}&nbsp;</Text>
        <Tooltip placement="top" as="button" text={unavailable.message} />
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
      >
        <Text variant="eyebrow" color={eyebrowColor}>
          {eyebrow}
        </Text>
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
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" marginRight={1} justifyContent="center">
            <Icon
              icon="time"
              size="medium"
              type="outline"
              color={eyebrowColor}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Text variant="small">{date}</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  const renderTag = () => {
    if (!tag.label) {
      return null
    }

    const tagEl = (
      <Tag outlined={tag.outlined} variant={tag.variant} disabled>
        {tag.label}
      </Tag>
    )

    return tag.renderTag ? tag.renderTag(tagEl) : tagEl
  }

  const renderCTA = () => {
    if (!cta?.label || unavailable?.active) {
      return null
    }

    const isTextVariant =
      cta?.variant === 'text' || cta.buttonType?.variant === 'text'

    // varinat="text" buttons should be small
    const smallButton = isTextVariant && _cta?.size === undefined

    // variant="text" buttons should not full width on mobile
    const intrinsicSize = isTextVariant && _cta?.fluid === undefined

    return (
      <Box
        display="flex"
        justifyContent={['flexStart', 'flexEnd']}
        alignItems={['stretch', 'center']}
        flexDirection="row"
        marginTop={hasTag ? 'auto' : 0}
        paddingTop={hasTag ? 1 : 0}
        marginLeft={[0, 0, 5]}
      >
        <Button
          {...(cta.buttonType ?? { variant: cta.variant })}
          size={smallButton ? 'small' : cta.size}
          onClick={cta.onClick}
          disabled={cta.disabled}
          icon={cta.icon}
          iconType={cta.iconType}
          fluid={intrinsicSize ? false : cta.fluid}
        >
          {cta.label}
        </Button>
      </Box>
    )
  }

  const renderProgressMeter = () => {
    if (!progressMeter) {
      return null
    }

    return (
      <Box marginTop={2} marginRight={5}>
        <ProgressMeter
          progress={
            Number(
              (
                progressMeter.currentProgress / progressMeter.maxProgress
              ).toFixed(1),
            ) < 1
              ? Number(
                  (
                    progressMeter.currentProgress / progressMeter.maxProgress
                  ).toFixed(1),
                )
              : 1
          }
          withLabel={progressMeter?.withLabel}
          labelMin={progressMeter.currentProgress}
          labelMax={progressMeter.maxProgress}
          variant={progressMeter?.variant}
        />
      </Box>
    )
  }

  const headingEl = (
    <Text variant={headingVariant} color={color}>
      {heading}
    </Text>
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={focused ? 'mint400' : borderColor}
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background={bgr}
    >
      {hasEyebrowElements ? (
        // The top box
        <Box display="flex" marginBottom={1}>
          <Box
            display="flex"
            alignItems="center"
            flexGrow={1}
            columnGap={[1, 2]}
          >
            {renderDate()}
            {renderEyebrow()}
          </Box>

          {renderTag()}
        </Box>
      ) : null}

      <Box
        // The left content box
        alignItems={['stretch', 'center', 'stretch', 'center']}
        display="flex"
        flexDirection={['column', 'row', 'column', 'row']}
        rowGap={3}
        columnGap={3}
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
              {renderHeading ? renderHeading(headingEl) : headingEl}

              {hasEyebrowElements ? null : (
                <Hidden above="xs">{renderTag()}</Hidden>
              )}

              {!hasCTAElements && !hasEyebrowElements ? (
                <Hidden below="sm">{renderTag()}</Hidden>
              ) : null}
            </Box>
          )}

          {text && (
            <Text color={color} paddingTop={heading ? 1 : 0}>
              {text}
            </Text>
          )}
          {subText && (
            <Text color={color} paddingTop={'smallGutter'}>
              {subText}
            </Text>
          )}

          {renderProgressMeter()}
        </Box>

        <Box
          // The right content box
          alignItems={['stretch', 'flexEnd', 'flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          className={styles.button}
          justifyContent="center"
          display={hasCTAElements ? 'flex' : 'none'}
        >
          {hasEyebrowElements || !hasTag ? null : (
            <Box display={['none', 'block']} marginBottom="auto">
              {renderTag()}
            </Box>
          )}

          {unavailable.active ? renderDisabled() : renderCTA()}
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
