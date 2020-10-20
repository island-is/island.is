import * as React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Tag, TagVariant } from '../Tag/Tag'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import {
  ProgressMeter,
  ProgressMeterVariant,
} from '../ProgressMeter/ProgressMeter'
import * as styles from './ActionCard.treat'

type ActionCardProps = {
  heading: string
  text?: string
  tag?: {
    label: string
    variant?: TagVariant
  }
  cta: {
    label: string
    /**
     * 'primary' renders a button, 'secondary' renders a text button
     */
    variant?: 'primary' | 'secondary'
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
  onClick: () => null,
} as const

const defaultTag = {
  variant: 'blue',
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
  heading,
  text,
  cta: _cta,
  tag: _tag,
  unavailable: _unavailable,
  progressMeter: _progressMeter,
}) => {
  const cta = { ...defaultCta, ..._cta }
  const progressMeter = { ...defaultProgressMeter, ..._progressMeter }
  const tag = { ...defaultTag, ..._tag }
  const unavailable = { ...defaultUnavailable, ..._unavailable }

  const renderDisabled = () => {
    const { label, message } = unavailable
    return (
      <Box display="flex">
        <Text variant="small">{label}&nbsp;</Text>
        <Tooltip placement="top" as="button" text={message} />
      </Box>
    )
  }

  const renderDefault = () => {
    const hasCTA = cta.label && !progressMeter.active

    return (
      <Stack space="gutter">
        {tag.label && (
          <Tag label variant={tag.variant}>
            {tag.label}
          </Tag>
        )}
        {hasCTA && (
          <Button
            variant={cta.variant === 'secondary' ? 'text' : 'primary'}
            onClick={cta.onClick}
          >
            {cta.label}
          </Button>
        )}
      </Stack>
    )
  }

  const renderProgressMeter = () => {
    const { variant, progress } = progressMeter
    return (
      <Box
        width="full"
        paddingTop={2}
        display="flex"
        alignItems={['flexStart', 'flexStart', 'center']}
        flexDirection={['column', 'column', 'row']}
      >
        <ProgressMeter
          variant={variant}
          progress={progress}
          className={styles.progressMeter}
        />
        <Box
          display="inlineFlex"
          marginLeft={[0, 0, 'auto']}
          paddingTop={[2, 2, 0]}
        >
          <Button
            variant={cta.variant === 'secondary' ? 'text' : 'primary'}
            onClick={cta.onClick}
            icon="arrowForward"
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
      borderColor="blue200"
      borderRadius="standard"
      borderWidth="standard"
      paddingX={4}
      paddingY={3}
    >
      <Box alignItems="center" display="flex">
        <Box>
          <Text variant="h3">{heading}</Text>
          <Text paddingTop={1}>{text}</Text>
        </Box>

        <Box
          alignItems="flexEnd"
          display="flex"
          flexDirection="column"
          marginLeft="auto"
        >
          {unavailable.active ? renderDisabled() : renderDefault()}
        </Box>
      </Box>
      {progressMeter.active && renderProgressMeter()}
    </Box>
  )
}
