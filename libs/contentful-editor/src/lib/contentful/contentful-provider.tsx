import React, {
  createContext,
  FC,
  Ref,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ContentfulLocale,
  initializer,
  InternalEntry,
} from '@island.is/contentful-editor'

interface ContentfulProviderProps {
  config: {
    slug: string
    contentType: string
    locale: ContentfulLocale
  }
}

export const ContentfulContext = createContext<{
  loggedIn: boolean
  loading: boolean
  entry?: InternalEntry
}>({
  loggedIn: false,
  loading: true,
  entry: undefined,
})

export const ContentfulProvider: FC<ContentfulProviderProps> = ({
  children,
  config: { slug, contentType, locale },
}) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const dataRef = useRef<InternalEntry[] | null>(null)

  const getEntry = () => {
    console.log('-loading', loading)
    console.log('-slug', slug)
    console.log('-contentType', contentType)
    if (!loading || !slug || !contentType) {
      return undefined
    }

    console.log('-dataRef', dataRef.current)

    return dataRef.current?.find(
      (item) => item.slug === slug && item.contentType === contentType,
    )
  }

  useEffect(() => {
    /**
     * TODO: This should be run once when the user log in
     * to the editor mode along the oauth app.
     */
    async function run() {
      setLoading(true)

      try {
        const data = await initializer({ locale })

        dataRef.current = data
        setLoggedIn(true)
      } catch (e) {
        console.error(`Error when trying to initialize the editor ${e.message}`)
      }

      setLoading(false)
    }

    run()
  }, [])

  return (
    <ContentfulContext.Provider
      value={{
        loggedIn,
        loading,
        entry: getEntry(),
      }}
    >
      {children}
    </ContentfulContext.Provider>
  )
}
