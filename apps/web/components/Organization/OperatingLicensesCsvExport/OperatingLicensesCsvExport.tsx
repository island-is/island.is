import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { Button } from '@island.is/island-ui/core'
import { IconMapIcon, IconMapType } from '@island.is/island-ui/core'
import { Query } from '@island.is/web/graphql/schema'
import { GET_OPERATING_LICENSES_CSV_QUERY } from '../../../screens/queries'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

type CsvState = {
  icon: IconMapIcon
  iconType: IconMapType
  label: string
  disabled: boolean
  colorScheme: 'light' | 'default' | 'negative' | 'destructive'
}

interface OperatingLicensesCsvExportProps {
  namespace: Query['getNamespace']
}

export const OperatingLicensesCsvExport: React.FC<OperatingLicensesCsvExportProps> = ({
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { format } = useDateUtils()
  const client = useApolloClient()

  const csvStateDefault: CsvState = {
    icon: 'download',
    iconType: 'filled',
    label: n(
      'operatingLicensesCSVButtonLabelDefault',
      'Sækja öll rekstrarleyfi á CSV formi',
    ),
    disabled: false,
    colorScheme: 'default',
  }

  const csvStateLoading: CsvState = {
    icon: 'time',
    iconType: 'filled',
    label: n(
      'operatingLicensesCSVButtonLabelLoading',
      'Sæki öll rekstrarleyfi á CSV formi...',
    ),
    disabled: false,
    colorScheme: 'default',
  }

  const csvStateError: CsvState = {
    icon: 'reload',
    iconType: 'outline',
    label: n(
      'operatingLicensesCSVButtonLabelError',
      'Ekki tókst að sækja rekstrarleyfi, reyndu aftur',
    ),
    disabled: false,
    colorScheme: 'destructive',
  }

  const [csvState, setCsvState] = useState<CsvState>(csvStateDefault)

  const downloadCSV = (csvString: string) => {
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvString)
    const a = document.createElement('a')
    a.setAttribute('href', encodedUri)
    a.setAttribute('target', '_blank')
    a.setAttribute(
      'download',
      `${n('operatingLicensesCSVFileTitlePrefix', 'Rekstrarleyfi')}_${format(
        new Date(),
        'yyyy-MM-dd_HH-mm',
      )}.csv`,
    )
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleCSV = () => {
    setCsvState(csvStateLoading)
    client
      .query<Query>({
        query: GET_OPERATING_LICENSES_CSV_QUERY,
      })
      .then(({ data: { getOperatingLicensesCSV } }) => {
        downloadCSV(getOperatingLicensesCSV.value)
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
      onClick={handleCSV}
      preTextIconType={csvState.iconType}
      size="small"
      type="button"
      variant="text"
    >
      {csvState.label}
    </Button>
  )
}
