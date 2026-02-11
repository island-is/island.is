import React from 'react'
import { AudioPlayer } from './AudioPlayer'
import { withFigma } from '@island.is/island-ui/core'

export default {
  title: 'My pages/Audio Player',
  component: AudioPlayer,
  parameters: withFigma('Audio Player'),
}

export const Default = () => (
  <AudioPlayer
    url="https://cdn.pixabay.com/audio/2025/05/08/audio_07264c7f8e.mp3"
    title="Sample Audio Track"
  />
)
