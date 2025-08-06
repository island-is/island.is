import { coreMessages, formatText } from '@island.is/application/core'
import {
  Application,
  CallToAction,
  FormModes,
  FormText,
  SubmitField,
  StaticText,
} from '@island.is/application/types'
import { Box, Button, ButtonTypes, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'

import { useUserInfo } from '@island.is/react-spa/bff'
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
  shouldLastScreenButtonSubmit?: boolean
  renderLastScreenBackButton?: boolean
  submitButtonDisabled?: boolean
  nextButtonText?: FormText
  canGoBack: boolean
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
  signGhost: {
    icon: 'pencil',
    colorScheme: 'light',
    variant: 'ghost',
  },
  reject: {
    icon: 'close',
    colorScheme: 'destructive',
    variant: 'primary',
  },
  rejectGhost: {
    icon: 'close',
    colorScheme: 'destructive',
    variant: 'ghost',
  },
}

export const ScreenFooter: FC<React.PropsWithChildren<FooterProps>> = ({
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
  submitButtonDisabled,
  nextButtonText,
  canGoBack,
}) => {
  const { formatMessage } = useLocale()
  const user = useUserInfo()
  const hasSubmitField = submitField !== undefined
  const isLastScreen = activeScreenIndex === numberOfScreens - 1
  const showGoBack = canGoBack && (!isLastScreen || renderLastScreenBackButton)

  let nextButtonTextVal: StaticText | null | undefined
  if (typeof nextButtonText === 'function') {
    nextButtonTextVal = nextButtonText(application)
  } else {
    nextButtonTextVal = nextButtonText
  }

  if (
    (isLastScreen && !renderLastScreenButton) ||
    (mode !== FormModes.IN_PROGRESS &&
      mode !== FormModes.DRAFT &&
      mode !== FormModes.NOT_STARTED)
  ) {
    return null
  }

  const renderSubmitButtons = () => {
    if (!submitField || submitField.placement === 'screen') {
      return (
        <Button
          icon="checkmarkCircle"
          data-testid={submitField?.dataTestId}
          loading={!canProceed || loading}
          type="submit"
          disabled={submitButtonDisabled}
        >
          {formatText(coreMessages.buttonSubmit, application, formatMessage)}
        </Button>
      )
    }

    return submitField?.actions
      .filter(({ condition }) =>
        typeof condition === 'function'
          ? condition(application.answers, application.externalData, user)
          : true,
      )
      .map(({ event, type, name, dataTestId }, idx) => {
        const buttonConfig = submitButtonConfig[type]

        return (
          <Box key={`cta-${event}`} marginLeft={idx === 0 ? 0 : 2}>
            <Button
              type="submit"
              loading={!canProceed || loading}
              colorScheme={buttonConfig.colorScheme as any}
              data-testid={dataTestId}
              id={typeof event === 'object' ? event.type : event}
              variant={buttonConfig.variant}
              icon={buttonConfig.icon}
              disabled={submitButtonDisabled}
            >
              {formatText(name, application, formatMessage)}
            </Button>
          </Box>
        )
      })
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
                <a href="/minarsidur" className={styles.linkNoStyle}>
                  <Button
                    as="span"
                    loading={loading}
                    icon="arrowForward"
                    data-testid="applications-home"
                    type="button"
                  >
                    {formatMessage({
                      id: 'application.system:button.servicePortal',
                      defaultMessage: 'Til baka á Mínar Síður',
                      description: 'Service Portal button text',
                    })}
                  </Button>
                </a>
              </Box>
            ) : (
              <Box display="inlineFlex">
                <Button
                  loading={!canProceed || loading}
                  icon="arrowForward"
                  data-testid="proceed"
                  type="submit"
                  disabled={submitButtonDisabled}
                >
                  {nextButtonTextVal
                    ? formatText(nextButtonTextVal, application, formatMessage)
                    : formatMessage(coreMessages.buttonNext)}
                </Button>
              </Box>
            )}
          </Box>
          <Box display={['none', 'inlineFlex']} padding={2} paddingLeft="none">
            {showGoBack && (
              <Button
                variant="ghost"
                data-testid="step-back"
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
                data-testid="step-back"
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
