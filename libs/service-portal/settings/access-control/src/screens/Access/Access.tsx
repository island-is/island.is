import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { defineMessage } from 'react-intl'

import {
  Box,
  Stack,
  GridRow,
  Inline,
  GridColumn,
  Text,
  Checkbox,
  Button,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

import { AccessItem } from './components'

const access = {
  id: '1234567890',
  name: 'Starfsmaður (CFO)',
  nationalId: '1234567890',
  items: [
    {
      id: '1',
      name: 'Mín gögn',
      explanation: 'Útskýring',
      created: '-',
    },
    {
      id: '2',
      name: 'Umsóknir',
      explanation: 'Útskýring',
      created: '-',
      subcategories: [
        {
          id: '2.1',
          name: 'Undiraðgangur',
          explanation: 'Útskýring',
          created: '-',
        },
        {
          id: '2.2',
          name: 'Undiraðgangur',
          explanation: 'Útskýring',
          created: '-',
        },
      ],
    },
    {
      id: '3',
      name: 'Rafræn skjöl',
      explanation: 'Útskýring',
      created: '-',
    },
    {
      id: '4',
      name: 'Fjármál',
      explanation: 'Útskýring',
      created: '-',
      subcategories: [
        {
          id: '4.1',
          name: 'Undiraðgangur',
          explanation: 'Útskýring',
          created: '-',
        },
        {
          id: '4.2',
          name: 'Undiraðgangur',
          explanation: 'Útskýring',
          created: '-',
        },
        {
          id: '4.3',
          name: 'Undiraðgangur',
          explanation: 'Útskýring',
          created: '-',
        },
      ],
    },
    {
      id: '5',
      name: 'Réttindi og leyfi',
      explanation: 'Útskýring',
      created: '-',
    },
    {
      id: '6',
      name: 'Stillingar',
      explanation: 'Útskýring',
      created: '-',
    },
  ],
}

function Access() {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors } = useForm()

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
        <Stack space={2}>
          <AccessItem size="sm" background="blue">
            <Text variant="small" color="blue600">
              {formatMessage({
                id: 'service.portal:access-control-access-access',
                defaultMessage: 'Aðgangur',
              })}
            </Text>
            <Text variant="small" color="blue600">
              {formatMessage({
                id: 'service.portal:access-control-access-explanation',
                defaultMessage: 'Útskýring',
              })}
            </Text>
            <Text variant="small" color="blue600">
              {formatMessage({
                id: 'service.portal:access-control-access-created',
                defaultMessage: 'Í gildi frá',
              })}
            </Text>
          </AccessItem>
          {access.items.map((item, index) => (
            <AccessItem key={index}>
              <Stack space={2}>
                {[item, ...(item.subcategories || [])].map((subItem, idx) => (
                  <Controller
                    control={control}
                    key={idx}
                    name={subItem.id}
                    defaultValue=""
                    render={({ onChange, value, name }) => (
                      <Checkbox
                        name={name}
                        withBorder={false}
                        large={idx === 0}
                        strong={idx > 0}
                        label={subItem.name}
                        value={value}
                        hasError={errors.name}
                        errorMessage={errors.name?.message}
                        onChange={onChange}
                      />
                    )}
                  />
                ))}
              </Stack>
              <Text>{item.explanation}</Text>
              <Text>{item.created}</Text>
            </AccessItem>
          ))}
        </Stack>
      </form>
    </Box>
  )
}

export default Access
