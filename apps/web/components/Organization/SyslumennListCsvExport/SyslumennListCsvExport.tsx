import React, { useState } from 'react'

import { Button } from '@island.is/island-ui/core'
import { IconMapIcon, IconMapType } from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

type CsvState = {
  icon: IconMapIcon
  iconType: IconMapType
  label: string
  disabled: boolean
  colorScheme: 'light' | 'default' | 'negative' | 'destructive'
}

interface SyslumennListCsvExportProps {
  defaultLabel: string
  loadingLabel: string
  errorLabel: string
  csvFilenamePrefix: string
  csvStringProvider(): Promise<string>
}

const downloadCSV = (csvString: string, csvFilename: string) => {
  const encodedUri =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString)
  const a = document.createElement('a')
  a.setAttribute('href', encodedUri)
  a.setAttribute('target', '_blank')
  a.setAttribute('download', csvFilename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const SyslumennListCsvExport: React.FC<
  React.PropsWithChildren<SyslumennListCsvExportProps>
> = ({
  defaultLabel,
  loadingLabel,
  errorLabel,
  csvFilenamePrefix,
  csvStringProvider,
}) => {
  const { format } = useDateUtils()

  const csvStateDefault: CsvState = {
    icon: 'download',
    iconType: 'filled',
    label: defaultLabel,
    disabled: false,
    colorScheme: 'default',
  }

  const csvStateLoading: CsvState = {
    icon: 'time',
    iconType: 'filled',
    label: loadingLabel,
    disabled: false,
    colorScheme: 'default',
  }

  const csvStateError: CsvState = {
    icon: 'reload',
    iconType: 'outline',
    label: errorLabel,
    disabled: false,
    colorScheme: 'destructive',
  }

  const [csvState, setCsvState] = useState<CsvState>(csvStateDefault)

  const onClick = () => {
    setCsvState(csvStateLoading)
    csvStringProvider()
      .then((csvString: string) => {
        downloadCSV(
          csvString,
          `${csvFilenamePrefix}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`,
        )
        setTimeout(() => {
          // In order to give the User some feedback, we delay the return to default, i.e. make sure that the loading state is shown for at least one second.
          setCsvState(csvStateDefault)
        }, 1000)
      })
      .catch((error) => {
        console.error(error)
        setCsvState(csvStateError)
      })
  }

  return (
    <Button
      colorScheme={csvState.colorScheme}
      disabled={csvState.disabled}
      preTextIcon={csvState.icon}
      iconType="filled"
      onClick={onClick}
      preTextIconType={csvState.iconType}
      size="small"
      type="button"
      variant="text"
    >
      {csvState.label}
    </Button>
  )
}
