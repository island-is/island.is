import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Navigation, OptionsTopBarTitle } from 'react-native-navigation'
import { en } from '../messages/en';
import { is } from '../messages/is';
import { TranslatedMessage } from '../messages/index'
import { preferencesStore } from '../stores/preferences-store'

interface CreateNavigationFn {
  useNavigationTitle(componentId: string): void
  title: OptionsTopBarTitle
}

export function createNavigationTitle(
  titleMsg: TranslatedMessage,
): CreateNavigationFn {
  const { locale } = preferencesStore.getState()
  const messages = locale === 'is-IS' ? is : en
  const initialTitle = messages[titleMsg]

  const title: OptionsTopBarTitle = {
    text: initialTitle,
    alignment: 'fill',
  }

  const sub = preferencesStore.subscribe(
    (newLocale) => {
      const messages = newLocale === 'is-IS' ? is : en
      title.text = messages[titleMsg]
      sub()
    },
    (s) => s.locale,
  )

  return {
    useNavigationTitle(componentId: string) {
      const intl = useIntl()
      useEffect(() => {
        const translatedTitle = intl.formatMessage({ id: titleMsg })
        if (componentId) {
          Navigation.mergeOptions(componentId, {
            topBar: {
              title: {
                text: translatedTitle,
              },
            },
          })
        }
      }, [intl])
    },
    title,
  }
}
