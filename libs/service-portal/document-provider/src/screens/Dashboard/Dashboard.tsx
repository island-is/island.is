import React, { useEffect,useState } from 'react'

import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

import {
  StatisticForm,
  StatisticFormData,
} from '../../components/Forms/StatisticForm'
import { StatisticBox } from '../../components/StatisticBox/StatisticBox'
import { m } from '../../lib/messages'

const Dashboard: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  interface Data {
    name: string
    value: number
  }

  interface ErrorData {
    title: string
    message: string
  }

  const [data, setData] = useState<Data[]>([])
  const [errorData, seterrorData] = useState<ErrorData[]>([])

  useEffect(() => {
    //TODO: Set up real data
    handleFetch()
  }, [])

  const handleFetch = () => {
    //TODO: Set up real data
    //How do we translate this ?
    setData([
      {
        name: 'Send skjöl',
        value: 123,
      },
      { name: 'Opnuð skjöl', value: 333 },
      { name: 'Hnipp', value: 444 },
    ])
    //How do we translate this ?
    seterrorData([
      {
        title: 'Skjalaveituþjónusta er ekki í lagi',
        message: 'Ekki virkar að ..... úr skjalaveituþjónustu',
      },
    ])
  }

  const handleSubmit = (data: StatisticFormData) => {
    submitFormData(data)
  }

  const submitFormData = async (formData: StatisticFormData) => {
    //TODO: Set up submit
    console.log(formData)
  }

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h3" as="h1">
          {formatMessage(m.DashBoardTitle)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text as="p">{formatMessage(m.DashBoardDescription)}</Text>
      </Box>
      <Box marginBottom={2}>
        {errorData &&
          errorData.map((ErrorData, index) => (
            <AlertMessage
              key={index}
              type="error"
              title={ErrorData.title}
              message={ErrorData.message}
            />
          ))}
      </Box>
      <Box marginBottom={2}>
        {data && (
          <GridRow>
            {data.map((Data, index) => (
              <GridColumn span={['12/12', '4/12']} key={index}>
                <StatisticBox name={Data.name} value={Data.value} />
              </GridColumn>
            ))}
          </GridRow>
        )}
      </Box>
      <Box marginBottom={2}>
        <StatisticForm onSubmit={handleSubmit} />
      </Box>
    </Box>
  )
}

export default Dashboard
