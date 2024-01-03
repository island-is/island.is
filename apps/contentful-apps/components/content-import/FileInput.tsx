import { ChangeEvent, useState } from 'react'
import XLSX from 'xlsx'
import { PageExtensionSDK } from '@contentful/app-sdk'
import { Flex } from '@contentful/f36-core'
import { Spinner } from '@contentful/f36-spinner'
import { useSDK } from '@contentful/react-apps-toolkit'

import { FileData } from './utils'

const promptUserForSheetName = (
  callback: (value: string | false) => void,
  sheetNames: string[],
) => {
  const confirmButtonId = 'sheet-name-confirm-button'
  const cancelButtonId = 'sheet-name-cancel-button'
  const modal = `
  <label for="sheet-names">Choose a tab:</label>
  <select name="sheet-names" id="sheet-names">
    ${sheetNames.map((name) => `<option value="${name}">${name}</option>`)}
  </select>
  <button id="${confirmButtonId}" style="background-color: #0059C8; color:white; padding: 2px">Confirm</button>
  <button id="${cancelButtonId}" style="text-decoration: underline; text-underline-offset: 2px">Cancel</button>
  `

  const div = document.createElement('div')
  div.innerHTML = modal
  div.style.display = 'flex'
  div.style.flexDirection = 'column'
  div.style.gap = '6px'
  div.style.position = 'absolute'
  div.style.zIndex = '3'
  div.style.border = '1px solid #CFD9E0'
  div.style.borderRadius = '8px'
  div.style.backgroundColor = 'white'
  div.style.padding = '32px'

  div.style.top = '64px'
  div.style.left = '50%'
  div.style.transform = 'translate(-50%)'

  const setOpacity = (opacity: string) => {
    const container = document.getElementById('content-import-screen-container')
    if (container) {
      container.style.opacity = opacity
    }
  }

  setOpacity('0.3')
  document.body.appendChild(div)

  const confirmButton = document.getElementById(confirmButtonId)
  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      setOpacity('1')
      div.remove()
      callback('Sameinað')
    })
  } else {
    setOpacity('1')
    div.remove()
    callback('')
  }

  const cancelButton = document.getElementById(cancelButtonId)
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      setOpacity('1')
      div.remove()
      callback(false)
    })
  } else {
    setOpacity('1')
    div.remove()
  }
}

interface FileInputProps {
  setFileData: (fileData: FileData) => void
}

export const FileInput = ({ setFileData }: FileInputProps) => {
  const sdk = useSDK<PageExtensionSDK>()
  const [loading, setLoading] = useState(false)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' })

      let sheetName = workbook.SheetNames[0]

      const callback = (userInput: string | false) => {
        setLoading(false)
        if (userInput === false) {
          reader.abort()
          return
        }
        if (workbook.SheetNames.includes(userInput)) {
          sheetName = userInput
        }
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          blankrows: false,
        })
        setFileData(jsonData as FileData)
        sdk.notifier.success(
          `File ${file?.name ? '"' + file.name + '"' : ''} has been loaded`,
        )
      }

      if (workbook.SheetNames.length > 1) {
        setLoading(false)
        promptUserForSheetName(callback, workbook.SheetNames)
      } else {
        callback('')
      }
    }

    reader.onerror = () => {
      sdk.notifier.error(
        `File ${file?.name ? '"' + file.name + '"' : ''} could not be loaded`,
      )
      setLoading(false)
    }

    reader.readAsBinaryString(file)

    setLoading(true)
  }

  return (
    <Flex>
      <input type="file" accept=".xlsx" onChange={onFileChange} />
      {loading && <Spinner />}
    </Flex>
  )
}
