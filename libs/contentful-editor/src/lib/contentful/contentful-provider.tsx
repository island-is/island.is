import React, {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ContentfulLocale,
  Editor,
  InternalEntry,
  useContentfulClient,
} from '@island.is/contentful-editor'

interface ContentfulProviderProps {
  config: {
    slug: string
    contentType: string
    locale: ContentfulLocale
  }
}

// Should come from contentful's oauth application result
export const accessToken = ''

export const ContentfulContext = createContext<{
  loggedIn: boolean
  loading: boolean
  saving: boolean
  entry?: InternalEntry
  save(): Promise<boolean | undefined>
  onChange(field: string, value: string): void
}>({
  loggedIn: false,
  loading: true,
  saving: false,
  entry: undefined,
  save: async () => undefined,
  onChange: () => {},
})

/**
 * Log in to an endpoint somewhere else first through oauth contentful application.
 * Get management token there (not working from what I tested so far)
 */
export const ContentfulProvider: FC<ContentfulProviderProps> = ({
  children,
  config: { slug, contentType, locale },
}) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const { loading, saving, init, saveEntry } = useContentfulClient({ locale })
  const dataRef = useRef<InternalEntry[] | null>(null)
  const validEntry = !loading && slug && contentType && dataRef.current
  const entry = useMemo(
    () =>
      validEntry
        ? (dataRef.current ?? []).find(
            (item) => item._slug === slug && item._contentType === contentType,
          )
        : undefined,
    [validEntry],
  )
  const [fields, setFields] = useState<Record<string, any> | undefined>(
    undefined,
  )

  const handleChange = (field: string, value: string) => {
    setFields((prev) => {
      if (!prev) {
        return
      }

      return {
        ...prev,
        [field]: {
          ...prev[field],
          [locale]: value,
        },
      }
    })
  }

  const handleSave = async () => {
    if (!entry || !fields) {
      return
    }

    return await saveEntry(entry._id, fields)
  }

  useEffect(() => {
    if (validEntry) {
      setFields(entry?._entry.fields)
    }
  }, [loading, dataRef.current])

  useEffect(() => {
    async function run() {
      try {
        dataRef.current = await init()
        setLoggedIn(true)
      } catch (e) {
        console.error(`Error when trying to initialize the editor ${e.message}`)
      }
    }

    run()
  }, [])

  if (!loggedIn) {
    return children as ReactElement
  }

  return (
    <ContentfulContext.Provider
      value={{
        loggedIn,
        loading,
        saving,
        entry,
        save: handleSave,
        onChange: handleChange,
      }}
    >
      <Editor>{children}</Editor>
    </ContentfulContext.Provider>
  )
}
