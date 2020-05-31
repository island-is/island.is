import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { Signup, Congratulations, NotQualified } from './components'

export const GetCompanyQuery = gql`
  query GetCompanyQuery($ssn: String!) {
    getCompany(ssn: $ssn) {
      company {
        ssn
        name
        application {
          id
          name
          email
          state
          companySSN
          serviceCategory
          generalEmail
          webpage
          phoneNumber
          approveTerms
          companyName
          companyDisplayName
        }
      }
    }
  }
`

function Company() {
  const router = useRouter()
  const [notQualified, setNotQualified] = useState(false)

  const { ssn } = router.query
  const { data } = useQuery(GetCompanyQuery, { variables: { ssn } })
  if (!data) {
    return <div>Loading...</div>
  }

  const {
    getCompany: { company },
  } = data

  const onSubmit = (values) => {
    if (values.noneOfTheAbove) {
      setNotQualified(true)
    } else {
      setCompany({ ...company, state: 'approved' })
    }
  }

  if (company.state === 'approved') {
    return <Congratulations />
  }

  if (notQualified) {
    return <NotQualified />
  }

  return <Signup company={company} onSubmit={onSubmit} />
}

export default Company
