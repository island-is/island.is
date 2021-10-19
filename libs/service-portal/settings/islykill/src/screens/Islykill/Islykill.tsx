import React, { useState } from 'react'
import { defineMessage } from 'react-intl'

import {
  AlertBanner,
  Box,
  Button,
  Input,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { IntroHeader, UserInfoLine } from '@island.is/service-portal/core'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'

const GetIslykillSettings = gql`
  query GetIslykillSettings {
    getIslykillSettings {
      nationalId
      email
      mobile
      bankInfo
      lastLogin
      nextLastLogin
      lastPassChange
      canNudge
      onlyCert
    }
  }
`

const UpdateIslykillSettings = gql`
  mutation updateIslykillSettings($input: UpdateIslykillSettingsInput!) {
    updateIslykillSettings(input: $input) {
      nationalId
    }
  }
`

const CreateIslykillSettings = gql`
  mutation createIslykillSettings($input: CreateIslykillSettingsInput!) {
    createIslykillSettings(input: $input) {
      nationalId
    }
  }
`

const DeleteIslykillSettings = gql`
  mutation deleteIslykillSettings {
    deleteIslykillSettings {
      nationalId
      valid
    }
  }
`

const Update = () => {
  const [email, setEmail] = useState<string>('')
  const [updateIslykill, { loading, data, error }] = useMutation(
    UpdateIslykillSettings,
  )

  const onClick = async () => {
    updateIslykill({
      variables: { input: { email } },
    })
  }

  return (
    <>
      <Input
        name="email"
        label="Netfang"
        onChange={(e) => {
          setEmail(e.currentTarget.value)
        }}
        value={email}
      />
      <Button onClick={onClick}>Uppfæra netfang</Button>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {error && <p>Villa: {JSON.stringify(error)}</p>}
      {data && <p>Gögn: {JSON.stringify(data)}</p>}
    </>
  )
}

const Delete = () => {
  const [deleteIslykill, { loading, data, error }] = useMutation(
    DeleteIslykillSettings,
  )

  const onClick = async () => {
    deleteIslykill()
  }

  return (
    <>
      <Button onClick={onClick}>Eyða stillingum</Button>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {error && <p>Villa: {JSON.stringify(error)}</p>}
      {data && <p>Gögn: {JSON.stringify(data)}</p>}
    </>
  )
}

const Create = () => {
  const [email, setEmail] = useState<string>('')
  const [createIslykill, { loading, data, error }] = useMutation(
    CreateIslykillSettings,
  )

  const onClick = async () => {
    createIslykill({
      variables: { input: { email } },
    })
  }

  return (
    <>
      <Input
        name="email"
        label="Netfang"
        onChange={(e) => {
          setEmail(e.currentTarget.value)
        }}
        value={email}
      />
      <Button onClick={onClick}>Búa til stillingar með netfangi</Button>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {error && <p>Villa: {JSON.stringify(error)}</p>}
      {data && <p>Gögn: {JSON.stringify(data)}</p>}
    </>
  )
}

const Info = () => {
  const { formatMessage } = useLocale()

  const { loading, error, data, refetch } = useQuery<Query>(
    GetIslykillSettings,
    { fetchPolicy: 'no-cache' },
  )

  const settings = data?.getIslykillSettings

  const valueMissingMessage = formatMessage(
    defineMessage({
      id: 'service.portal.settings.islykill:undefined',
      defaultMessage: 'Óskilgreint',
    }),
  )

  if (loading) {
    return (
      <Box padding={3}>
        <SkeletonLoader space={1} height={40} repeat={5} />
      </Box>
    )
  }

  if (!loading && settings && !error) {
    return (
      <>
        <Stack space={1}>
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:email',
              defaultMessage: 'Netfang',
            })}
            content={settings.email ?? valueMissingMessage}
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:mobile',
              defaultMessage: 'Farsími',
            })}
            content={settings.mobile ?? valueMissingMessage}
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:bankInfo',
              defaultMessage: 'Bankaupplýsingar',
            })}
            content={settings.bankInfo ?? valueMissingMessage}
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:lastLogin',
              defaultMessage: 'Seinasta innskráning',
            })}
            content={settings.lastLogin ?? valueMissingMessage}
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:nextLastLogin',
              defaultMessage: 'Þar seinasta innskráning',
            })}
            content={settings.nextLastLogin ?? valueMissingMessage}
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:lastPassChange',
              defaultMessage: 'Íslykli seinast breytt',
            })}
            content={settings.lastPassChange ?? valueMissingMessage}
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:canNudge',
              defaultMessage: 'Hnipp?',
            })}
            content={
              typeof settings.canNudge === 'boolean'
                ? settings.canNudge
                  ? 'Já'
                  : 'Nei'
                : valueMissingMessage
            }
          />
          <UserInfoLine
            label={defineMessage({
              id: 'service.portal.settings.islykill:onlyCert',
              defaultMessage: 'Innskráning aðeins með rafrænum skilríkjum?',
            })}
            content={
              typeof settings.onlyCert === 'boolean'
                ? settings.onlyCert
                  ? 'Já'
                  : 'Nei'
                : valueMissingMessage
            }
          />
        </Stack>
        <Button
          onClick={async () => {
            await refetch({})
          }}
        >
          Sækja aftur
        </Button>
      </>
    )
  }

  return (
    <Box>
      <AlertBanner
        description={formatMessage({
          id: 'service.portal:could-not-fetch-data',
          defaultMessage: 'Ekki tókst að sækja gögn',
        })}
        variant="error"
      />
    </Box>
  )
}

export default function Islykill() {
  useNamespaces('sp.settings-islykill')

  return (
    <Box>
      <IntroHeader
        title={'Íslykill'}
        intro={defineMessage({
          id: 'service.portal.settings.islykill:intro',
          defaultMessage: 'Stillingar á Íslykil.',
        })}
      />
      <Box marginBottom={5}>
        <Info />
      </Box>
      <Box marginBottom={5}>
        <Update />
      </Box>
      <Box marginBottom={5}>
        <Create />
      </Box>
      <Box marginBottom={5}>
        <Delete />
      </Box>
    </Box>
  )
}
