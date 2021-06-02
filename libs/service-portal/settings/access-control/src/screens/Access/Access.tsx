import React from 'react'
import { useHistory } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { defineMessage } from 'react-intl'

import {
  Box,
  Inline,
  Text,
  Button,
  Table as T,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

import { AccessItem } from './components'

const accessGroups = [
  {
    id: '1234567890',
    displayName: 'Mín gögn',
    description: 'Útskýring',
    validTo: '',
    scopes: [
      {
        id: '1337',
        displayName: 'Undiraðgangur',
        description: 'Útskýring',
        validTo: '',
      },
    ],
  },
]

const access = {
  id: '1234567890',
  name: 'Starfsmaður (CFO)',
  nationalId: '1234567890',
}

function Access() {
  const { formatMessage } = useLocale()
  const hookFormData = useForm()
  const { handleSubmit } = hookFormData
  const history = useHistory()

  const onSubmit = handleSubmit(({ nationalId }) => {
    // TODO: mutate
    history.push(nationalId)
  })

  return (
    <Box>
      <IntroHeader
        title={access.name}
        intro={defineMessage({
          id: 'service.portal:access-control-access-intro',
          defaultMessage:
            'Reyndu að lámarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
        })}
      />
      <FormProvider {...hookFormData}>
        <form onSubmit={onSubmit}>
          <Box marginBottom={3} display="flex" justifyContent="flexEnd">
            <Inline space={3}>
              <Button
                onClick={() => console.log('delete')}
                variant="ghost"
                colorScheme="destructive"
                size="small"
                icon="close"
              >
                {formatMessage({
                  id: 'service.portal:access-control-access-remove',
                  defaultMessage: 'Eyða umboði',
                })}
              </Button>
              <Button size="small" type="submit" icon="checkmark">
                {formatMessage({
                  id: 'service.portal:access-control-access-save',
                  defaultMessage: 'Vista aðgang',
                })}
              </Button>
            </Inline>
          </Box>

          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  <Text variant="small" color="blue600">
                    {formatMessage({
                      id: 'service.portal:access-control-access-access',
                      defaultMessage: 'Aðgangur',
                    })}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="small" color="blue600">
                    {formatMessage({
                      id: 'service.portal:access-control-access-explanation',
                      defaultMessage: 'Útskýring',
                    })}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="small" color="blue600">
                    {formatMessage({
                      id: 'service.portal:access-control-access-created',
                      defaultMessage: 'Í gildi frá',
                    })}
                  </Text>
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {accessGroups.map((item, index) => {
                const accessItems = [item, ...(item.scopes || [])]
                return accessItems.map((item, idx) => (
                  <AccessItem
                    key={index}
                    item={item}
                    isLastItem={idx === accessItems.length - 1}
                    isFirstItem={idx === 0}
                  />
                ))
              })}
            </T.Body>
          </T.Table>
        </form>
      </FormProvider>
    </Box>
  )
}

export default Access
