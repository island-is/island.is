import React, { FC } from 'react'
import slugify from '@sindresorhus/slugify'
import { Document } from '@contentful/rich-text-types'
import {
  Stack,
  Text,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import { Slice as SliceType } from '../richTextRendering'
import { richText } from '../RichTextRC/RichText'
export interface FaqListProps {
  title: string
  questions: {
    id: string
    question: string
    answer?: SliceType[]
  }[]
}

export const FaqList: FC<FaqListProps> = ({ title, questions }) => {
  return (
    <Stack space={6}>
      <Text variant="h2" as="h2">
        <span data-sidebar-link={slugify(title)}>{title}</span>
      </Text>
      <Accordion>
        {questions.map(({ id, question, answer }) => {
          return (
            <AccordionItem key={id} id={`faq_${id}`} label={question}>
              {richText(answer as SliceType[], undefined)}
            </AccordionItem>
          )
        })}
      </Accordion>
    </Stack>
  )
}

export default FaqList
