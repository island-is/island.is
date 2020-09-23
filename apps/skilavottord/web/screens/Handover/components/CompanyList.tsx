import React from 'react'
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
