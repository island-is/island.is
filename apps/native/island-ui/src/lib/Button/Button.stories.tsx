import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Button } from './Button'

storiesOf('Button', module)
  .add('btn a', () => (
    <Button>hi</Button>
  ))
  .add('btn b', () => (
    <Button>hi</Button>
  ))
