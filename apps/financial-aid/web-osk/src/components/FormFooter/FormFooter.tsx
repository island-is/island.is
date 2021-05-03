import React from 'react'
import { Box, Button, Icon, Text, GridColumn } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './FormFooter.treat'
interface Props {
  hidePreviousButton?: boolean
  previousIsDestructive?:boolean
  previousUrl?: string
  previousIsDisabled?: boolean
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
  nextButtonIcon?:string
  onNextButtonClick?: () => void
  hideNextButton?: boolean
  infoBoxText?: string
}

const FormFooter: React.FC<Props> = (props: Props) => {
  const router = useRouter()

  return (
    <div className={styles.footerContainer}>

      <GridColumn
        span={['9/9', '9/9', '7/9', '7/9']}
        offset={['0', '0', '1/9', '1/9']}
      >

      <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart" >
        {!props.hidePreviousButton && (
          <Button
            colorScheme={props.previousIsDestructive ? "destructive" : "default"}
            variant="ghost"
            disabled={props.previousIsDisabled}
            onClick={() => {
              router.push(props.previousUrl || '')
            }}
          >
            {props.previousIsDestructive ? 'Hætta við' : 'Til baka'}
          </Button>
        )}
        {!props.hideNextButton && (
          <Button
            data-testid="continueButton"
            icon={'arrowForward'}
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
                <Icon type="filled" color="blue400" icon="informationCircle" />
              </Box>
              <Text variant="small">{props.infoBoxText}</Text>
            </Box>
          </div>
        )}
      </Box>

      </GridColumn>

    </div>
  )
}

export default FormFooter
