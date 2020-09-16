import React, { FC } from 'react'
import slugify from '@sindresorhus/slugify'
import { Html } from '@island.is/api/schema'
import {
  Stack,
  Typography,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import { renderSlices } from '../richTextRendering'

export interface FaqListProps {
  title: string
  questions: {
    id: string
    question: string
    answer: Html
  }[]
}

export const FaqList: FC<FaqListProps> = ({ title, questions }) => {
  return (
    <Stack space={6}>
      <Typography variant="h2" as="h2">
        <span data-sidebar-link={slugify(title)}>{title}</span>
      </Typography>
      <Accordion>
        {questions.map(({ id, question, answer }) => (
          <AccordionItem key={id} id={`faq_${id}`} label={question}>
            {renderSlices(answer)}
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  )
}

export default FaqList
