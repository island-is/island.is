import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Helpdesk } from '@island.is/api/schema'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'

const UPDATE_HELP_DESK_MUTATION = gql`
  mutation UpdateHelpDeskMutation(
    $organisationId: String!
    $helpdeskId: String!
    $helpdesk: UpdateHelpdeskInput!
  ) {
    updateHelpdesk(
      organisationId: $organisationId
      helpdeskId: $helpdeskId
      helpdesk: $helpdesk
    ) {
      email
      phoneNumber
    }
  }
`

export type HelpDeskInput = Pick<Helpdesk, 'id' | 'email' | 'phoneNumber'>

export const useUpdateHelpDesk = (organisationId: string) => {
  const [updateHelpDeskMutation, { called, loading, error }] = useMutation(
    UPDATE_HELP_DESK_MUTATION,
  )

  const { formatMessage } = useLocale()
  const errorMsg = formatMessage(m.SingleProviderUpdateInformationError)
  const successMsg = formatMessage(m.SingleProviderUpdateInformationSuccess)
  React.useEffect(() => {
    if (!called) {
      return
    } else if (!loading && error) {
      toast.error(errorMsg)
    } else if (!loading) {
      toast.success(successMsg)
    }
  }, [called, loading, error, errorMsg, successMsg])

  const updateHelpDesk = (helpDesk: HelpDeskInput) => {
    const { id, ...helpdesk } = helpDesk
    updateHelpDeskMutation({
      variables: {
        organisationId,
        helpdeskId: id,
        helpdesk,
      },
    })
  }

  return {
    updateHelpDesk,
    loading,
  }
}
