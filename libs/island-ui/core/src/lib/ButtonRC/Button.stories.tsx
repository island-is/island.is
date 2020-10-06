import React from 'react'
import { Button, ButtonProps } from './Button'
import { Box } from '../..'
import { Stack } from '../Stack/Stack'

export default {
  title: 'Core/ButtonRC',
  component: Button,
}

type colorScheme = 'default' | 'destructive' | 'negative'

const sizes = ['default', 'small', 'large'] as ButtonProps['size'][]
const colorSchemes = ['default', 'destructive'] as colorScheme[]

const makeButton = (variant) => (
  <Box padding={2}>
    <Stack space={3} dividers="regular">
      {colorSchemes.map((color) =>
        sizes.map((size) => (
          <Stack space={3}>
            <p>
              color: {color}, size: {size}
            </p>
            <Button variant={variant} colorScheme={color} size={size}>
              Button text
            </Button>
          </Stack>
        )),
      )}
      <Stack space={3}>
        <p>Button disabled</p>
        <Button variant={variant} disabled>
          Button text
        </Button>
      </Stack>
      <Stack space={3}>
        <p>Button disabled but focusable</p>
        <Button variant={variant} disabled focusable>
          Button text
        </Button>
      </Stack>
      <Stack space={3}>
        <p>Button multiline</p>
        <Button variant={variant}>
          Button text
          <br />
          multiline
        </Button>
      </Stack>
      <Stack space={3}>
        <p>Button with icon</p>
        <Button variant={variant} icon="arrowRight">
          Button text
        </Button>
      </Stack>
      <Stack space={3}>
        <p>Button multiline with icon</p>
        <Button variant={variant} icon="arrowRight">
          Button text
          <br />
          multiline
        </Button>
      </Stack>
      {variant !== 'text' &&
        colorSchemes.map((color) =>
          sizes.map((size) => (
            <Stack space={3}>
              <p>
                Circle, color: {color}, size: {size}
              </p>
              <Button
                variant={variant}
                colorScheme={color}
                size={size}
                circle
                icon="arrowRight"
              />
            </Stack>
          )),
        )}
    </Stack>
  </Box>
)

export const Primary = () => makeButton('primary')

export const Ghost = () => makeButton('ghost')

export const Text = () => makeButton('text')
