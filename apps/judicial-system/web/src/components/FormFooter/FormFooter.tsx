import { FC } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  Button,
  ButtonTypes,
  IconMapIcon,
} from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'

import InfoBox from '../InfoBox/InfoBox'
import * as styles from './FormFooter.css'

export interface FormFooterAction {
  text: string
  onClick?: () => void
  /** Fallback navigation when no onClick is given. */
  url?: string
  icon?: IconMapIcon
  variant?: ButtonTypes['variant']
  colorScheme?: 'default' | 'destructive'
  disabled?: boolean
  loading?: boolean
  testId?: string
}

interface Props {
  previousUrl?: string
  hidePreviousButton?: boolean
  actions?: FormFooterAction[]
  infoBoxText?: string
}

const FormFooter: FC<Props> = ({
  previousUrl,
  hidePreviousButton,
  actions,
  infoBoxText,
}) => {
  const { formatMessage } = useIntl()

  const handleActionClick = (action: FormFooterAction) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.url) {
      router.push(action.url)
    }
  }

  return (
    <Box data-testid="formFooter" className={styles.formFooter}>
      {!hidePreviousButton && (
        <Box className={styles.previousButtonContainer}>
          <Button
            variant="ghost"
            data-testid="previousButton"
            onClick={() => {
              router.push(previousUrl ?? '')
            }}
            fluid
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
      )}
      {actions?.map((action, index) => (
        <Box key={index} className={styles.actionContainer}>
          <Button
            data-testid={action.testId}
            variant={action.variant ?? 'primary'}
            colorScheme={action.colorScheme ?? 'default'}
            icon={action.icon}
            disabled={action.disabled}
            loading={action.loading}
            onClick={() => handleActionClick(action)}
            fluid
          >
            {action.text}
          </Button>
        </Box>
      ))}
      {infoBoxText && (
        <div className={styles.infoBoxContainer}>
          <InfoBox text={infoBoxText} />
        </div>
      )}
    </Box>
  )
}

export default FormFooter
