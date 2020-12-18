import React, { FC } from 'react'
import { Box, Text, Input } from '@island.is/island-ui/core'

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

interface Props {
  data: Data | undefined
}

export const DocumentProviderBasicInfo: FC<Props> = ({ data }) => {
  return (
    <Box marginY={3}>
      {/* skoda betur a morgun */}
      <form>
        <Box marginBottom={4}>
          <Box marginBottom={4}>
            <Text variant="h3" as="h3">
              Stofnun
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'applicant.name'}
              label="Nafn á stofnun"
              value={data?.applicant?.name}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'applicant.nationalId'}
              label="Kennitala stofnunar"
              value={data?.applicant?.nationalId}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'applicant.email'}
              label="Netfang"
              value={data?.applicant?.email}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'applicant.phoneNumber'}
              label="Símanúmer"
              value={data?.applicant?.phoneNumber}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'applicant.address'}
              label="Heimilsfang"
              value={data?.applicant?.address}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'applicant.zipCode'}
              label="Póstnúmer"
              value={data?.applicant?.zipCode}
            />
          </Box>
        </Box>
        <Box marginBottom={4}>
          <Box marginBottom={4}>
            <Text variant="h3" as="h3">
              Ábyrgðarmaður
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'administrativeContact.name'}
              label="Nafn"
              value={data?.administrativeContact?.name}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'administrativeContact.email'}
              label="Netfang"
              value={data?.administrativeContact?.email}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'administrativeContact.phoneNumber'}
              label="Símanúmer"
              value={data?.administrativeContact?.phoneNumber}
            />
          </Box>
        </Box>
        <Box marginBottom={4}>
          <Box marginBottom={4}>
            <Text variant="h3" as="h3">
              Tæknilegur tengiliður
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'technicalContact.name'}
              label="Nafn"
              value={data?.technicalContact?.name}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'technicalContact.email'}
              label="Netfang"
              value={data?.technicalContact?.email}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'technicalContact.phoneNumber'}
              label="Símanúmer"
              value={data?.technicalContact?.phoneNumber}
            />
          </Box>
        </Box>
        <Box marginBottom={4}>
          <Box marginBottom={4}>
            <Text variant="h3" as="h3">
              Notendaaðstoð
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'helpDeskContact.email'}
              label="Netfang"
              value={data?.helpDeskContact?.email}
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name={'helpDeskContact.phoneNumber'}
              label="Símanúmer"
              value={data?.helpDeskContact?.phoneNumber}
            />
          </Box>
        </Box>
      </form>
    </Box>
  )
}
