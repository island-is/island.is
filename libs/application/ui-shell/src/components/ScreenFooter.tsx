import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Application,
  formatText,
  FormModes,
  SubmitField,
  coreMessages,
} from '@island.is/application/core'

import * as styles from './ScreenFooter.treat'
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
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const hasSubmitField = submitField !== undefined
  const isLastScreen = activeScreenIndex === numberOfScreens - 1
  const showGoBack = activeScreenIndex > 0 && !isLastScreen
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
          disabled={!canProceed || loading}
          type="submit"
        >
          {formatText(coreMessages.buttonSubmit, application, formatMessage)}
        </Button>
      )
    }
    return (
      <>
        {submitField?.actions.map(({ event, type, name }) => {
          return (
            <Box key={`cta-${event}`} marginX={1}>
              <Button
                type="submit"
                disabled={!canProceed || loading}
                colorScheme={
                  type === 'reject'
                    ? 'destructive'
                    : type === 'subtle'
                    ? 'light'
                    : 'default'
                }
                id={typeof event === 'object' ? event.type : event}
                variant={type === 'subtle' ? 'ghost' : 'primary'}
                icon={
                  type === 'primary'
                    ? 'checkmarkCircle'
                    : type === 'reject'
                    ? 'closeCircle'
                    : undefined
                }
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
        span={['12/12', '12/12', '7/9', '7/9']}
        offset={['0', '0', '1/9']}
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
                  disabled={loading}
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
                  disabled={!canProceed || loading}
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
              <Button variant="ghost" onClick={goBack}>
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
              />
            )}
          </Box>
        </Box>
      </GridColumn>
    </Box>
  )
}

export default ScreenFooter
