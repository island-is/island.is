import {
  buildDividerField,
  buildForm,
  buildMultiField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const WaitingForParentBConfirmation: Form = buildForm({
  id: 'PassportApplicationWaitingForParentB',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildMultiField({
      id: 'guardian2',
      title: 'Hello Hello Parent A',
      description: 'Þú ert að bíða eftir að ParentB confirmi',
      children: [buildDividerField({ title: ' ' })],
    }),
  ],
})
