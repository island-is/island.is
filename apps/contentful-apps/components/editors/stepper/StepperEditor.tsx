import { useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import dynamic from 'next/dynamic'
import { AnyEventObject, MachineConfig } from 'xstate'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  Modal,
} from '@contentful/f36-components'
import { ChevronDownIcon, DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { EntryListSearch } from '../../EntryListSearch'
import { mapLocalesToFieldApis } from '../utils'
import { JsonEditor } from '@contentful/field-editor-json'

const ContentfulField = dynamic(
  () =>
    // Dynamically import via client side rendering since the @contentful/default-field-editors package accesses the window and navigator global objects
    import('../ContentfulField').then(({ ContentfulField }) => ContentfulField),
  {
    ssr: false,
  },
)

const createLocaleToFieldMapping = (sdk: EditorExtensionSDK) => {
  return {
    title: mapLocalesToFieldApis(sdk.locales.available, sdk, 'title'),
    steps: mapLocalesToFieldApis([sdk.locales.default], sdk, 'steps'),
    config: mapLocalesToFieldApis([sdk.locales.default], sdk, 'config'),
  }
}

interface StepperConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xStateFSM: MachineConfig<any, any, AnyEventObject>
}

export const StepperEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  const cma = useCMA()

  const localeToFieldMapping = useMemo(() => {
    return createLocaleToFieldMapping(sdk)
  }, [sdk])

  const [config, setConfig] = useState<StepperConfig>(
    sdk.entry.fields.config.getValue(),
  )

  const [isStepSelectModalOpen, setIsStepSelectModalOpen] = useState(false)

  const firstStep = useMemo(() => {
    const steps = sdk.entry.fields.steps.getValue()
    console.log(steps)
  }, [sdk.entry.fields.steps])

  useDebounce(
    () => {
      sdk.entry.fields.config.setValue(config)
    },
    100,
    [config],
  )

  const updateConfig = (values: StepperConfig['xStateFSM']) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      xStateFSM: {
        ...prevConfig.xStateFSM,
        ...values,
      },
    }))
  }

  return (
    <Box
      paddingLeft="spacingS"
      paddingRight="spacingS"
      paddingTop="spacingL"
      paddingBottom="spacingL"
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: '16px',
        margin: '0 auto',
        maxWidth: '768px',
      }}
    >
      <ContentfulField
        displayName="Title"
        fieldID="title"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />

      <Modal
        onClose={() => setIsStepSelectModalOpen(false)}
        isShown={isStepSelectModalOpen}
      >
        {() => (
          <>
            <Modal.Header
              title="Add existing content"
              onClose={() => setIsStepSelectModalOpen(false)}
            />
            <Modal.Content>
              <EntryListSearch
                contentTypeId="step"
                contentTypeLabel="Step"
                contentTypeTitleField="title"
                query={{
                  'sys.id[in]': sdk.entry.fields.steps
                    .getValue()
                    .map((step) => step.sys.id)
                    .join(','),
                }}
                onEntryClick={(entry) => {
                  updateConfig({
                    initial: entry.sys.id,
                  })
                  setIsStepSelectModalOpen(false)
                }}
              />
            </Modal.Content>
          </>
        )}
      </Modal>

      {!config.xStateFSM.initial && (
        <Menu>
          <Menu.Trigger>
            <Button startIcon={<PlusIcon />} endIcon={<ChevronDownIcon />}>
              First step
            </Button>
          </Menu.Trigger>
          <Menu.List>
            <Menu.Item
              onClick={async () => {
                const newStep = await cma.entry.create(
                  {
                    contentTypeId: 'step',
                  },
                  {
                    fields: {},
                  },
                )

                sdk.entry.fields.steps.setValue({
                  [sdk.locales.default]: (
                    sdk.entry.fields.steps.getValue() ?? []
                  ).concat({
                    sys: {
                      ...newStep.sys,
                    },
                  }),
                })

                updateConfig({
                  initial: newStep.sys.id,
                })

                sdk.navigator.openEntry(newStep.sys.id, {
                  slideIn: true,
                })
              }}
            >
              Create new step
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setIsStepSelectModalOpen(true)
              }}
            >
              Add existing step
            </Menu.Item>
          </Menu.List>
        </Menu>
      )}

      {config.xStateFSM.initial && (
        <ButtonGroup>
          <Button
            onClick={() => {
              sdk.navigator.openEntry(config.xStateFSM.initial as string, {
                slideIn: true,
              })
            }}
          >
            See first step
          </Button>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Remove first step"
            onClick={() => {
              updateConfig({
                initial: '',
              })
            }}
          >
            Remove first step
          </IconButton>
        </ButtonGroup>
      )}

      <JsonEditor
        field={localeToFieldMapping.config[sdk.locales.default].field}
        isInitiallyDisabled={false}
      />
    </Box>
  )
}
