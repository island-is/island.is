import { useState } from 'react'
import { AccordionItem } from '@island.is/island-ui/core'
import { CardLoader } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { AssessmentTable } from '../AssessmentTable'
import { usePrimarySchoolAssessmentResultsLazyQuery } from '../PrimarySchoolAssessment.generated'

interface Props {
  id: string
  name: string
  studentId: string
}

export const AssessmentAccordionItem = ({ id, name, studentId }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [fetchResults, { data, loading, error, called }] =
    usePrimarySchoolAssessmentResultsLazyQuery({
      variables: { studentId, assessmentId: id },
    })

  const results =
    data?.primarySchoolStudent?.assessmentHistory?.[0]?.resultHistory ?? []

  return (
    <AccordionItem
      expanded={expanded}
      id={id}
      label={name}
      onToggle={(isExpanded) => {
        setExpanded(isExpanded)
        if (isExpanded && !called) {
          fetchResults()
        }
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && called && <AssessmentTable results={results} />}
    </AccordionItem>
  )
}
