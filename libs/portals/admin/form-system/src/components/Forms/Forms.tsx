import { useContext, useEffect } from "react"
import { TableRowHeader } from "../TableRow/TableRowHeader"
import { FormsContext } from "../../context/FormsContext"
import { TableRow } from "../TableRow/TableRow"
import { useLazyQuery } from "@apollo/client"
import { GET_FORMS } from '@island.is/form-system/graphql'


export const Forms = () => {
  const { forms, setForms, organizations, setOrganizations, isAdmin, organizationNationalId } = useContext(FormsContext)
  const [getFormsQuery] = useLazyQuery(GET_FORMS, { fetchPolicy: 'no-cache' })

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizations.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizations(updatedOrganizations)

    const { data } = await getFormsQuery({
      variables: {
        input: {
          nationalId: selected.value,
        },
      },
    })
    if (data?.formSystemForms?.forms) {
      setForms(data.formSystemForms.forms)
    }
  }

  useEffect(() => {
    if (isAdmin && organizationNationalId) {
      handleOrganizationChange({ value: organizationNationalId })
    }
  }, [])

  return (
    <>
      <TableRowHeader />
      {forms &&
        forms?.map((f) => {
          return (
            <TableRow
              key={f?.id}
              id={f?.id}
              name={f?.name?.is ?? ''}
              org={f?.organizationId}
              isHeader={false}
              translated={f?.isTranslated ?? false}
              slug={f?.slug ?? ''}
              beenPublished={f?.beenPublished ?? false}
              setFormsState={setForms}
            />
          )
        })}
    </>
  )
}