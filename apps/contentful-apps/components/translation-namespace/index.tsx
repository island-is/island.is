import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import Markdown from 'markdown-to-jsx'
import { EditorLocaleSettings, FieldExtensionSDK } from '@contentful/app-sdk'
import Button from '@contentful/forma-36-react-components/dist/components/Button'
import Table from '@contentful/forma-36-react-components/dist/components/Table/Table'
import TableBody from '@contentful/forma-36-react-components/dist/components/Table/TableBody'
import TableCell from '@contentful/forma-36-react-components/dist/components/Table/TableCell'
import TableHead from '@contentful/forma-36-react-components/dist/components/Table/TableHead'
import TableRow from '@contentful/forma-36-react-components/dist/components/Table/TableRow'
import TextField from '@contentful/forma-36-react-components/dist/components/TextField'
import { useSDK } from '@contentful/react-apps-toolkit'

import { Label } from './components/Label'
import { MarkdownEditor } from './components/MarkdownEditor'
import { unifyAndDeserialize } from './utils/deserialize'
import { serializeAndFormat } from './utils/serialize'

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

export const App = () => {
  const extension = useSDK<FieldExtensionSDK>()

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

  useEffect(() => {
    extension.window.startAutoResizer()
  }, [extension.window])

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
                  <Markdown>{values[item].defaultMessage ?? ''}</Markdown>
                </div>
              ) : (
                <p>{values[item].defaultMessage ?? ''}</p>
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
      <style global jsx>
        {`
          html,
          body,
          div,
          p {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
          }

          /* Hide label to TextField */
          .table-cell [class*='TextField__TextField__label'] {
            display: none;
          }

          /* Extracted from "import '@contentful/forma-36-react-components/dist/styles.css'" to make the bundle lighter */

          .a11y__focus-outline--default___2hwb1:focus {
            outline: 1px solid #2e75d4;
            border-radius: 4px;
            -webkit-box-shadow: 0 0 0 3px #84b9f5;
            box-shadow: 0 0 0 3px #84b9f5;
          }

          .a11y__focus-border--default___60AXp:focus {
            outline: none;
            border: 1px solid #2e75d4;
            -webkit-box-shadow: 0 0 0 3px #84b9f5;
            box-shadow: 0 0 0 3px #84b9f5;
          }

          .Table__Table___3vKIR {
            width: 100%;
          }

          .Table__Table--inline___2jv97 {
            border-radius: 6px;
            -webkit-box-shadow: 0 0 0 1px #e5ebed;
            box-shadow: 0 0 0 1px #e5ebed;
          }

          .Table__Table--inline___2jv97 th:first-child {
            border-top-left-radius: 6px;
          }

          .Table__Table--inline___2jv97 th:last-child {
            border-top-right-radius: 6px;
          }

          .TableCell__TableCell___Wou8a {
            border-bottom: 1px solid #e5ebed;
            color: #536171;
            font-size: 0.875rem;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
              Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
              Segoe UI Symbol;
            font-weight: 400;
            line-height: 1.5;
            padding: 0.75rem 1rem;
            vertical-align: top;
          }

          tbody tr:last-child .TableCell__TableCell___Wou8a {
            border-bottom: none;
          }

          .TableCell__TableCell--head___1HhvZ {
            background-color: #f7f9fa;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .TableCell__TableCell--head__sorting____Jc1k {
            color: #192532;
          }

          .TableHead__TableHead--sticky___1YzE0 th {
            position: sticky;
            top: 0;
          }

          .TableRow__TableRow--selected___1245A {
            background-color: #edf4fc;
            -webkit-box-shadow: inset -2px 0 0 #2e75d4;
            box-shadow: inset -2px 0 0 #2e75d4;
          }

          .TextInput__TextInput___36-K- {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
          }

          .TextInput__TextInput__input___27vDB {
            outline: none;
            -webkit-box-shadow: inset 0 2px 0 rgba(225, 228, 232, 0.2);
            box-shadow: inset 0 2px 0 rgba(225, 228, 232, 0.2);
            background-color: #fff;
            border: 1px solid #d3dce0;
            border-radius: 6px;
            max-height: 2.5rem;
            color: #536171;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
              Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
              Segoe UI Symbol;
            font-size: 0.875rem;
            padding: 0.65625rem;
            margin: 0;
            width: 100%;
            -webkit-appearance: textfield;
          }

          .TextInput__TextInput__input___27vDB::-webkit-input-placeholder {
            color: #6b7888;
          }

          .TextInput__TextInput__input___27vDB::-moz-placeholder {
            color: #6b7888;
          }

          .TextInput__TextInput__input___27vDB:-ms-input-placeholder {
            color: #6b7888;
          }

          .TextInput__TextInput__input___27vDB::-ms-input-placeholder {
            color: #6b7888;
          }

          .TextInput__TextInput__input___27vDB::placeholder {
            color: #6b7888;
          }

          .TextInput__TextInput__input___27vDB::-webkit-search-cancel-button,
          .TextInput__TextInput__input___27vDB::-webkit-search-decoration,
          .TextInput__TextInput__input___27vDB::-webkit-search-results-button,
          .TextInput__TextInput__input___27vDB::-webkit-search-results-decoration {
            -webkit-appearance: none;
          }

          .TextInput__TextInput__input___27vDB:active,
          .TextInput__TextInput__input___27vDB:focus {
            -webkit-box-shadow: 0 0 0 3px #bbcce2;
            box-shadow: 0 0 0 3px #bbcce2;
            border-color: #2e75d4;
          }

          .TextInput__TextInput__input___27vDB:focus {
            z-index: 1;
          }

          .TextInput__TextInput--small___19AFQ {
            width: 120px;
          }

          .TextInput__TextInput--medium___1bR2D {
            width: 240px;
          }

          .TextInput__TextInput--large___KwY4O {
            width: 420px;
          }

          .TextInput__TextInput--full___1EJEW {
            width: 100%;
          }

          .TextInput__TextInput--disabled___2t7VS
            .TextInput__TextInput__input___27vDB {
            background: #f7f9fa;
          }

          .TextInput__TextInput--disabled___2t7VS
            .TextInput__TextInput__input___27vDB:active,
          .TextInput__TextInput--disabled___2t7VS
            .TextInput__TextInput__input___27vDB:focus {
            border-color: #d3dce0;
          }

          .TextInput__TextInput--negative___iVq__
            .TextInput__TextInput__input___27vDB {
            border-color: #bf3045;
          }

          .TextInput__TextInput--negative___iVq__
            .TextInput__TextInput__input___27vDB:focus {
            -webkit-box-shadow: 0 0 0 3px #eca7a7;
            box-shadow: 0 0 0 3px #eca7a7;
          }

          .TextInput__TextInput--with-copy-button___4ehAW
            .TextInput__TextInput__input___27vDB {
            border-radius: 6px 0 0 6px;
          }

          .TextInput__TextInput__copy-button___3Sy2W button {
            border-left: none;
            height: 100%;
            background-color: #fff;
            border-radius: 0 6px 6px 0;
          }

          .TextInput__TextInput__copy-button___3Sy2W button:hover {
            background-color: #f7f9fa;
          }

          .TextInput__TextInput__copy-button___3Sy2W button:focus {
            -webkit-box-shadow: 0 0 0 3px #84b9f5;
            box-shadow: 0 0 0 3px #84b9f5;
          }

          .TextInput__TextInput__copy-button___3Sy2W[focus-within] {
            z-index: 1;
          }

          .ValidationMessage__ValidationMessage___3_rEq {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
          }

          .ValidationMessage__ValidationMessage__icon___3HPCh {
            margin-right: 0.25rem;
            margin-top: 0.125rem;
            min-height: 18px;
            min-width: 18px;
          }

          .ValidationMessage__ValidationMessage__text___8FBj5 {
            display: inline-block;
            font-size: 0.875rem;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
              Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
              Segoe UI Symbol;
            color: #bf3045;
            margin: 0;
            line-height: 1.5;
          }

          .Icon__Icon--negative___1dled {
            fill: #bf3045;
          }

          .TextField__TextField__validation-message___1Idkl {
            margin-top: 0.5rem;
          }

          .Button__Button___1ZfFj,
          .Button__Button___1ZfFj:link {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            height: 2.5rem;
            display: inline-block;
            padding: 0;
            border: 0.0625rem solid #c3cfd5;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
              Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
              Segoe UI Symbol;
            font-size: 0.875rem;
            font-weight: 500;
            overflow: hidden;
            background-size: 100% 200%;
            -webkit-transition: background 0.1s ease-in-out,
              opacity 0.2s ease-in-out, border-color 0.2s ease-in-out;
            transition: background 0.1s ease-in-out, opacity 0.2s ease-in-out,
              border-color 0.2s ease-in-out;
            vertical-align: middle;
            text-decoration: none;
            -webkit-box-shadow: 0 1px 0 rgba(25, 37, 50, 0.1);
            box-shadow: 0 1px 0 rgba(25, 37, 50, 0.1);
          }
          .Button__Button___1ZfFj:hover:not(.Button__Button--disabled___1E20M),
          .Button__Button___1ZfFj:link:hover:not(.Button__Button--disabled___1E20M) {
            cursor: pointer;
          }
          .Button__Button___1ZfFj:focus:not(.Button__Button--disabled___1E20M),
          .Button__Button___1ZfFj:link:focus:not(.Button__Button--disabled___1E20M) {
            outline: none;
          }
          .Button__Button__icon___2YX5- {
            min-width: 1.125rem;
          }
          .Button__Button--muted___2Wair {
            background-color: #fff;
            border-color: #c3cfd5;
            -webkit-box-shadow: 0 1px 0 rgba(25, 37, 50, 0.08);
            box-shadow: 0 1px 0 rgba(25, 37, 50, 0.08);
          }
          .Button__Button--muted___2Wair:hover:not(.Button__Button--disabled___1E20M) {
            background-color: #f7f9fa;
          }
          .Button__Button--muted___2Wair.Button__Button--is-active___iPvhW:not(.Button__Button--disabled___1E20M),
          .Button__Button--muted___2Wair:active:not(.Button__Button--disabled___1E20M) {
            -webkit-transition: none;
            transition: none;
            background-color: #e5ebed;
          }
          .Button__Button--muted___2Wair:focus:not(.Button__Button--disabled___1E20M) {
            -webkit-box-shadow: 0 0 0 3px #e5ebed;
            box-shadow: 0 0 0 3px #e5ebed;
          }
          .Button__Button__inner-wrapper___3qrNC {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            height: 100%;
            z-index: 1;
            padding: 0 1rem;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
          }
          .Button__Button__label___3tcOj {
            margin: 0 0.25rem;
            font-size: 0.875rem;
            color: #192532;
            line-height: 2;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .Button__Button--small___3yyrk,
          .Button__Button--small___3yyrk:link {
            height: 2rem;
          }
          .Button__Button--small___3yyrk .Button__Button__inner-wrapper___3qrNC,
          .Button__Button--small___3yyrk:link
            .Button__Button__inner-wrapper___3qrNC {
            padding: 0 0.875rem;
          }

          [data-slate-editor] > * + * {
            margin-top: 10px;
          }
        `}
      </style>

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
