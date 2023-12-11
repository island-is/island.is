import { FC } from 'react'
import slugify from '@sindresorhus/slugify'
import { Locale } from 'locale'
import {
  Stack,
  Text,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import { Slice as SliceType, richText } from '../..'

export interface FaqListProps {
  title: string
  questions: {
    id: string
    question: string
    answer?: SliceType[]
  }[]
  showTitle?: boolean
  locale?: Locale
}

export const FaqList: FC<React.PropsWithChildren<FaqListProps>> = ({
  title,
  questions,
  showTitle = true,
  locale = 'is',
}) => {
  return (
    <Stack space={6}>
      {title && showTitle !== false && (
        <Text variant="h2" as="h2">
          <span data-sidebar-link={slugify(title)}>{title}</span>
        </Text>
      )}
      <Accordion>
        {questions.map(({ id, question, answer }) => {
          return (
            <AccordionItem
              key={id}
              id={`faq_${id}`}
              label={question}
              labelUse="h2"
            >
              {richText(answer as SliceType[], undefined, locale)}
            </AccordionItem>
          )
        })}
      </Accordion>
    </Stack>
  )
}

export default FaqList
