import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Footer } from './Footer'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=345%3A0'

export default {
  title: 'Navigation/Footer',
  component: Footer,
  decorators: [withDesign],
  parameters: {
    docs: {
      description: {
        component: `[View in Figma](${figmaLink})`,
      },
    },
    design: {
      type: 'figma',
      url: figmaLink,
    },
  },
}

export const Default = () => <Footer showMiddleLinks showTagLinks />
