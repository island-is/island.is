import { useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import dynamic from 'next/dynamic'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  FormControl,
  Menu,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import {
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  ChevronDownIcon,
  DeleteIcon,
  PlusIcon,
} from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { mapLocalesToFieldApis } from '../utils'
import { EntryListSearch } from '../../EntryListSearch'

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
    title: mapLocalesToFieldApis([sdk.locales.default], sdk, 'title'),
    slug: mapLocalesToFieldApis([sdk.locales.default], sdk, 'slug'),
    stepType: mapLocalesToFieldApis([sdk.locales.default], sdk, 'stepType'),
    subtitle: mapLocalesToFieldApis(sdk.locales.available, sdk, 'subtitle'),
    config: mapLocalesToFieldApis([sdk.locales.default], sdk, 'config'),
  }
}

interface StepOptionCMS {
  labelIS: string
  labelEN: string
  transition: string
  optionSlug: string
}

interface StepOptionsFromSourceTransitionCMS {
  criteria: Record<string, string | boolean | number>
  criteriaExclude?: Record<string, string | boolean | number>
  priority?: number
  transition: string
}

interface StepOptionsFromSourceCMS {
  sourceNamespace: string
  labelFieldIS: string
  labelFieldEN: string
  optionSlugField: string
  transitions: StepOptionsFromSourceTransitionCMS[]
}

interface StepConfig {
  options: StepOptionCMS[]
  optionsFromSource?: StepOptionsFromSourceCMS
}

interface StepOption {
  label: string
  transition: string
  value: string
}

interface StateMeta {
  stepSlug: string
}

const generateOptionSlug = (options: StepOptionCMS[]) => {
  let highestId = 0
  for (const option of options) {
    if (
      Boolean(option?.optionSlug) &&
      !Number.isNaN(Number(option.optionSlug))
    ) {
      highestId = Number(option.optionSlug)
    }
  }
  return String(highestId + 1)
}

const Heading = ({ text, locale }: { text: string; locale?: string }) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexFlow: 'row nowrap',
        gap: '6px',
      }}
    >
      <FormControl.Label>{text}</FormControl.Label>
      {locale && (
        <Box
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            gap: '6px',
          }}
        >
          <Text fontColor="gray500">|</Text>
          <Text fontColor="gray500">{locale}</Text>
        </Box>
      )}
    </Box>
  )
}

export const StepEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  const cma = useCMA()
  const localeToFieldMapping = useMemo(() => {
    return createLocaleToFieldMapping(sdk)
  }, [sdk])

  const [config, setConfig] = useState<StepConfig>(
    sdk.entry.fields.config.getValue(),
  )
  const [isStepSelectModalOpen, setIsStepSelectModalOpen] = useState(false)

  useDebounce(
    () => {
      sdk.entry.fields.config.setValue(config)
    },
    100,
    [config],
  )

  return (
    <Box
      paddingLeft="spacingS"
      paddingRight="spacingS"
      paddingTop="spacingL"
      paddingBottom="spacingL"
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: '24px',
        margin: '0 auto',
        maxWidth: '768px',
      }}
    >
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
            {/* <Modal.Content>
              <EntryListSearch
                contentTypeId="step"
                contentTypeLabel="Step"
                contentTypeTitleField="title"
                query={{
                  'sys.id[in]': sdk.entry.fields.steps
                    .getValue()
                    .filter((step) => step.stepType === 'answer')
                    .map((step) => step.sys.id)
                    .join(','),
                }}
                onEntryClick={(entry) => {
                  // TODO
                  setIsStepSelectModalOpen(false)
                }}
              />
            </Modal.Content> */}
          </>
        )}
      </Modal>
      <ContentfulField
        fieldID="title"
        displayName="Title"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />
      <ContentfulField
        fieldID="slug"
        displayName="Slug"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />
      <ContentfulField
        fieldID="stepType"
        displayName="Step Type"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        widgetId="radio"
      />
      <ContentfulField
        fieldID="subtitle"
        displayName="Content"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />

      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          gap: '48px',
        }}
      >
        {config?.options?.map((option, index) => (
          <Box
            key={index}
            style={{
              padding: '16px',
              border: '1px solid #cfd9e0',
              borderRadius: '4px',
              display: 'flex',
              flexFlow: 'column nowrap',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexFlow: 'row nowrap',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                  gap: '8px',
                  paddingBottom: '16px',
                }}
              >
                <Button
                  style={{
                    visibility: index > 0 ? 'visible' : 'hidden',
                  }}
                  aria-label="Move up"
                  startIcon={<ArrowUpwardIcon />}
                  onClick={() => {
                    setConfig((prevConfig) => {
                      const updatedOptions = [...prevConfig.options]

                      // Swap places with what is above
                      const temp = updatedOptions[index - 1]
                      updatedOptions[index - 1] = updatedOptions[index]
                      updatedOptions[index] = temp

                      return {
                        ...prevConfig,
                        options: updatedOptions,
                      }
                    })
                  }}
                >
                  Move up
                </Button>

                <Button
                  style={{
                    visibility:
                      index < config.options.length - 1 ? 'visible' : 'hidden',
                  }}
                  aria-label="Move down"
                  startIcon={<ArrowDownwardIcon />}
                  onClick={() => {
                    setConfig((prevConfig) => {
                      const updatedOptions = [...prevConfig.options]

                      // Swap places with what is below
                      const temp = updatedOptions[index + 1]
                      updatedOptions[index + 1] = updatedOptions[index]
                      updatedOptions[index] = temp

                      return {
                        ...prevConfig,
                        options: updatedOptions,
                      }
                    })
                  }}
                >
                  Move down
                </Button>
              </div>
              <Button
                onClick={async () => {
                  const shouldRemove = await sdk.dialogs.openConfirm({
                    message: `${option.labelIS} option will be removed`,
                    title: 'Are you sure?',
                  })
                  if (!shouldRemove) return
                  setConfig((prevConfig) => ({
                    ...prevConfig,
                    options: prevConfig.options.filter(
                      (_, prevIndex) => prevIndex !== index,
                    ),
                  }))
                }}
                aria-label="Remove"
                startIcon={<DeleteIcon />}
              >
                Remove
              </Button>
            </div>
            <FormControl>
              <Stack
                spacing="spacingL"
                flexDirection="column"
                alignItems="flex-start"
              >
                <div style={{ width: '100%' }}>
                  <Heading text="Label" locale="Icelandic (Iceland)" />
                  <TextInput
                    value={option.labelIS}
                    onChange={(event) => {
                      setConfig((prevConfig) => ({
                        ...prevConfig,
                        options: prevConfig.options.map(
                          (prevOption, prevIndex) => {
                            if (prevIndex !== index) return prevOption
                            return {
                              ...prevOption,
                              labelIS: event.target.value,
                            }
                          },
                        ),
                      }))
                    }}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Heading text="Label" locale="English" />
                  <TextInput
                    value={option.labelEN}
                    onChange={(event) => {
                      setConfig((prevConfig) => ({
                        ...prevConfig,
                        options: prevConfig.options.map(
                          (prevOption, prevIndex) => {
                            if (prevIndex !== index) return prevOption
                            return {
                              ...prevOption,
                              labelEN: event.target.value,
                            }
                          },
                        ),
                      }))
                    }}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Heading text="Slug" />
                  <TextInput
                    value={option.optionSlug}
                    onChange={(event) => {
                      setConfig((prevConfig) => ({
                        ...prevConfig,
                        options: prevConfig.options.map(
                          (prevOption, prevIndex) => {
                            if (prevIndex !== index) return prevOption
                            return {
                              ...prevOption,
                              optionSlug: event.target.value,
                            }
                          },
                        ),
                      }))
                    }}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Heading text="Transition name" />
                  <TextInput
                    value={option.transition}
                    onChange={(event) => {
                      setConfig((prevConfig) => ({
                        ...prevConfig,
                        options: prevConfig.options.map(
                          (prevOption, prevIndex) => {
                            if (prevIndex !== index) return prevOption
                            return {
                              ...prevOption,
                              transition: event.target.value,
                            }
                          },
                        ),
                      }))
                    }}
                  />
                </div>

                <Menu>
                  <Menu.Trigger>
                    <Button
                      startIcon={<PlusIcon />}
                      endIcon={<ChevronDownIcon />}
                    >
                      Next step
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

                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          options: prevConfig.options.map(
                            (prevOption, prevIndex) => {
                              if (prevIndex !== index) return prevOption
                              return {
                                ...prevOption,
                                optionSlug: newStep.sys.id,
                                transition: newStep.sys.id,
                              }
                            },
                          ),
                        }))

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
                      Add existing answer
                    </Menu.Item>
                  </Menu.List>
                </Menu>
              </Stack>
            </FormControl>
          </Box>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            startIcon={<PlusIcon />}
            onClick={() => {
              setConfig((prevConfig) => {
                const optionSlug = generateOptionSlug(config.options)
                return {
                  ...prevConfig,
                  options: (prevConfig?.options ?? []).concat({
                    labelEN: optionSlug,
                    labelIS: optionSlug,
                    optionSlug: optionSlug,
                    transition: optionSlug,
                  }),
                }
              })
            }}
          >
            Add option
          </Button>
        </div>
      </div>
    </Box>
  )
}
