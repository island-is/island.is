import { AsyncSearchInput, Box } from '@island.is/island-ui/core'
import { use, useCallback, useMemo, useRef, useState } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'
import { m } from '@island.is/portals/my-pages/core'

interface ModuleSet {
  title: string
  content?: string
  keywords?: Array<string>
  subSet?: Array<ModuleSet>
}

const data: Array<ModuleSet> = [
  {
    title: 'Pósthólf', //m.documents,
    content: 'Erindi til þín frá opinberum aðilum', //m.documentsDescription,
  },
  {
    title: 'Umsoknir', //m.applications,
    content: 'Staða umsókna sem þú hefur sótt um í gegnum island.is', //m.applicationsDescription,
  },
  {
    title: 'Mínar upplýsingar', //m.userInfo,
    content: 'Gögn um þig og fjölskylduna þína', //m.userInfoDescription,
    subSet: [
      {
        title: 'Maki', //m.familySpouse,
      },
    ],
  },
]

const options: IFuseOptions<ModuleSet> = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  //ignoreLocation: true,
  keys: [
    { name: 'title', weight: 2 },
    //{ name: 'content', weight: 0.5 },
    {
      name: 'title.subset.title',
      weight: 1.5,
    },
  ],
  shouldSort: true,
}

export const SearchInput = () => {
  const fuse = useMemo(() => new Fuse(data, options), [])

  const [hasFocus, setHasFocus] = useState<boolean>(false)

  const ref = useRef<HTMLInputElement>(null)

  const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])
  const onFocus = useCallback(() => {
    setHasFocus(true)
  }, [setHasFocus])

  const search = (query: string) => {
    console.log('searching for ' + query)
    const result = fuse.search(query)

    console.log(result)
  }

  const onSubmit = () => {
    if (ref.current?.value) {
      search(ref.current.value)
    }
  }

  return (
    <AsyncSearchInput
      ref={ref}
      hasFocus={hasFocus}
      //loading={loading}
      //hasError={hasError}
      //errorMessage={errorMessage}
      //rootProps={getRootProps({ refKey: 'ref' }, { suppressRefError: true })}
      inputProps={{
        /*...getInputProps({
          value: inputValue,
          onFocus,
          onBlur,
          ref,
          spellCheck: true,
          ...(onSubmit && { onKeyDown }),
          }),*/
        inputSize: 'medium',
        //isOpen: shouldShowItems,
        //colored,
        //hasLabel,
        placeholder: 'Leita',
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            onSubmit()
          }
        },
        //color: inputColor,
      }}
      buttonProps={{
        onFocus,
        onBlur,
        onClick: (event) => onSubmit(),
      }}
      //label={label}
      //required={required}
      //labelProps={getLabelProps()}
      //menuProps={{
      // ...getMenuProps(),
      // isOpen,
      // shouldShowItems,
      //}}
    />
  )
}
