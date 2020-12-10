import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { defineMessage } from 'react-intl'

interface Props {
  name: string
  value: number
}

export const StatisticBox: FC<Props> = ({ name, value }) => {
  const { formatMessage } = useLocale()

  //   const familyRelationLabel =
  //     familyRelation === 'child'
  //       ? defineMessage({
  //           id: 'sp.family:child',
  //           defaultMessage: 'Barn',
  //         })
  //       : familyRelation === 'spouse'
  //       ? defineMessage({
  //           id: 'sp.family:spouse',
  //           defaultMessage: 'Maki',
  //         })
  //       : defineMessage({
  //           id: 'sp.family:family-member',
  //           defaultMessage: 'Fjölskyldumeðlimur',
  //         })

  return (
    <Box
      marginRight={1}
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Box>
        <Text variant="h2" color="blue400">
          {value} <Text>thus</Text>
        </Text>
      </Box>
      <Box>
        <Text fontWeight="semiBold">{name}</Text>
      </Box>
    </Box>
  )
}
