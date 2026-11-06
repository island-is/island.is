import type { FC } from 'react'
import { useContext } from 'react'

import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'

import { getVerdictAppealConclusions } from './VerdictAppealConclusions.logic'

/**
 * The two sets of operative words the Court of Appeals reads side by side: the
 * district court's and, once there is one, its own.
 *
 * Collapsible rather than the blue boxes the other overviews use, because a
 * conclusion runs long and this page carries two of them above everything
 * else. They open expanded and stay open independently - the court is
 * comparing them, so closing one to read the other would be the wrong help.
 */
const VerdictAppealConclusions: FC = () => {
  const { workingCase } = useContext(FormContext)

  const conclusions = getVerdictAppealConclusions(workingCase)

  if (conclusions.length === 0) {
    return null
  }

  return (
    <Box component="section">
      <Accordion singleExpand={false} dividerOnTop={false}>
        {conclusions.map((conclusion) => (
          <AccordionItem
            key={conclusion.id}
            id={conclusion.id}
            label={conclusion.title}
            labelVariant="h3"
            iconVariant="small"
            startExpanded
          >
            <Text textAlign="justify">{conclusion.text}</Text>
            {conclusion.signedBy.length > 0 && (
              <Box marginTop={2}>
                <Text variant="h5" as="p">
                  {conclusion.signedBy.join(', ')}
                </Text>
              </Box>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}

export default VerdictAppealConclusions
