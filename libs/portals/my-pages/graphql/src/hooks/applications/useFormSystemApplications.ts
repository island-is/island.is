import { useLocalizedQuery } from '@island.is/localization'
import { gql } from '@apollo/client'

export const FORM_SYSTEM_APPLICATIONS = gql`
  query myPagesApplications($locale: String) {
    formSystemMyPagesApplications(locale: $locale) {
      id
      created
      modified
      applicant
      state
      typeId
      name
      progress
      status
      institution
      formSystemFormSlug
      formSystemOrgContentfulId
      formSystemOrgSlug
      pruned
      actionCard {
        draftTotalSteps
        draftFinishedSteps
        tag {
          label
          variant
        }
        pendingAction {
          title
        }
      }
    }
  }
`

export const useFormSystemApplications = () => {
  const { data, loading, error, refetch } = useLocalizedQuery(
    FORM_SYSTEM_APPLICATIONS,
    {
      variables: {
        input: { scopeCheck: true },
      },
    },
  )

  return {
    data: data?.formSystemMyPagesApplications ?? [],
    loading,
    error,
    refetch,
  }
}
