import React from 'react'
import { Button } from '../Button/Button'
import { withDesign } from 'storybook-addon-designs'
import { withFigma } from '../../utils/withFigma'
import { DialogPrompt } from './DialogPrompt'

export default {
  title: 'Components/DialogPrompt',
  component: DialogPrompt,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=840%3A13',
  }),
}

export const Default = () => {
  return (
    <DialogPrompt
      baseId="demo_dialog"
      title="This is a dialog prompt"
      description="Use it to prompt a Yes/No question and respond to the action. DialogPrompt is also a good example of ModalBase usage."
      ariaLabel="Use aria-label to explain what this is doing"
      disclosureElement={<Button variant="primary">Open dialog</Button>}
      onConfirm={() => console.log('Confirmed')}
      onCancel={() => console.log('Cancelled')}
      buttonTextConfirm="Confirm"
      buttonTextCancel="Cancel"
    />
  )
}

export const NoButtons = () => {
  return (
    <DialogPrompt
      baseId="demo_dialog"
      title="With no buttons this acts as an alert"
      description="It's probably a good idea to include at least one button."
      ariaLabel="Use aria-label to explain what this is doing"
      disclosureElement={<Button variant="primary">Open dialog</Button>}
    />
  )
}

export const SingleButton = () => {
  return (
    <DialogPrompt
      baseId="demo_dialog"
      title="Single button"
      description="It's good practice to include at least a single button for the user to acknowledge the message."
      ariaLabel="Use aria-label to explain what this is doing"
      disclosureElement={<Button variant="primary">Open dialog</Button>}
      buttonTextConfirm="Okay"
      onConfirm={() => console.log('Okay')}
    />
  )
}
