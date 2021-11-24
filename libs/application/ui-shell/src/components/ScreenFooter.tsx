import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, ButtonTypes, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Application,
  formatText,
  FormModes,
  SubmitField,
  coreMessages,
  CallToAction,
} from '@island.is/application/core'

import * as styles from './ScreenFooter.css'

interface FooterProps {
  application: Application
  mode?: FormModes
  activeScreenIndex: number
  numberOfScreens: number
  goBack: () => void
  submitField?: SubmitField
  loading: boolean
  canProceed: boolean
  renderLastScreenButton?: boolean
  renderLastScreenBackButton?: boolean
}

type SubmitButton = Omit<ButtonTypes, 'circle'> & {
  icon?: 'checkmark' | 'close' | 'pencil'
}

const submitButtonConfig: Record<CallToAction['type'], SubmitButton> = {
  primary: {
    icon: 'checkmark',
    colorScheme: 'default',
    variant: 'primary',
  },
  sign: {
    icon: 'pencil',
    colorScheme: 'default',
    variant: 'primary',
  },
  subtle: {
    colorScheme: 'light',
    variant: 'ghost',
  },
  reject: {
    icon: 'close',
    colorScheme: 'destructive',
    variant: 'primary',
  },
}

export const ScreenFooter: FC<FooterProps> = ({
  activeScreenIndex,
  application,
  canProceed,
  goBack,
  loading,
  mode,
  numberOfScreens,
  submitField,
  renderLastScreenButton,
  renderLastScreenBackButton,
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const hasSubmitField = submitField !== undefined
  const isLastScreen = activeScreenIndex === numberOfScreens - 1
  const showGoBack =
    activeScreenIndex > 0 && (!isLastScreen || renderLastScreenBackButton)

  if (
    (isLastScreen && !renderLastScreenButton) ||
    (mode !== FormModes.REVIEW &&
      mode !== FormModes.APPLYING &&
      mode !== FormModes.EDITING)
  ) {
    return null
  }

  function renderSubmitButtons() {
    if (!submitField || submitField.placement === 'screen') {
      return (
        <Button
          icon="checkmarkCircle"
          loading={!canProceed || loading}
          type="submit"
        >
          {formatText(coreMessages.buttonSubmit, application, formatMessage)}
        </Button>
      )
    }

    return (
      <>
        {submitField?.actions.map(({ event, type, name }) => {
          const buttonConfig = submitButtonConfig[type]

          return (
            <Box key={`cta-${event}`} marginX={1}>
              <Button
                type="submit"
                loading={!canProceed || loading}
                colorScheme={buttonConfig.colorScheme as any}
                id={typeof event === 'object' ? event.type : event}
                variant={buttonConfig.variant}
                icon={buttonConfig.icon}
              >
                {formatText(name, application, formatMessage)}
              </Button>
            </Box>
          )
        })}
      </>
    )
  }

  return (
    <Box marginTop={7} className={styles.buttonContainer}>
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >
        <Box
          display="flex"
          flexDirection="rowReverse"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingTop={[1, 4]}
        >
          <Box display="inlineFlex" padding={2} paddingRight="none">
            {hasSubmitField ? (
              renderSubmitButtons()
            ) : isLastScreen ? (
              <Box display="inlineFlex">
                <Button
                  loading={loading}
                  onClick={() => history.push('/minarsidur')}
                  icon="arrowForward"
                  type="button"
                >
                  {formatMessage({
                    id: 'application.system:button.servicePortal',
                    defaultMessage: 'Back to Service Portal',
                    description: 'Service Portal button text',
                  })}
                </Button>
              </Box>
            ) : (
              <Box display="inlineFlex">
                <Button
                  loading={!canProceed || loading}
                  icon="arrowForward"
                  type="submit"
                >
                  {formatMessage(coreMessages.buttonNext)}
                </Button>
              </Box>
            )}
          </Box>
          <Box display={['none', 'inlineFlex']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={!canProceed || loading}
              >
                {formatMessage(coreMessages.buttonBack)}
              </Button>
            )}
          </Box>
          <Box display={['inlineFlex', 'none']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button
                circle
                variant="ghost"
                icon="arrowBack"
                onClick={goBack}
                disabled={!canProceed || loading}
              />
            )}
          </Box>
        </Box>
      </GridColumn>
    </Box>
  )
}

export default ScreenFooter
