import React, { FC } from 'react'

import { Box, Button } from '@island.is/island-ui/core'

const isIterableObject = (val: object[]) => {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const forAll = function* (obj: object, keyPrefix = '') {
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

const triggerDownload = (filename: string, csvContent: string) => {
  const encodedUri = encodeURI(csvContent)
  const a = document.createElement('a')
  a.setAttribute('href', encodedUri)
  a.setAttribute('target', '_blank')
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const makeCsv = (allFlat: [string, string][][]): string => {
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
  title: string
}

export const ExportCSVButton: FC<
  React.PropsWithChildren<ExportCSVButtonProps>
> = ({ data, title }) => {
  function useCsvExport() {
    const newdata = JSON.parse(data)
    if (data) {
      try {
        const allFlat = newdata.map((obj: object) => [...forAll(obj)])

        const csvContent = makeCsv(allFlat)

        triggerDownload(`${title}_${new Date()}.csv`, csvContent)
      } catch (e) {
        console.log(e)
      }
    }
  }
  return (
    <Box style={{ height: '48px' }}>
      <Button
        colorScheme="default"
        preTextIcon="download"
        iconType="filled"
        onClick={useCsvExport}
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
