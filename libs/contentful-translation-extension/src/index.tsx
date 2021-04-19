import './index.css'

import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import TextField from '@contentful/forma-36-react-components/dist/components/TextField'
import TableCell from '@contentful/forma-36-react-components/dist/components/Table/TableCell'
import TableHead from '@contentful/forma-36-react-components/dist/components/Table/TableHead'
import Table from '@contentful/forma-36-react-components/dist/components/Table/Table'
import TableRow from '@contentful/forma-36-react-components/dist/components/Table/TableRow'
import TableBody from '@contentful/forma-36-react-components/dist/components/Table/TableBody'
import Button from '@contentful/forma-36-react-components/dist/components/Button'
import {
  init,
  FieldExtensionSDK,
  EditorLocaleSettings,
} from 'contentful-ui-extensions-sdk'
import Markdown from 'markdown-to-jsx'
import isEmpty from 'lodash/isEmpty'

import { MarkdownEditor } from './components/MarkdownEditor'
import { Label } from './components/Label'
import { unifyAndDeserialize } from './utils/deserialize'
import { serializeAndFormat } from './utils/serialize'

interface AppProps {
  extension: FieldExtensionSDK
}

const App = ({ extension }: AppProps) => {
  const spaceLocales = extension.locales.names
  const [activeLocales, setActiveLocales] = useState(
    extension.locales.available.map((locale) => ({
      id: locale,
      name: spaceLocales[locale],
    })),
  )
  const [open, setOpen] = useState(false)
  const { strings, defaults } = extension.entry.fields
  const values = defaults.getValue()
  const activeMessages = Object.keys(values).filter(
    (item) => !values[item].deprecated,
  )
  const deprecatedMessages = Object.keys(values).filter(
    (item) => values[item].deprecated,
  )

  const handleDeprecatedToggle = () => {
    setOpen(!open)
  }

  const handleLocaleSettingsHandler = (data: EditorLocaleSettings) => {
    if (data?.mode === 'multi' && data.active) {
      setActiveLocales(
        data.active.map((locale) => ({
          id: locale,
          name: spaceLocales[locale],
        })),
      )
    }
  }

  const onChange = (locale: string, key: string, value: string | Document) => {
    const { strings } = extension.entry.fields
    const currentJson = strings.getValue(locale)

    const newJson = {
      ...currentJson,
      [key]: value,
    }

    strings.setValue(newJson, locale)
  }

  const renderTables = (array: string[]) =>
    array.map((item, i) => (
      <Table
        key={`${item}-${i}`}
        style={{
          marginBottom: '20px',
          border: '1px solid #e5ebed',
          borderRadius: 10,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: '#e5ebed' }} colSpan={2}>
              Key: {item}
            </TableCell>
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
              width="30%"
              style={{
                verticalAlign: 'middle',
                backgroundColor: '#f7f9fa',
              }}
              colSpan={2}
            >
              <Label>Default message</Label>

              {values[item].markdown ? (
                <div>
                  <Markdown>{values[item].defaultMessage}</Markdown>
                </div>
              ) : (
                <p>{values[item].defaultMessage}</p>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              width="30%"
              style={{
                verticalAlign: 'middle',
                backgroundColor: '#f7f9fa',
              }}
              colSpan={2}
            >
              <Label>Description</Label>
              <p>{values[item].description}</p>
            </TableCell>
          </TableRow>

          {activeLocales
            .sort((a, b) => (a.id === 'is-IS' ? -1 : b.id === 'is-IS' ? 1 : 0))
            .map((locale, ii) => {
              const value = strings.getForLocale(locale.id).getValue()?.[item]

              if (!value && !isEmpty(value)) {
                return (
                  <TableRow key={`${item}-${ii}`}>
                    <TableCell
                      colSpan={2}
                      style={{
                        verticalAlign: 'middle',
                        backgroundColor: '#ffd3d9',
                        color: '#bf3045',
                      }}
                    >
                      <Label>{locale.name}</Label>

                      <p>
                        An error happened, please report this issue on{' '}
                        <strong>#dev_support</strong> on Slack.
                      </p>
                    </TableCell>
                  </TableRow>
                )
              }

              return (
                <TableRow key={`${item}-${ii}`}>
                  <TableCell style={{ verticalAlign: 'middle' }} colSpan={2}>
                    <Label>{locale.name}</Label>

                    {values[item]?.markdown ? (
                      <>
                        <MarkdownEditor
                          value={unifyAndDeserialize(value)}
                          dialogs={extension.dialogs}
                          onChange={(value) => {
                            // We serialize our array of Node to be a markdown string and we set it as our new value
                            const serialized = serializeAndFormat(value)

                            onChange(locale.id, item, serialized)
                          }}
                        />
                      </>
                    ) : (
                      <TextField
                        id={`${item}-${value}`}
                        name=""
                        labelText=""
                        value={value}
                        validationMessage={
                          !value ? 'Translation missing' : undefined
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange(locale.id, item, e.currentTarget.value)
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    ))

  useEffect(() => {
    const localeChangeListener = extension.editor.onLocaleSettingsChanged(
      handleLocaleSettingsHandler,
    )

    return () => {
      localeChangeListener?.()
    }
  }, [])

  return (
    <>
      {renderTables(activeMessages)}

      <Button
        buttonType="muted"
        size="small"
        icon={open ? 'ArrowUp' : 'ArrowDown'}
        onClick={handleDeprecatedToggle}
      >
        {open ? 'Hide' : 'Show'} all the deprecated messages
      </Button>

      {open && (
        <div style={{ marginTop: 20 }}>{renderTables(deprecatedMessages)}</div>
      )}
    </>
  )
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
