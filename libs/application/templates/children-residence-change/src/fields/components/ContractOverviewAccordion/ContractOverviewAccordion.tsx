import React from 'react'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { CRCApplication } from '../../../types'
import ContractOverview from '../ContractOverview/ContractOverview'

interface Props {
  application: CRCApplication
  title: string
  id: string
}

const ContractAccordionOverview = ({ application, title, id }: Props) => {
  return (
    <Box paddingX={4} paddingY={2} border="standard">
      <Accordion singleExpand dividerOnBottom={false} dividerOnTop={false}>
        <AccordionItem id={id} label={title}>
          <ContractOverview application={application} />
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default ContractAccordionOverview
