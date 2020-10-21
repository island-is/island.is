import React from 'react'
import { Button } from '../Button/Button'

import { DialogPrompt } from './DialogPrompt'

export default {
  title: 'Components/DialogPrompt',
  component: DialogPrompt,
}

export const Default = () => {
  return (
    <DialogPrompt
      baseId="demo_dialog"
      title="This is a dialog prompt"
      description="Use it to prompt a Yes/No question and respond to the action."
      ariaLabel="Use aria-label to explain what this is doing"
      disclosureElement={<Button variant="primary">Open dialog</Button>}
      onConfirm={() => console.log('Confirmed')}
      onClose={() => console.log('Closed DialogPrompt')}
    />
  )
}
