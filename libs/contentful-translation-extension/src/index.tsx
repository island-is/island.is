import React from 'react'
import { render } from 'react-dom'
import TextField from '@contentful/forma-36-react-components/dist/components/TextField'
import HelpText from '@contentful/forma-36-react-components/dist/components/HelpText'
import TableCell from '@contentful/forma-36-react-components/dist/components/Table/TableCell'
import TableHead from '@contentful/forma-36-react-components/dist/components/Table/TableHead'
import Table from '@contentful/forma-36-react-components/dist/components/Table/Table'
import TableRow from '@contentful/forma-36-react-components/dist/components/Table/TableRow'
import TableBody from '@contentful/forma-36-react-components/dist/components/Table/TableBody'
import {
  init,
  FieldExtensionSDK,
  EditorLocaleSettings,
} from 'contentful-ui-extensions-sdk'

import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

interface AppProps {
  extension: FieldExtensionSDK
}

interface AppState {
  activeLocales: string[]
}

interface DictArray {
  id: string
  defaultMessage: string
  'is-IS': string
  en: string
}

class App extends React.Component<AppProps, AppState> {
  localeSettingsDetachHandler: Function | null = null

  constructor(props: AppProps) {
    super(props)

    this.state = {
      activeLocales: props.extension.locales.available,
    }
  }

  componentDidMount() {
    this.localeSettingsDetachHandler = this.props.extension.editor.onLocaleSettingsChanged(
      this.onLocaleSettingsHandler,
    )
  }

  onLocaleSettingsHandler = (data: EditorLocaleSettings) => {
    if (data?.mode === 'multi' && data.active) {
      this.setState({ activeLocales: data.active })
    }
  }

  onChange = (locale: string, key: string, value: string | Document) => {
    const { strings } = this.props.extension.entry.fields
    const values = strings.getValue()
    const translations: DictArray[] = values

    const newJson = translations.map((item) => {
      if (item.id === key) {
        return {
          ...item,
          [locale]: value,
        }
      }

      return item
    })

    strings.setValue(newJson, 'is-IS')
  }

  render() {
    const { strings } = this.props.extension.entry.fields
    const { activeLocales } = this.state
    const values: DictArray[] = strings.getValue()

    return values.map((item) => (
      <Table key={item.id} style={{ marginBottom: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell width="50%" style={{ backgroundColor: '#e5ebed' }}>
              Key: {item.id}
            </TableCell>

            <TableCell style={{ backgroundColor: '#e5ebed' }} />
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell
              width="50%"
              style={{ verticalAlign: 'middle', backgroundColor: '#f7f9fa' }}
            >
              Default message
            </TableCell>

            <TableCell
              style={{ verticalAlign: 'middle', backgroundColor: '#f7f9fa' }}
            >
              {item.defaultMessage}
            </TableCell>
          </TableRow>

          {activeLocales
            .sort((a, b) => b.localeCompare(a))
            .map((locale, ii) => {
              const value = (item as any)?.[locale]

              return (
                <TableRow key={`${item.id}-${ii}`}>
                  <TableCell width="50%" style={{ verticalAlign: 'middle' }}>
                    {locale === 'is-IS' ? 'Icelandic' : 'English'}
                  </TableCell>

                  <TableCell
                    className="table-cell"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <TextField
                      id={value}
                      name=""
                      labelText=""
                      value={value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        this.onChange(locale, item.id, e.currentTarget.value)
                      }
                    />

                    {!value && (
                      <HelpText style={{ color: '#ff0050' }}>
                        Translation missing!
                      </HelpText>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    ))
  }
}

/**
 * The content model has two fields:
 *
 * Namespace:
 * Which is the id of the content
 *
 * Strings:
 * Which is used to store the translations for each locales.
 * However "Enable localization of this field" is disabled.
 * We instead create another object inside the default locale
 * from the space ("is-IS") and we create objects for each locales inside.
 * This is a bit hacky but by enabling localization for the field inside Contentful,
 * creates the following extension for both locales (or more in the future)
 * which mean duplicating the same fields over and over. Not nice neither.
 */
init((extension: FieldExtensionSDK) => {
  extension.window.startAutoResizer()

  render(<App extension={extension} />, document.getElementById('root'))
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */

// if (module.hot) {
//   module.hot.accept()
// }
