import { useState } from 'react'
import { DialogExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  FormControl,
  IconButton,
  TextInput,
} from '@contentful/f36-components'
import { CloseIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import { TreeNodeType } from './utils'
import * as styles from './SitemapTreeFieldDialog.css'

interface CategoryState {
  label: string
  slug: string
  description: string
}

interface CategoryFormProps {
  initialState: CategoryState
  onSubmit: (props: CategoryState) => void
}

const CategoryForm = ({ initialState, onSubmit }: CategoryFormProps) => {
  const [state, setState] = useState<CategoryState>(initialState)
  return (
    <FormControl className={styles.formContainer}>
      <div>
        <FormControl.Label>Label</FormControl.Label>
        <TextInput
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, label: ev.target.value }))
          }}
        />
      </div>
      <div>
        <FormControl.Label>Slug</FormControl.Label>
        <TextInput
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, slug: ev.target.value }))
          }}
        />
      </div>
      <div>
        <FormControl.Label>Description</FormControl.Label>
        <TextInput
          onChange={(ev) => {
            setState((prevState) => ({
              ...prevState,
              description: ev.target.value,
            }))
          }}
        />
      </div>

      <Button
        onClick={() => {
          onSubmit(state)
        }}
      >
        Submit
      </Button>
    </FormControl>
  )
}

export const SitemapTreeFieldDialog = () => {
  const sdk = useSDK<DialogExtensionSDK>()

  const type = (sdk.parameters.invocation as { type: TreeNodeType })?.type

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close"
          onClick={() => {
            sdk.close()
          }}
        />
      </div>
      {type === TreeNodeType.CATEGORY && (
        <CategoryForm
          initialState={{ label: '', description: '', slug: '' }}
          onSubmit={sdk.close}
        />
      )}
    </div>
  )
}
