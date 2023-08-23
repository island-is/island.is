import React from 'react'
import { useIntl } from 'react-intl'

import useIndictmentCounts from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { Accordion, AccordionItem, Text } from '@island.is/island-ui/core'
import { lawsBrokenAccordion } from '@island.is/judicial-system-web/messages/Core/lawsBrokenAccordion'

interface Props {
  workingCase: Case
}

export const useIndictmentsLawsBroken = (workingCase: Case) => {
  const { lawTag } = useIndictmentCounts()
  const lawsBroken = new Set<React.JSX.Element | null | undefined>()

  workingCase.indictmentCounts?.map((indictmentCount) =>
    indictmentCount.lawsBroken?.map((lawBroken) =>
      lawsBroken.add(
        <div>
          <Text>{lawTag(lawBroken)}</Text>
        </div>,
      ),
    ),
  )

  return lawsBroken
}

const IndictmentsLawsBrokenAccordionItem: React.FC<Props> = (props) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  return (
    <Accordion>
      <AccordionItem
        labelVariant="h3"
        id="lawsBrokenAccordionItem"
        label={formatMessage(lawsBrokenAccordion.heading)}
      >
        {lawsBroken}
      </AccordionItem>
    </Accordion>
  )
}

export default IndictmentsLawsBrokenAccordionItem
