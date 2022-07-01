import {
  buildDividerField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const WaitingForParentBConfirmation: Form = buildForm({
  id: 'PassportApplicationWaitingForParentB',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildMultiField({
      id: 'waitingForConfirmation',
      title: m.waitingForConfirmationTitle,
      description: m.waitingForConfirmationDescription,
      children: [buildDividerField({ title: ' ' })],
    }),
  ],
})
