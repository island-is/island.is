import React from 'react'
import { Stack, Typography } from '@island.is/island-ui/core'
import CompanyListItem from './CompanyListItem'

const CompanyList = ({ companies }) => {
  return (
    <>
      {companies.map((company, index) => (
        <CompanyListItem key={index} {...company} />
      ))}
    </>
  )
}

export default CompanyList
