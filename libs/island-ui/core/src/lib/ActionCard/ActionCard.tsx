import * as React from 'react'
import { Box } from '../Box/Box'
import { Button, ButtonSizes, ButtonTypes } from '../Button/Button'
import { Tag, TagVariant } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import {
  ProgressMeter,
  ProgressMeterVariant,
} from '../ProgressMeter/ProgressMeter'
import * as styles from './ActionCard.css'
import { Icon } from '../IconRC/Icon'

type ActionCardProps = {
  date?: string
  heading?: string
  text?: string
  eyebrow?: string
  backgroundColor?: 'white' | 'blue' | 'red'
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
  cta: {
    label: string
    variant?: ButtonTypes['variant']
    size?: ButtonSizes
    icon?: 'arrowForward'
    onClick?: () => void
    disabled?: boolean
  }
  secondaryCta?: {
    label: string
    icon?: 'arrowForward'
    onClick?: () => void
  }
  progressMeter?: {
    active?: boolean
    variant?: ProgressMeterVariant
    progress?: number
  }
  unavailable?: {
    active?: boolean
    label?: string
    message?: string
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

const defaultProgressMeter = {
  variant: 'blue',
  active: false,
  progress: 0,
} as const

const defaultUnavailable = {
  active: false,
  label: '',
  message: '',
} as const

export const ActionCard: React.FC<ActionCardProps> = ({
  date,
  heading,
  text,
  eyebrow,
  backgroundColor = 'white',
  cta: _cta,
  secondaryCta,
  tag: _tag,
  unavailable: _unavailable,
  progressMeter: _progressMeter,
}) => {
  const cta = { ...defaultCta, ..._cta }
  const progressMeter = { ...defaultProgressMeter, ..._progressMeter }
  const tag = { ...defaultTag, ..._tag }
  const unavailable = { ...defaultUnavailable, ..._unavailable }
  const bgr =
    backgroundColor === 'white'
      ? 'white'
      : backgroundColor === 'red'
      ? 'red100'
      : 'blue100'

  const renderDisabled = () => {
    const { label, message } = unavailable

    return (
      <Box display="flex">
        <Text variant="small">{label}&nbsp;</Text>
        <Tooltip placement="top" as="button" text={message} />
      </Box>
    )
  }

  const renderDate = () => {
    if (!date) {
      return null
    }

    return (
      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent="spaceBetween"
        marginBottom={1}
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box marginRight="smallGutter">
            <Icon size="small" icon="time" type="outline" color="blue400" />
          </Box>

          <Text variant="small">{date}</Text>
        </Box>

        {renderTag()}
      </Box>
    )
  }

  const renderTag = () => {
    if (!tag.label) {
      return null
    }

    return (
      <Box paddingTop={[1, 1, 0]}>
        <Tag outlined={tag.outlined} variant={tag.variant} disabled>
          {tag.label}
        </Tag>
      </Box>
    )
  }

  const renderDefault = () => {
    const hasCTA = cta.label && !progressMeter.active
    const hasSecondaryCTA =
      hasCTA && secondaryCta?.label && !progressMeter.active

    return (
      <>
        {!date && renderTag()}

        {!!hasCTA && (
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
                  onClick={secondaryCta?.onClick}
                  icon={'document'}
                >
                  {secondaryCta?.label}
                </Button>
              </Box>
            )}
            <Box>
              <Button
                variant={cta.variant}
                size="small"
                onClick={cta.onClick}
                disabled={cta.disabled}
                icon={cta.icon}
              >
                {cta.label}
              </Button>
            </Box>
          </Box>
        )}
      </>
    )
  }

  const renderProgressMeter = () => {
    const { variant, progress } = progressMeter
    const paddingWithDate = date ? 0 : 1
    const alignWithDate = date ? 'flexEnd' : 'center'

    return (
      <Box
        width="full"
        paddingTop={[1, 1, 1, paddingWithDate]}
        display="flex"
        alignItems={['flexStart', 'flexStart', alignWithDate]}
        flexDirection={['column', 'column', 'row']}
        className={date ? styles.progressMeterWithDate : undefined}
      >
        <ProgressMeter
          variant={variant}
          progress={progress}
          className={styles.progressMeter}
        />

        <Box marginLeft={[0, 0, 'auto']} paddingTop={[2, 2, 0]}>
          <Button
            variant={cta.variant}
            onClick={cta.onClick}
            icon={cta.icon}
            size={cta.size}
          >
            {cta.label}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={backgroundColor === 'red' ? 'red200' : 'blue200'}
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background={bgr}
    >
      {renderDate()}

      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
      >
        <Box>
          <Text variant="eyebrow" color="purple400">
            {eyebrow}
          </Text>
          <Text variant="h3">{heading}</Text>
          <Text paddingTop={heading ? 1 : 0}>{text}</Text>
        </Box>

        <Box
          display="flex"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          marginTop={['gutter', 0]}
          marginLeft={[0, 'auto']}
        >
          {unavailable.active ? renderDisabled() : renderDefault()}
        </Box>
      </Box>

      {progressMeter.active && renderProgressMeter()}
    </Box>
  )
}
