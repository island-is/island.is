import React, { FC, MouseEvent } from 'react'
import { Button, Box } from '@island.is/island-ui/core'
import { forEach } from 'lodash'

const isIterableObject = (val) => {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

const forAll = function* (obj, keyPrefix = '') {
  const filteredKeys = Object.entries(obj).filter(([k]) => k !== '__typename')
  for (const [key, val] of filteredKeys) {
    const newKey = keyPrefix + key

    if (isIterableObject(val)) {
      yield* forAll(val, newKey + '_')
    } else {
      yield [newKey, val]
    }
  }
}

const useCsvExport = (data) => {
  if (data) {
    try {
      const allFlat = data.map((obj) => [...forAll(obj)])

      const csvContent = makeCsv(allFlat)

      triggerDownload(`opin_gogn${new Date()}.csv`, csvContent)
    } catch (e) {}
  }

  return
}

const triggerDownload = (filename, csvContent) => {
  const encodedUri = encodeURI(csvContent)
  const a = document.createElement('a')
  a.setAttribute('href', encodedUri)
  a.setAttribute('target', '_blank')
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const makeCsv = (allFlat) => {
  const [firstRow] = allFlat

  return (
    'data:text/csv;charset=utf-8,' +
    firstRow.map(([key]) => key).join(',') +
    '\r\n' +
    allFlat.map((row) => row.map(([, val]) => val).join(',')).join('\r\n')
  )
}
export interface ExportCSVButtonProps {
  data: string
}

export const ExportCSVButton: FC<ExportCSVButtonProps> = ({ data }) => {
  data = JSON.parse(data)
  return (
    <Box style={{ height: '48px' }}>
      <Button
        colorScheme="default"
        preTextIcon="download"
        iconType="filled"
        onBlur={function noRefCheck() {}}
        onClick={() => useCsvExport(data)}
        onFocus={function noRefCheck() {}}
        preTextIconType="filled"
        size="small"
        type="button"
        variant="ghost"
      >
        CSV
      </Button>
    </Box>
  )
}

export default ExportCSVButton
