import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Box, Text, Input, Button } from '@island.is/island-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

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

export interface FormData {
  applicant: Applicant
  administrativeContact: AdministrativeContact
  technicalContact: TechnicalContact
  helpDeskContact: HelpDeskContact
  id: string
}

interface Props {
  data: FormData
  onSubmit: (data: FormData) => void
}

export const DocumentProviderBasicInfo: FC<Props> = ({ data, onSubmit }) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors } = useForm()
  return (
    <Box marginY={3}>
      {/* skoda betur a morgun */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={4}>
          <Box marginBottom={4}>
            <Text variant="h3" as="h3">
              Stofnun
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="applicant.name"
              defaultValue={data?.applicant?.name}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Nafn á stofnun"
                  placeholder="Nafn a stofnun"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="applicant.nationalId"
              defaultValue={data?.applicant?.nationalId}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Kennitala stofnunar"
                  placeholder="Kennitala stofnunar"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="applicant.email"
              defaultValue={data?.applicant?.email}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Netfang"
                  placeholder="Netfang"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="applicant.phoneNumber"
              defaultValue={data?.applicant?.phoneNumber}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Símanúmer"
                  placeholder="Símanúmer"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="applicant.address"
              defaultValue={data?.applicant?.address}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Heimilsfang"
                  placeholder="Heimilsfang"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="applicant.zipCode"
              defaultValue={data?.applicant?.zipCode}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Póstnúmer"
                  placeholder="Póstnúmer"
                />
              )}
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
            <Controller
              control={control}
              name="administrativeContact.name"
              defaultValue={data?.administrativeContact?.name}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Nafn"
                  placeholder="Nafn"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="administrativeContact.email"
              defaultValue={data?.administrativeContact?.email}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Netfang"
                  placeholder="Netfang"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="administrativeContact.phoneNumber"
              defaultValue={data?.administrativeContact?.phoneNumber}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Símanúmer"
                  placeholder="Símanúmer"
                />
              )}
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
            <Controller
              control={control}
              name="technicalContact.name"
              defaultValue={data?.technicalContact?.name}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Nafn"
                  placeholder="Nafn"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="technicalContact.email"
              defaultValue={data?.technicalContact?.email}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Netfang"
                  placeholder="Netfang"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="technicalContact.phoneNumber"
              defaultValue={data?.technicalContact?.phoneNumber}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Símanúmer"
                  placeholder="Símanúmer"
                />
              )}
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
            <Controller
              control={control}
              name="helpDeskContact.email"
              defaultValue={data?.helpDeskContact?.email}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Netfang"
                  placeholder="Netfang"
                />
              )}
            />
          </Box>
          <Box marginBottom={2}>
            <Controller
              control={control}
              name="helpDeskContact.phoneNumber"
              defaultValue={data?.helpDeskContact?.phoneNumber}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Símanúmer"
                  placeholder="Símanúmer"
                />
              )}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexDirection={['columnReverse', 'row']}
          marginTop={4}
        >
          <Box marginTop={[1, 0]}>
            <Link to={ServicePortalPath.DocumentProviderDocumentProviders}>
              <Button variant="ghost">
                {formatMessage(m.SettingsEditEndPointsBackButton)}
              </Button>
            </Link>
          </Box>
          <Button type="submit" variant="primary" icon="arrowForward">
            {formatMessage(m.SettingsEditEndPointsSaveButton)}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
