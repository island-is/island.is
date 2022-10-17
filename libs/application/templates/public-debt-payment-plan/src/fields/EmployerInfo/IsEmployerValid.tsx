import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { gql, useQuery } from '@apollo/client'
import {
  AccordionCard,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { employer } from '../../lib/messages'

const GET_EMPLOYER_VALID = gql`
  query GetEmployerValid($input: GetEmployerValidInput!){
    getEmployerValid(input: $input) {
      valid
    }
  } {
  `

export const IsEmployerValid: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { loading, error, data } = useQuery(GET_EMPLOYER_VALID, {
    variables: { companyId: '5902697199' },
  })
  return (
    <Box>
      {loading}
      {console.log(data)}
      <Box marginY={5}>
        <AlertMessage
          type="error"
          title={formatText(
            employer.general.employerIsNotValid,
            application,
            formatMessage,
          )}
        />
      </Box>
    </Box>
  )
}
