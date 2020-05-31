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
  const { ssn } = router.query
  const [submition, setSubmition] = useState<
    'pending' | 'rejected' | 'approved'
  >('pending')
  const { data } = useQuery(GetCompanyQuery, { variables: { ssn } })
  if (!data) {
    return <div>Loading...</div>
  }

  const {
    getCompany: { company },
  } = data

  const onSubmit = (isSuccess: boolean) => {
    if (isSuccess) {
      setSubmition('approved')
    } else {
      setSubmition('rejected')
    }
  }

  if (company.application?.state === 'approved' || submition === 'approved') {
    return <Congratulations />
  } else if (submition === 'rejected') {
    return <NotQualified />
  }

  return <Signup company={company} handleSubmition={onSubmit} />
}

export default Company
