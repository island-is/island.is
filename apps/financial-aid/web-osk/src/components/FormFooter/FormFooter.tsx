import React from 'react'
import { Box, Button, Icon, Text, ButtonProps } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './FormFooter.treat'
import cn from 'classnames'
interface Props {
  hidePreviousButton?: boolean
  previousIsDestructive?: boolean
  previousUrl?: string
  previousIsDisabled?: boolean
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
  nextButtonIcon?: ButtonProps['icon']
  onNextButtonClick?: () => void
  hideNextButton?: boolean
  infoBoxText?: string
}

const FormFooter: React.FC<Props> = (props: Props) => {
  const router = useRouter()

  return (
    <>
      <Box className={styles.dividerContainer} />

      <div className={styles.footerContainer}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="flexStart"
          className={cn({
            [`${styles.oneButton}`]: props.hidePreviousButton,
          })}
        >
          {!props.hidePreviousButton && (
            <>
              <Box className={styles.desktopPreviosButton}>
                <Button
                  colorScheme={
                    props.previousIsDestructive ? 'destructive' : 'default'
                  }
                  variant="ghost"
                  disabled={props.previousIsDisabled}
                  onClick={() => {
                    router.push(props.previousUrl || '')
                  }}
                >
                  {props.previousIsDestructive ? 'Hætta við' : 'Til baka'}
                </Button>
              </Box>

              <Box className={styles.mobilePreviosButton}>
                <Button
                  circle
                  colorScheme={
                    props.previousIsDestructive ? 'destructive' : 'default'
                  }
                  icon="arrowBack"
                  iconType="filled"
                  variant="ghost"
                  type="button"
                  size="large"
                  onClick={() => {
                    router.push(props.previousUrl || '')
                  }}
                />
              </Box>
            </>
          )}

          {!props.hideNextButton && (
            <Button
              id="continueButton"
              data-testid="continueButton"
              icon={
                props.nextButtonIcon ? props.nextButtonIcon : 'arrowForward'
              }
              iconType="outline"
              disabled={props.nextIsDisabled}
              loading={props.nextIsLoading}
              onClick={() => {
                if (props.onNextButtonClick) {
                  props.onNextButtonClick()
                } else if (props.nextUrl) {
                  router.push(props.nextUrl)
                }
              }}
            >
              {props.nextButtonText ?? 'Halda áfram'}
            </Button>
          )}
          {props.infoBoxText && (
            <div className={styles.infoBoxContainer}>
              <Box display="flex" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  marginRight={2}
                  flexShrink={0}
                >
                  <Icon
                    type="filled"
                    color="blue400"
                    icon="informationCircle"
                  />
                </Box>
                <Text variant="small">{props.infoBoxText}</Text>
              </Box>
            </div>
          )}
        </Box>
      </div>
    </>
  )
}

export default FormFooter
