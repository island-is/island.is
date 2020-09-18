import React from 'react'
import { Logo } from './Logo'
import { color } from '@storybook/addon-knobs'

export default {
  title: 'Components/Logo',
  component: Logo,
}

export const Default = () => <Logo />

export const Solid = () => (
  <Logo width={200} solid solidColor={color('Logo color', '#fff')} />
)

export const IconOnly = () => <Logo width={30} iconOnly />

export const SolidIconOnly = () => (
  <Logo width={200} iconOnly solid solidColor={color('Logo color', '#fff')} />
)

Solid.story = {
  decorators: [
    (story: any) => (
      <div
        style={{
          backgroundColor: color('Background color', '#000'),
          padding: 20,
        }}
      >
        {story()}
      </div>
    ),
  ],
}
