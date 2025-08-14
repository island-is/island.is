import React from 'react'
import { Gallery, GalleryProps } from './Gallery'
import type { Meta, StoryObj } from '@storybook/react'
import { withFigma } from '@island.is/island-ui/core'
import { GalleryItem } from './GalleryItem'

const config: Meta<typeof Gallery> = {
  title: 'My pages/Gallery',
  component: Gallery,
  parameters: withFigma('Gallery'),
  argTypes: {
    thumbnails: {
      description:
        'Array of GalleryItem components to be displayed in the gallery',
      control: { type: GalleryItem },
    },
    children: {
      description:
        'Array of GalleryItem components to be displayed in the gallery',
      control: { type: GalleryItem },
    },
    loading: {
      description: 'Boolean to indicate if the gallery is loading',
      control: { type: 'boolean' },
    },
  },
}

export default config

export const Default: StoryObj<GalleryProps> = {
  render: (args) => <Gallery {...args} />,
}

Default.args = {
  thumbnails: [
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
  ],
  children: [
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
    <GalleryItem>
      <img src="https://placehold.co/400" alt="Placeholder for gallery item" />
    </GalleryItem>,
  ],
  loading: false,
}
