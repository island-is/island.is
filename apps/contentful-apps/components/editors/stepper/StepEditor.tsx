import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import { Box } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { mapLocalesToFieldApis } from '../utils'

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

export const StepEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  const localeToFieldMapping = useMemo(() => {
    return createLocaleToFieldMapping(sdk)
  }, [sdk])

  const [config, setConfig] = useState<StepConfig>(
    sdk.entry.fields.config.getValue(),
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

      {config?.options?.map((option) => (
        <div key={option?.optionSlug}>
          Here will be an entrycard showing what happens if user answers this
          question
        </div>
      ))}
    </Box>
  )
}
