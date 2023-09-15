import { Box, Text, ItemCmpProps } from '@island.is/island-ui/core'
import React, { FC, ReactElement } from 'react'

interface CompanySearchItemProps extends ItemCmpProps {
  name: string
  nationalId: string
  query: string
}

const escapeRegexp = (query: string) => {
  return query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}

export const CompanySearchItem: FC<
  React.PropsWithChildren<CompanySearchItemProps & { loading?: boolean }>
> = ({ active, nationalId, query, name }): ReactElement => {
  const cleanedQuery = escapeRegexp(query)
  const splitCompanyName = name.split(new RegExp(cleanedQuery, 'i'))
  let cleanNationalId = nationalId.replace(/(\D)+/g, '')
  cleanNationalId =
    cleanNationalId.substring(0, 6) + '-' + cleanNationalId.substring(6, 10)
  const splitNationalId = cleanNationalId.split(query)
  return (
    <Box
      key={`searchItem_${nationalId}`}
      cursor="pointer"
      outline="none"
      padding={2}
      role="button"
      background={active ? 'white' : 'blue100'}
      display="flex"
      flexDirection={['column', 'row']}
      justifyContent={['flexStart', 'spaceBetween']}
    >
      <Text
        variant="h4"
        fontWeight="light"
        color={active ? 'blue400' : undefined}
      >
        {splitCompanyName.map((elem, index) => (
          <span
            style={{ textTransform: 'capitalize' }}
            key={`name-${elem}-${index}`}
          >
            <strong>{elem}</strong>
            {index + 1 < splitCompanyName.length ? <span>{query}</span> : null}
          </span>
        ))}
      </Text>
      <Text
        variant="h4"
        fontWeight="light"
        color={active ? 'blue400' : undefined}
      >
        {splitNationalId.map((elem, index) => (
          <span key={`nationalId-${elem}-${index}`}>
            <strong>{elem}</strong>
            {index + 1 < splitNationalId.length ? <span>{query}</span> : null}
          </span>
        ))}
      </Text>
    </Box>
  )
}
