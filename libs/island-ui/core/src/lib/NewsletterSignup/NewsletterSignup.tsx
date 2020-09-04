import React from 'react'
import Typography from '../Typography/Typography'
import Input from '../Input/Input'
import { Button } from '../Button/Button'

import * as styles from './NewsletterSignup.treat'
import { Box } from '../Box'
import { GridContainer, GridColumn, GridRow } from '../Grid'

type ColorVariant = 'white' | 'blue'
type State = 'default' | 'error'

interface Props {
  heading: string
  text: string
  id?: string
  placeholder: string
  label: string
  buttonText: string
  variant?: ColorVariant
  onClickSubmit: () => void
  state?: State
  errorMessage?: string
}

export const NewsletterSignup: React.FC<Props> = ({
  heading,
  text,
  id = 'newsletter',
  placeholder,
  label,
  buttonText,
  variant = 'white',
  state = 'default',
  errorMessage,
  onClickSubmit = () => null,
}) => {
  return (
    <Box className={styles.variants[variant]} paddingY={5}>
      <GridContainer>
        <GridRow>
          <GridColumn
            offset={['0', '0', '1/12']}
            span={['12/12', '12/12', '4/12']}
            paddingBottom={[2, 2, 0]}
          >
            <Typography variant="h3" as="h3">
              {heading}
            </Typography>
            <Typography variant="p">{text}</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '5/12']}>
            <Input
              name={id}
              placeholder={placeholder}
              label={label}
              backgroundColor={variant === 'white' ? 'blue' : 'white'}
              hasError={state === 'error'}
              errorMessage={errorMessage}
            />
            <Box className={styles.buttonWrap} paddingTop={1}>
              <Button variant="text" onClick={onClickSubmit}>
                {buttonText}
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default NewsletterSignup
