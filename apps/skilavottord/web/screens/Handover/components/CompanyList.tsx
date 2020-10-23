import React from 'react'
import { Box } from '@island.is/island-ui/core'
import CompanyListItem from './CompanyListItem'

const CompanyList = () => {
  const companies = [
    {
      name: 'Hringrás (Reykjavik)',
      address: 'Klettagarðar 9, 105 Reykjavík',
      phone: '+354 555 1900',
      website: 'www.hringras.is',
    },
    {
      name: 'VAKA (Reykjavik)',
      address: 'Héðinsgata 2, 105 Reykjavík',
      phone: '+354 555 1900',
      website: 'www.vaka.is',
    },
    {
      name: 'Hringrás (Akureyi)',
      address: 'Ægisnesi 1, 105 Akureyri',
      phone: '+354 555 1900',
      website: 'www.hringras.is',
    },
  ]

  return (
    <Box>
      {companies.map((company, index) => (
        <CompanyListItem key={index} {...company} />
      ))}
    </Box>
  )
}

export default CompanyList
