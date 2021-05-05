import React, { useCallback, useEffect, useState } from 'react'
import { render } from 'react-dom'
import { HelpText, TextInput } from '@contentful/forma-36-react-components'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import slugify from 'slugify'
import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

interface AppProps {
  sdk: FieldExtensionSDK
}

interface ReferenceLink {
  sys: {
    id: string
    linkType: string
    type: string
  }
}

interface SysVersion {
  id: string
  publishedVersion: number
  version: number
  publishedAt: string
}

interface ChildEntry {
  sys: {
    id: string
  }
  fields: {
    parent?: { [locale: string]: ReferenceLink }
  }
}

interface ParentEntry {
  sys: SysVersion
  fields: {
    url?: { [locale: string]: string }
    slug: { [locale: string]: string }
  }
}

function isRecent(sys: SysVersion): boolean {
  // SysChange is fired upon entering contentful.
  // We are only interested in updating if the publishedDate is very recent, signifying
  // that a change has occurred.
  // Therefore we set a grace period. We do not update if
  // publishedChanges are older than `grace`
  const grace = 60 * 1000
  const now = new Date(Date.now()).getTime()
  const then = new Date(Date.parse(sys.publishedAt)).getTime()

  return now - then <= grace
}

function isPublished(sys: SysVersion): boolean {
  return !!sys.publishedVersion && sys.version === sys.publishedVersion + 1
}

// Keep the last part of `slug`
// Replace existing prefix with `prefix`
function subSlug(prefix: string, slug: string): string {
  const slugEnd = slug.split('/').pop()
  return `${prefix}/${slugEnd}`
}

async function throttle(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

export const App = ({ sdk }: AppProps) => {
  const locale = sdk.field.locale
  const entryTitle = (sdk.entry.fields.title.getValue() as string) || ''
  const [slug, setSlug] = useState<string>(
    sdk.field.getValue() || slugify(entryTitle.toLowerCase()),
  )
  const [slugPrefix, setSlugPrefix] = useState<string>('')
  const [oldSlugPrefix, setOldSlugPrefix] = useState<string>('')
  const maxDepth = 4
  const hasNestedError = slug.split('/').length - 1 >= maxDepth

  // Monitor parent field changes
  const handleParentChange = useCallback(
    (parentRef: ReferenceLink) => {
      if (parentRef) {
        sdk.space
          .getEntry<ParentEntry>(parentRef.sys.id)
          .then((parentEntry) => {
            setOldSlugPrefix(slugPrefix) // so we can remove slug prefix from slug later
            const parentSlug = parentEntry.fields.url || parentEntry.fields.slug
            setSlugPrefix(`${parentSlug[locale]}/`)
          })
      } else {
        setSlugPrefix('')
      }
    },
    [slugPrefix],
  )

  // Always fires upon loading the contentful content
  // Fires on subsequent changes to the content
  const handleSysChange = async (ref: any) => {
    if (isPublished(ref) && isRecent(ref)) {
      thinkAboutTheChildrent(sdk.entry.getSys().id)
    }
  }

  const getEntrySlug = (entry: any, locale: string) => {
    if (entry.fields.url && entry.fields.url[locale]) {
      return entry.fields.url[locale]
    }

    if (entry.fields.slug && entry.fields.slug[locale]) {
      return entry.fields.slug[locale]
    }

    return undefined
  }

  useEffect(() => {
    const parentField = sdk.entry.fields.parent
    let clearHandler
    if (parentField) {
      clearHandler = parentField.onValueChanged(handleParentChange)
    }

    if (slugPrefix === '') {
      // remove old prefix from slug
      updateValue(slug.replace(oldSlugPrefix, ''))
    } else {
      // update prefix in slug
      updateValue(getDisplayedSlug())
    }

    return clearHandler
  }, [slugPrefix])

  // Register the handler once
  useEffect(() => {
    sdk.entry.onSysChanged(handleSysChange)
  }, [])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk])

  const getDisplayedSlug = () => slug.replace(slugPrefix, '')
  const updateValue = (value: string) => {
    const newSlug = `${slugPrefix}${value}`
    setSlug(newSlug)
    sdk.field.setValue(newSlug)
  }

  sdk.field.setInvalid(hasNestedError)

  const thinkAboutTheChildrent = async (entryId: string, parentId = '') => {
    // Avoid race conditions. Topcall can only come from one locale
    if (locale !== 'is-IS') {
      return
    }
    if (parentId === '') {
      sdk.notifier.success('PLEASE STAY ON THIS PAGE WHILE WE UPDATE CHILDREN')
    }

    // First call into this recursive function does not set parentId
    // That is, the callee does not need to update its own fields
    if (parentId !== '') {
      const theParent = await sdk.space.getEntry<ParentEntry>(parentId)
      await throttle(100)
      const theEntry = await sdk.space.getEntry<ParentEntry>(entryId)
      await throttle(100)
      const wasPublished = isPublished(theEntry.sys)

      // Modify all locales
      for (const availableLocale of sdk.locales.available) {
        if (getEntrySlug(theParent, availableLocale)) {
          if (getEntrySlug(theEntry, availableLocale)) {
            const newSlug = subSlug(
              getEntrySlug(theParent, availableLocale),
              getEntrySlug(theEntry, availableLocale),
            )
            if (theEntry.fields.url) {
              theEntry.fields.url[availableLocale] = newSlug
            } else if (theEntry.fields.slug) {
              theEntry.fields.slug[availableLocale] = newSlug
            }
          }
        }
      }

      // Update the entry
      await sdk.notifier.success(
        `Updating ${theEntry.fields.title[sdk.locales.available[0]]}`,
      )
      await sdk.space.updateEntry(theEntry)
      await throttle(100)
      if (wasPublished) {
        // reconcile new version numbers
        theEntry.sys.publishedVersion += 1
        theEntry.sys.version += 1
        await sdk.space.publishEntry(theEntry)
        await sdk.notifier.success(
          `${theEntry.fields.title[sdk.locales.available[0]]} updated`,
        )
        await throttle(100)
      }
    }

    // sdk.space.getEntries pagination
    const limit = 50
    let skip = 0

    while (true) {
      // scary, I know
      // get all entries where current entry is the parent
      const theChildren = await sdk.space.getEntries<ChildEntry>({
        links_to_entry: entryId,
        limit,
        skip,
      })
      const { total } = theChildren

      for (const child of theChildren.items) {
        // must have a parent field and
        // the parent field must be the link to the current entry
        // The parent isn't localized which results in the default
        // locale being assigned to it
        if (
          child.fields.parent &&
          child.fields.parent['is-IS'] &&
          child.fields.parent['is-IS'].sys.id === entryId
        ) {
          await thinkAboutTheChildrent(child.sys.id, entryId)
        }
      }

      // If fully processed, exit the while loop
      if (total <= limit * (skip + 1)) {
        break
      }
      skip += limit
    }
    if (parentId === '') {
      sdk.notifier.success('All children updated!')
    }
    return true
  }

  return (
    <>
      <TextInput
        type="text"
        id="slug-field"
        value={getDisplayedSlug()}
        error={hasNestedError}
        onChange={({
          currentTarget: { value },
        }: React.ChangeEvent<HTMLInputElement>) => updateValue(value)}
      />
      <HelpText>
        <strong>{slugPrefix}</strong>
        {getDisplayedSlug()}
      </HelpText>
    </>
  )
}

init((sdk) => {
  render(
    <App sdk={sdk as FieldExtensionSDK} />,
    document.getElementById('root'),
  )
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

// TODO: Add react query to this project
// TODO: Take in the following params maxDepth
// TODO: Make submit fail if has validation error
// TODO: Make sure we hardcode the parent and slug field names
//       currently -> top level has `slug`, lower levels have `url`
