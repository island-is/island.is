import React from 'react'
import { render } from 'react-dom'
import TextField from '@contentful/forma-36-react-components/dist/components/TextField'
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
  spaceLocales: Record<string, string>
  activeLocales: { id: string; name: string }[]
}

class App extends React.Component<AppProps, AppState> {
  localeSettingsDetachHandler: Function | null = null

  constructor(props: AppProps) {
    super(props)

    const { locales } = props.extension
    const spaceLocales = locales.names

    this.state = {
      spaceLocales,
      activeLocales: locales.available.map((locale) => ({
        id: locale,
        name: spaceLocales[locale],
      })),
    }
  }

  componentDidMount() {
    this.localeSettingsDetachHandler = this.props.extension.editor.onLocaleSettingsChanged(
      this.onLocaleSettingsHandler,
    )
  }

  onLocaleSettingsHandler = (data: EditorLocaleSettings) => {
    const { spaceLocales } = this.state

    if (data?.mode === 'multi' && data.active) {
      this.setState({
        activeLocales: data.active.map((locale) => ({
          id: locale,
          name: spaceLocales[locale],
        })),
      })
    }
  }

  onChange = (locale: string, key: string, value: string | Document) => {
    const { strings } = this.props.extension.entry.fields
    const currentJson = strings.getValue(locale)

    const newJson = {
      ...currentJson,
      [key]: value,
    }

    strings.setValue(newJson, locale)
  }

  render() {
    const { strings, defaults } = this.props.extension.entry.fields
    const { activeLocales } = this.state
    const values = defaults.getValue()

    return Object.keys(values).map((item, i) => (
      <Table
        key={`${item}-${i}`}
        style={{ marginBottom: '20px', border: '1px solid #e5ebed' }}
      >
        <TableHead>
          <TableRow>
            <TableCell width="50%" style={{ backgroundColor: '#e5ebed' }}>
              Key: {item}
            </TableCell>

            <TableCell style={{ backgroundColor: '#e5ebed' }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {values[item].deprecated && (
            <TableRow>
              <TableCell
                colSpan={2}
                style={{
                  verticalAlign: 'middle',
                  backgroundColor: '#ffd3d9',
                  color: '#bf3045',
                }}
              >
                This translation has been removed from the latest version of the
                application.
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell
              width="50%"
              style={{
                fontWeight: 600,
                verticalAlign: 'middle',
                backgroundColor: '#f7f9fa',
              }}
            >
              Default message
            </TableCell>

            <TableCell
              style={{
                fontWeight: 600,
                verticalAlign: 'middle',
                backgroundColor: '#f7f9fa',
              }}
            >
              {values[item].defaultMessage}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              width="50%"
              style={{ verticalAlign: 'middle', backgroundColor: '#f7f9fa' }}
            >
              Description
            </TableCell>

            <TableCell
              style={{ verticalAlign: 'middle', backgroundColor: '#f7f9fa' }}
            >
              {values[item].description}
            </TableCell>
          </TableRow>

          {activeLocales
            .sort((a, b) => (a.id === 'is-IS' ? -1 : b.id === 'is-IS' ? 1 : 0))
            .map((locale, ii) => {
              const value = strings.getForLocale(locale.id).getValue()?.[item]

              return (
                <TableRow key={`${item}-${ii}`}>
                  <TableCell width="50%" style={{ verticalAlign: 'middle' }}>
                    {locale.name}
                  </TableCell>

                  <TableCell
                    className="table-cell"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <TextField
                      id={`${item}-${value}`}
                      name=""
                      labelText=""
                      value={value}
                      validationMessage={
                        !value ? 'Translation missing' : undefined
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        this.onChange(locale.id, item, e.currentTarget.value)
                      }
                    />
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
 * Which is the id of the namespace. e.g. `application.system`
 *
 * Defaults:
 * Which contains the `defaultMessage`, `description` and `deprecated` boolean.
 * We use the local values extracted from formatjs to populate these fields.
 *
 * Strings:
 * Which is used to store the translations for each locales.
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
