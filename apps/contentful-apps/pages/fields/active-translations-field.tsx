import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Checkbox } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const localeMap = {
  en: 'English',
}

const ActiveTranslationsField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [state, setState] = useState(sdk.field.getValue())

  useEffect(() => {
    setState(sdk.field.getValue())
  }, [sdk])

  return (
    <div>
      {Object.keys(sdk.locales.names)
        .filter((locale) => locale !== sdk.locales.default)
        .map((locale) => {
          const isChecked = state?.[locale] ?? true
          return (
            <Checkbox
              key={locale}
              name={locale}
              id={locale}
              isChecked={isChecked}
              onChange={() => {
                const newState = { ...state, [locale]: !isChecked }
                setState(newState)
                sdk.field.setValue(newState)
              }}
            >
              {locale in localeMap
                ? localeMap[locale as keyof typeof localeMap]
                : locale}
            </Checkbox>
          )
        })}
    </div>
  )
}

export default ActiveTranslationsField
