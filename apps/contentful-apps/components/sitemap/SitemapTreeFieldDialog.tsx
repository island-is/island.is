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

import { TreeNode, TreeNodeType } from './utils'
import * as styles from './SitemapTreeFieldDialog.css'

interface CategoryState {
  label: string
  slug: string
  description: string
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
        <FormControl.Label>Label</FormControl.Label>
        <TextInput
          value={state.label}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, label: ev.target.value }))
          }}
        />
      </div>
      <div>
        <FormControl.Label>Slug</FormControl.Label>
        <TextInput
          value={state.slug}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, slug: ev.target.value }))
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

interface UrlState {
  label: string
  url: string
}

const UrlForm = ({ initialState, onSubmit }: FormProps<UrlState>) => {
  const [state, setState] = useState<UrlState>(initialState)
  return (
    <FormControl className={styles.formContainer}>
      <div>
        <FormControl.Label>Label</FormControl.Label>
        <TextInput
          value={state.label}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, label: ev.target.value }))
          }}
        />
      </div>
      <div>
        <FormControl.Label>URL</FormControl.Label>
        <TextInput
          value={state.url}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, url: ev.target.value }))
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

export const SitemapTreeFieldDialog = () => {
  const sdk = useSDK<DialogExtensionSDK>()

  const node = (sdk.parameters.invocation as { node: TreeNode }).node

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close"
          onClick={() => {
            sdk.close(node)
          }}
        />
      </div>
      {node.type === TreeNodeType.CATEGORY && (
        <CategoryForm initialState={node} onSubmit={sdk.close} />
      )}
      {node.type === TreeNodeType.URL && (
        <UrlForm initialState={node} onSubmit={sdk.close} />
      )}
    </div>
  )
}
