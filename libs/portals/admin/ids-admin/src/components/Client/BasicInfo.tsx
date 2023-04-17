import { AccordionCard, Input, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { RefObject } from 'react'
import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'
import { toast } from '@island.is/island-ui/core'

interface BasicInfoProps {
  clientId: string
  clientSecret?: string
  issuerUrl: string
}

const BasicInfoContent = ({
  clientId,
  // clientSecret,
  issuerUrl,
}: BasicInfoProps) => {
  const { formatMessage } = useLocale()
  // const [showSecret, setShowSecret] = React.useState(false)
  const clientIdRef = React.useRef<HTMLInputElement>(null)
  //const clientSecretRef = React.useRef<HTMLInputElement>(null)
  const issuerUrlRef = React.useRef<HTMLInputElement>(null)
  const authorizationUrlRef = React.useRef<HTMLInputElement>(null)
  const tokenUrlRef = React.useRef<HTMLInputElement>(null)
  const userInfoUrlRef = React.useRef<HTMLInputElement>(null)
  const endSessionUrlRef = React.useRef<HTMLInputElement>(null)
  const openIdConfigurationUrlRef = React.useRef<HTMLInputElement>(null)
  const jsonWebSetKeyUrlRef = React.useRef<HTMLInputElement>(null)

  const handleCopy = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ref: RefObject<HTMLInputElement>,
  ) => {
    if (!ref.current) return

    ref.current.select()
    document.execCommand('copy')
    if (ev.target instanceof HTMLElement) {
      ev.target.focus()
    }

    toast.success(formatMessage(m.copySuccess))
  }

  return (
    <ContentCard title={formatMessage(m.basicInfo)}>
      <Stack space={3}>
        <Input
          ref={clientIdRef}
          readOnly
          type="text"
          size="sm"
          name="application"
          value={clientId}
          label={formatMessage(m.clientId)}
          buttons={[
            {
              name: 'copy',
              label: 'copy',
              type: 'outline',
              onClick: (event) => {
                handleCopy(event, clientIdRef)
              },
            },
          ]}
        />
        {/*uncomment when we have client secret*/}
        {/*<Stack space={1}>*/}
        {/*  <Input*/}
        {/*    readOnly*/}
        {/*    type={showSecret ? 'text' : 'password'}*/}
        {/*    ref={clientSecretRef}*/}
        {/*    size="sm"*/}
        {/*    name="clientSecret"*/}
        {/*    value={clientSecret}*/}
        {/*    label={formatMessage(m.clientSecret)}*/}
        {/*    buttons={[*/}
        {/*      {*/}
        {/*        name: 'copy',*/}
        {/*        type: 'outline',*/}
        {/*        onClick: (event) => {*/}
        {/*          handleCopy(event, clientSecretRef)*/}
        {/*        },*/}
        {/*        label: 'Copy value',*/}
        {/*      },*/}
        {/*      {*/}
        {/*        name: showSecret ? 'eyeOff' : 'eye',*/}
        {/*        type: 'outline',*/}
        {/*        onClick: handleShow,*/}
        {/*        label: showSecret ? 'Hide password' : 'Show password',*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*  <Text variant={'small'}>*/}
        {/*    {formatMessage(m.clientSecretDescription)}*/}
        {/*  </Text>*/}
        {/*</Stack>*/}
        <Input
          readOnly
          type="text"
          ref={issuerUrlRef}
          size="sm"
          name="application"
          value={issuerUrl}
          label={formatMessage(m.idsUrl)}
          buttons={[
            {
              name: 'copy',
              label: 'copy',
              type: 'outline',
              onClick: (event) => {
                handleCopy(event, issuerUrlRef)
              },
            },
          ]}
        />
        <AccordionCard
          id="otherEndpoints"
          label={formatMessage(m.otherEndpoints)}
        >
          <Stack space={3}>
            <Input
              readOnly
              type="text"
              size="sm"
              ref={authorizationUrlRef}
              name="application"
              value={issuerUrl + 'connect/authorize'}
              label={formatMessage(m.oAuthAuthorizationUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: (event) => {
                    handleCopy(event, authorizationUrlRef)
                  },
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={tokenUrlRef}
              name="application"
              value={issuerUrl + 'connect/token'}
              label={formatMessage(m.oAuthTokenUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: (event) => {
                    handleCopy(event, tokenUrlRef)
                  },
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={userInfoUrlRef}
              name="application"
              value={issuerUrl + 'connect/userinfo'}
              label={formatMessage(m.oAuthUserInfoUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: (event) => {
                    handleCopy(event, userInfoUrlRef)
                  },
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={endSessionUrlRef}
              name="application"
              value={issuerUrl + 'connect/endsession'}
              label={formatMessage(m.endSessionUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: (event) => {
                    handleCopy(event, endSessionUrlRef)
                  },
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={openIdConfigurationUrlRef}
              name="application"
              value={issuerUrl + '.well-known/openid-configuration'}
              label={formatMessage(m.openIdConfiguration)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: (event) => {
                    handleCopy(event, openIdConfigurationUrlRef)
                  },
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="application"
              ref={jsonWebSetKeyUrlRef}
              value={issuerUrl + '.well-known/openid-configuration/jwks'}
              label={formatMessage(m.jsonWebKeySet)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: (event) => {
                    handleCopy(event, jsonWebSetKeyUrlRef)
                  },
                },
              ]}
            />
          </Stack>
        </AccordionCard>
      </Stack>
    </ContentCard>
  )
}

export default BasicInfoContent
