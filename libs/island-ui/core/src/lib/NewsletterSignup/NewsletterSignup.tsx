import React, { useState } from 'react'
import Typography from '../Typography/Typography'
import Input from '../Input/Input'
import { Button } from '../Button/Button'

import * as styles from './NewsletterSignup.treat'
import { Box } from '../Box'
import { GridContainer, GridColumn, GridRow } from '../Grid'

type ColorVariant = 'white' | 'blue'

interface Props {
  heading: string
  text: string
  id?: string
  placeholder: string
  label: string
  buttonText: string
  variant?: ColorVariant
  onClickSubmit: () => void
}

export const NewsletterSignup: React.FC<Props> = ({
  heading,
  text,
  id = 'newsletter',
  placeholder,
  label,
  buttonText,
  variant = 'white',
  onClickSubmit = () => null,
}) => {
  return (
    <Box className={styles.variants[variant]} paddingY={5}>
      <GridContainer>
        <GridRow>
          <GridColumn
            offset={[0, 0, 1]}
            span={[12, 12, 4]}
            paddingBottom={[2, 2, 0]}
          >
            <Typography variant="h3" as="h3">
              {heading}
            </Typography>
            <Typography variant="p">{text}</Typography>
          </GridColumn>
          <GridColumn span={[12, 12, 5]}>
            <Input
              name={id}
              placeholder={placeholder}
              label={label}
              backgroundColor={variant === 'white' ? 'blue' : 'white'}
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
