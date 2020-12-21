import React, { useEffect, useState } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, Tabs, toast } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import {
  DocumentProviderBasicInfo,
  FormData,
} from '../../components/DocumentProviderBasicInfo/DocumentProviderBasicInfo'

const SingleDocumentProvider: ServicePortalModuleComponent = ({ userInfo }) => {
  //Interface will be deleted, when graphql is ready.
  interface Applicant {
    name: string
    email: string
    phoneNumber: string
    nationalId: string
    address: string
    zipCode: string
  }

  interface AdministrativeContact {
    name: string
    email: string
    phoneNumber: string
  }

  interface TechnicalContact {
    name: string
    email: string
    phoneNumber: string
  }

  interface HelpDeskContact {
    email: string
    phoneNumber: string
  }

  interface Data {
    applicant: Applicant
    administrativeContact: AdministrativeContact
    technicalContact: TechnicalContact
    helpDeskContact: HelpDeskContact
    id: string
  }
  const { formatMessage } = useLocale()
  const [data, setData] = useState<Data>()

  //Todo: Get Single DocumentProvider, Mock data for now. Might not need useEffect here.
  //Will see when data is ready...
  useEffect(() => {
    //TODO: Set up real data
    handleFetch()
  }, [])

  const handleFetch = () => {
    //TODO: Set up real data
    //How do we translate this ?
    setData({
      applicant: {
        name: 'Þjóðskrá Íslands',
        email: 'thjodskra@thjodskra.is',
        phoneNumber: '1234567',
        nationalId: '123456-1234',
        address: 'Guðrúnartún 10',
        zipCode: '105',
      },
      administrativeContact: {
        name: 'Hákon Jónsson',
        email: 'hakon@hakon.is',
        phoneNumber: '1234567',
      },
      technicalContact: {
        name: 'Hinrik Steinar Vilhjálmsson',
        email: 'hsv@advania.is',
        phoneNumber: '1234123',
      },
      helpDeskContact: {
        email: 'advania@advania.is',
        phoneNumber: '1234123',
      },
      id: 'dsadg232-dsadsa12-dsadas56',
    })
  }

  const submitFormData = async (formData: FormData) => {
    console.log('formData', formData)
    toast.success('Endapunktur vistaður')
  }

  const handleSubmit = (data: FormData) => {
    submitFormData(data)
  }

  const basicUserInfo = data && (
    <Box>
      <DocumentProviderBasicInfo data={data!} onSubmit={handleSubmit} />
    </Box>
  )

  const filesInfo = (
    <Box>
      <Text variant="h3">Nánar um skjöl</Text>
    </Box>
  )

  const tabs = [
    {
      label: 'Grunnupplýsingar',
      content: basicUserInfo,
    },
    {
      label: 'Skjöl',
      content: filesInfo,
    },
  ]

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h1" as="h1">
          {data?.applicant?.name}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <Text as="p">{formatMessage(m.SingleProviderDescription)}</Text>
      </Box>
      <Box>
        <Tabs label="Flipar" tabs={tabs} contentBackground="white" />
      </Box>
    </Box>
  )
}

export default SingleDocumentProvider
