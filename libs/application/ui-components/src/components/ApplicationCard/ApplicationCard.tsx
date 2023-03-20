import * as React from 'react'
import {
  Box,
  Button,
  ButtonSizes,
  ButtonTypes,
  DraftProgressMeterVariant,
  Hidden,
  Icon,
  Inline,
  TagVariant,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import * as styles from './ApplicationCard.css'
import { ApplicationCardDelete } from './components/ApplicationCardDelete'
import {
  ApplicationCardHistory,
  ApplicationCardHistoryConfig,
} from './components/ApplicationCardHistory'
import { ApplicationCardProgress } from './components/ApplicationCardProgress'
import { ApplicationCardTag } from './components/ApplicationCardTag'

export type ApplicationCardProps = {
  date?: string
  heading?: string
  headingVariant?: 'h3' | 'h4'
  text?: string
  eyebrow?: string
  logo?: string
  backgroundColor?: 'white' | 'blue' | 'red'
  focused?: boolean
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
  cta: {
    label: string
    variant?: ButtonTypes['variant']
    size?: ButtonSizes
    onClick?: () => void
    disabled?: boolean
  }

  progressMeter?: {
    active?: boolean
    progress?: number
    variant?: DraftProgressMeterVariant
    draftTotalSteps?: number
    draftFinishedSteps?: number
  }
  unavailable?: {
    active?: boolean
    label?: string
    message?: string
  }
  deleteButton?: {
    visible?: boolean
    onClick?: () => void
    disabled?: boolean
    dialogTitle?: string
    dialogDescription?: string
    dialogConfirmLabel?: string
    dialogCancelLabel?: string
  }
  status?: string
  renderDraftStatusBar?: boolean
  history?: ApplicationCardHistoryConfig
}

const defaultCta = {
  variant: 'primary',
  icon: 'arrowForward',
  size: 'default',
  label: '',
  disabled: false,
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
  draftFinishedSteps: 1,
  draftTotalSteps: 1,
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

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  date,
  heading,
  headingVariant = 'h3',
  text,
  eyebrow,
  backgroundColor = 'white',
  cta = defaultCta,
  tag = defaultTag,
  unavailable = defaultUnavailable,
  progressMeter = defaultProgressMeter,
  deleteButton = defaultDelete,
  history,
  logo,
  status,
  renderDraftStatusBar = false,
  focused = false,
}) => {
  const hasCTA = cta && !!cta.label && !progressMeter.active
  const shouldRenderProgress = status === 'draft'
  const hasHistory = history?.items && history.items.length > 0
  const bg =
    backgroundColor === 'white'
      ? 'white'
      : backgroundColor === 'red'
      ? 'red100'
      : 'blue100'
  const border = focused
    ? 'mint400'
    : backgroundColor === 'red'
    ? 'red200'
    : backgroundColor === 'blue'
    ? 'blue100'
    : 'blue200'

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={border}
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background={bg}
    >
      {eyebrow && (
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

          <ApplicationCardTag tag={tag} />
          <ApplicationCardDelete deleteButton={deleteButton} tag={tag} />
        </Box>
      )}

      {date && (
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
            {!eyebrow && <ApplicationCardTag tag={tag} />}
            {!eyebrow && (
              <ApplicationCardDelete deleteButton={deleteButton} tag={tag} />
            )}
          </Inline>
        </Box>
      )}

      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
      >
        <Box flexDirection="row" width="full">
          {heading && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              alignItems={['flexStart', 'flexStart', 'flexEnd']}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                {logo && (
                  <Box
                    padding={2}
                    marginRight={2}
                    className={styles.logo}
                    style={{ backgroundImage: `url(${logo})` }}
                  ></Box>
                )}
                <Text
                  variant={headingVariant}
                  color={
                    backgroundColor === 'blue' ? 'blue600' : 'currentColor'
                  }
                >
                  {heading}
                </Text>
              </Box>
              <Hidden above="xs">
                <Box>
                  {!date && !eyebrow && <ApplicationCardTag tag={tag} />}
                </Box>
              </Hidden>
            </Box>
          )}

          {text && <Text paddingTop={heading ? 1 : 0}>{text}</Text>}
        </Box>

        <Box
          display="flex"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          marginTop={[1, 0]}
          marginLeft={[0, 'auto']}
          className={progressMeter.active && tag ? styles.tag : styles.button}
        >
          <Hidden below="sm">
            {!date && !eyebrow && <ApplicationCardTag tag={tag} />}
          </Hidden>
          {unavailable.active ? (
            <Box display="flex">
              <Text variant="small">{unavailable.label}&nbsp;</Text>
              <Tooltip placement="top" as="button" text={unavailable.message} />
            </Box>
          ) : hasCTA ? (
            <Box
              paddingTop={tag.label ? 'gutter' : 0}
              display="flex"
              justifyContent={['flexStart', 'flexEnd']}
              alignItems="center"
              flexDirection="row"
            >
              <Box marginLeft={[0, 3]}>
                <Button
                  variant={cta.variant}
                  size="small"
                  onClick={cta.onClick}
                  disabled={cta.disabled}
                  icon="arrowForward"
                >
                  {cta.label}
                </Button>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>

      {shouldRenderProgress ? (
        <ApplicationCardProgress
          progressMeter={progressMeter}
          cta={cta}
          hasDate={!!date}
          renderDraftStatusBar={renderDraftStatusBar}
        />
      ) : hasHistory ? (
        <ApplicationCardHistory
          history={history}
          size={history.items?.some((x) => !!x.content) ? 'lg' : 'sm'}
        />
      ) : null}
    </Box>
  )
}
