import { useIntl } from 'react-intl'

import { Box, Icon, LinkV2, Tag, Text } from '@island.is/island-ui/core'

import { m } from '../../screens/OfficialJournalOfIceland/messages'
import { formatDate } from './OJOIUtils'
import * as s from './OJOIAdvertCard.css'

type Props = {
  institution?: string | null
  department?: string | null
  publicationNumber?: string | null
  publicationDate?: string | null
  title?: string | null
  categories?: string[] | null
  link?: string | null
}

export const OJOIAdvertCard = ({
  institution,
  department,
  publicationNumber,
  publicationDate,
  title,
  categories,
  link,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box display="flex" flexDirection="column" rowGap={1} className={s.wrapper}>
      {(institution || department || publicationDate) && (
        <Box display="flex" justifyContent="spaceBetween">
          {institution && (
            <Box>
              <Text variant="eyebrow" color="blueberry400">
                {institution}
              </Text>
            </Box>
          )}
          {(department || publicationDate) && (
            <Box>
              <Text variant="eyebrow" color="blueberry400">
                {department}
                {department && publicationDate && ' - '}
                {publicationDate &&
                  `Útg: ${formatDate(publicationDate, 'd.M.yyyy')}`}
              </Text>
            </Box>
          )}
        </Box>
      )}
      {publicationNumber && (
        <Box>
          <Text variant="h3">{publicationNumber}</Text>
        </Box>
      )}
      {title && (
        <Box>
          <Text>{title}</Text>
        </Box>
      )}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="spaceBetween"
        marginTop={2}
        rowGap={1}
      >
        {categories && categories.length > 0 && (
          <Box display="flex" rowGap={1} columnGap={1} flexWrap="wrap">
            {categories.map((cat) => {
              return (
                <Tag key={cat} variant="blue" outlined disabled>
                  {cat}
                </Tag>
              )
            })}
          </Box>
        )}
        {link && (
          <LinkV2
            href={link}
            color="blue400"
            underline="normal"
            underlineVisibility="always"
          >
            <Text as="span" fontWeight="medium" variant="small">
              {formatMessage(m.general.seeMore)}
            </Text>{' '}
            <Icon icon="open" type="outline" size="small" />
          </LinkV2>
        )}
      </Box>
    </Box>
  )
}
