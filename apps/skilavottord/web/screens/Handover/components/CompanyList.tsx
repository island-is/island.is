import React from 'react'
import CompanyListItem from './CompanyListItem'

const CompanyList = () => {
  const companies = [
    {
      name: 'Company 1',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 2',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 3',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
  ]

  return (
    <>
      {companies.map((company, index) => (
        <CompanyListItem key={index} {...company} />
      ))}
    </>
  )
}

export default CompanyList
