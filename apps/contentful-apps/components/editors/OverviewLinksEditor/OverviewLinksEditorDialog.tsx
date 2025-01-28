import { useState } from 'react'
import { DialogExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  FormControl,
  IconButton,
  Textarea,
  TextInput,
} from '@contentful/f36-components'
import { CloseIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import * as styles from './OverviewLinksEditorDialog.css'

interface CategoryState {
  title: string
  description: string
  href: string
}

interface FormProps<State> {
  initialState: State
  onSubmit: (props: State) => void
}

const CategoryForm = ({ initialState, onSubmit }: FormProps<CategoryState>) => {
  const [state, setState] = useState<CategoryState>(initialState)
  return (
    <FormControl className={styles.formContainer}>
      <div>
        <FormControl.Label>Title</FormControl.Label>
        <TextInput
          value={state.title}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, title: ev.target.value }))
          }}
        />
      </div>

      <div>
        <FormControl.Label>Description</FormControl.Label>
        <Textarea
          value={state.description}
          onChange={(ev) => {
            setState((prevState) => ({
              ...prevState,
              description: ev.target.value,
            }))
          }}
        />
      </div>

      <div>
        <FormControl.Label>URL</FormControl.Label>
        <TextInput
          value={state.href}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, href: ev.target.value }))
          }}
        />
      </div>

      <Button
        variant="primary"
        onClick={() => {
          onSubmit(state)
        }}
      >
        Save changes
      </Button>
    </FormControl>
  )
}

export const OverviewLinksEditorDialog = () => {
  const sdk = useSDK<DialogExtensionSDK>()

  const initialState = (sdk.parameters.invocation as { state?: CategoryState })
    ?.state || {
    title: '',
    description: '',
    href: '',
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close"
          onClick={() => {
            sdk.close(initialState)
          }}
        />
      </div>
      <CategoryForm initialState={initialState} onSubmit={sdk.close} />
    </div>
  )
}
