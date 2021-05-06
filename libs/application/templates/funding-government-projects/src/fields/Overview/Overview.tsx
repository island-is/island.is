import { MessageDescriptor } from '@formatjs/intl'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { definitionOfApplicant } from '../../lib/messages'

interface ValueLineProps {
  title?: MessageDescriptor | string
  value: string
  hasDivider?: boolean
}

const ValueLine = ({ title, value, hasDivider = true }: ValueLineProps) => {
  const { formatMessage } = useLocale()
  return (
    <>
      {title && (
        <Text variant="h5" marginBottom={1}>
          {typeof title == 'string' ? title : formatMessage(title)}
        </Text>
      )}
      <Text>{value}</Text>
      {hasDivider && (
        <Box paddingY={3}>
          <Divider />
        </Box>
      )}
    </>
  )
}

export const Overview = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application.answers


  return (
    <>
      
      <ValueLine
        title={'Nafn á ráðuneyti eða stofnun sem sækir um'}
        value={'Answer'}
      />

      <Text variant="h4" marginTop={3} marginBottom={3}>
        Tengiliður
      </Text>
      
      <ValueLine title={'Nafn'} value={'Answer'} />

      <ValueLine title={'Netfang'} value={'Answer'} />
      
      <ValueLine title={'Símanúmer'} value={'Answer'} />

      <Text variant="h4" marginTop={3} marginBottom={2}>
        Verkefnið
      </Text>

      <ValueLine title={'Heiti verkefnis '} value={'Answer'} />
      
      <ValueLine title={'Heildarkostnaður'} value={'Answer'} />
      
      <ValueLine title={'Fjöldi ára sem koma til endurgreiðslu á kostnaði'} value={'Answer'} />
      
      <ValueLine title={'Fylgiskjöl'} value={'Answer'} />
    
    </>
  )
}
