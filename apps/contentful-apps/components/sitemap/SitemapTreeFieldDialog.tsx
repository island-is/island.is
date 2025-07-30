import { useState } from 'react'
import { DialogExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@contentful/f36-components'
import { CloseIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import { SitemapUrlType } from '@island.is/shared/types'

import { slugify } from '../../utils'
import { TreeNode, TreeNodeType } from './utils'
import * as styles from './SitemapTreeFieldDialog.css'

interface CategoryState {
  label: string
  labelEN?: string
  slug: string
  slugEN?: string
  description: string
  descriptionEN?: string
}

interface FormProps<State> {
  initialState: State
  onSubmit: (props: State) => void
}

const CategoryForm = ({
  initialState,
  onSubmit,
  formError,
}: FormProps<CategoryState> & {
  formError: { slug: string; slugEN: string }
}) => {
  const [state, setState] = useState<CategoryState>(initialState)
  return (
    <FormControl className={styles.formContainer}>
      <div>
        <FormControl.Label>Title (Icelandic)</FormControl.Label>
        <TextInput
          value={state.label}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, label: ev.target.value }))
          }}
        />
      </div>
      <div>
        <FormControl.Label>Title (English)</FormControl.Label>
        <div>
          <TextInput
            value={state.labelEN}
            onChange={(ev) => {
              setState((prevState) => ({
                ...prevState,
                labelEN: ev.target.value,
              }))
            }}
          />
        </div>
      </div>
      <div>
        <FormControl.Label>Slug (Icelandic)</FormControl.Label>
        <TextInput
          placeholder={slugify(state.label)}
          value={state.slug}
          onChange={(ev) => {
            setState((prevState) => ({ ...prevState, slug: ev.target.value }))
          }}
        />
        {formError.slug && <Text fontColor="red600">{formError.slug}</Text>}
      </div>
      <div>
        <FormControl.Label>Slug (English)</FormControl.Label>

        <div>
          <TextInput
            placeholder={slugify(state.labelEN)}
            value={state.slugEN}
            onChange={(ev) => {
              setState((prevState) => ({
                ...prevState,
                slugEN: ev.target.value,
              }))
            }}
          />
          {formError.slugEN && (
            <Text fontColor="red600">{formError.slugEN}</Text>
          )}
        </div>
      </div>
      <div>
        <FormControl.Label>Description (Icelandic)</FormControl.Label>
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
        <FormControl.Label>Description (English)</FormControl.Label>
        <div>
          <Textarea
            value={state.descriptionEN}
            onChange={(ev) => {
              setState((prevState) => ({
                ...prevState,
                descriptionEN: ev.target.value,
              }))
            }}
          />
        </div>
      </div>
      <Button
        variant="primary"
        onClick={() => {
          const stateToSubmit = { ...state }
          if (!stateToSubmit.slug) {
            stateToSubmit.slug = slugify(stateToSubmit.label)
          }
          if (!stateToSubmit.slugEN) {
            stateToSubmit.slugEN = slugify(stateToSubmit.labelEN)
          }
          onSubmit(stateToSubmit)
        }}
      >
        Save changes
      </Button>
    </FormControl>
  )
}

interface UrlState {
  label: string
  labelEN?: string
  url: string
  urlEN?: string
  urlType?: SitemapUrlType
}

const UrlForm = ({ initialState, onSubmit }: FormProps<UrlState>) => {
  const [state, setState] = useState<UrlState>(initialState)

  return (
    <FormControl className={styles.formContainer}>
      <div>
        <Box paddingBottom="spacingXs">
          <FormControl.Label>Title (Icelandic)</FormControl.Label>
          <TextInput
            value={state.label}
            onChange={(ev) => {
              setState((prevState) => ({
                ...prevState,
                label: ev.target.value,
              }))
            }}
          />
        </Box>
        <div>
          <FormControl.Label>Title (English)</FormControl.Label>
          <TextInput
            value={state.labelEN}
            onChange={(ev) => {
              setState((prevState) => ({
                ...prevState,
                labelEN: ev.target.value,
              }))
            }}
          />
        </div>
      </div>
      <div>
        <FormControl.Label>Type</FormControl.Label>
        <Select
          value={state.urlType}
          onChange={(ev) => {
            setState((prevState) => ({
              ...prevState,
              urlType: ev.target.value as typeof state.urlType,
            }))
          }}
        >
          <Select.Option value="organizationFrontpage">
            Organization frontpage
          </Select.Option>
          <Select.Option value="organizationNewsOverview">
            Organization news overview
          </Select.Option>
          <Select.Option value="organizationPublishedMaterial">
            Organization published material
          </Select.Option>
          <Select.Option value="organizationEventOverview">
            Organization event overview
          </Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
        </Select>
      </div>

      {state.urlType === 'custom' && (
        <div>
          <Box paddingBottom="spacingXs">
            <div>
              <FormControl.Label>URL (Icelandic)</FormControl.Label>
              <TextInput
                value={state.url}
                onChange={(ev) => {
                  setState((prevState) => ({
                    ...prevState,
                    url: ev.target.value,
                  }))
                }}
              />
            </div>
          </Box>

          <div>
            <FormControl.Label>URL (English)</FormControl.Label>
            <TextInput
              value={state.urlEN}
              onChange={(ev) => {
                setState((prevState) => ({
                  ...prevState,
                  urlEN: ev.target.value,
                }))
              }}
            />
          </div>
        </div>
      )}

      <Button
        variant="primary"
        onClick={() => {
          onSubmit({
            ...state,
            urlType: state.urlType || 'organizationFrontpage',
          })
        }}
      >
        Save changes
      </Button>
    </FormControl>
  )
}

export const SitemapTreeFieldDialog = () => {
  const sdk = useSDK<DialogExtensionSDK>()

  const { node, otherCategorySlugs, otherCategorySlugsEN } = sdk.parameters
    .invocation as {
    node: TreeNode
    otherCategorySlugs?: string[]
    otherCategorySlugsEN?: string[]
  }

  const [categoryFormError, setCategoryFormError] = useState({
    slug: '',
    slugEN: '',
  })

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
        <CategoryForm
          formError={categoryFormError}
          initialState={node}
          onSubmit={(state) => {
            const error = { slug: '', slugEN: '' }
            if (otherCategorySlugs?.includes(state.slug)) {
              error.slug = 'Slug already exists'
            }
            if (otherCategorySlugsEN?.includes(state.slugEN)) {
              error.slugEN = 'Slug already exists'
            }

            if (error.slug || error.slugEN) {
              setCategoryFormError(error)
              return
            }

            sdk.close(state)
          }}
        />
      )}
      {node.type === TreeNodeType.URL && (
        <UrlForm initialState={node} onSubmit={sdk.close} />
      )}
    </div>
  )
}
