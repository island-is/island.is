import { useIntl } from 'react-intl'

import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  LinkV2,
  Tag,
  Text,
} from '@island.is/island-ui/core'

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
    <Box className={s.wrapper}>
      <GridRow>
        <GridColumn span={'6/12'}>
          {institution && (
            <Box>
              <Text variant="eyebrow" color="blueberry400">
                {institution}
              </Text>
            </Box>
          )}
        </GridColumn>
        <GridColumn span={'6/12'}>
          {(department || publicationDate) && (
            <Box display="flex" justifyContent="flexEnd">
              <Text variant="eyebrow" color="blueberry400">
                {department}
                {department && publicationDate && ' - '}
                {publicationDate &&
                  `Útg: ${formatDate(publicationDate, 'd.M.yyyy')}`}
              </Text>
            </Box>
          )}
        </GridColumn>
      </GridRow>
      <GridRow marginTop={1}>
        <GridColumn span={'12/12'}>
          {publicationNumber && (
            <Box>
              <Text variant="h3">{publicationNumber}</Text>
            </Box>
          )}
        </GridColumn>
      </GridRow>
      <GridRow marginTop={1}>
        <GridColumn span={'9/12'}>
          {title && (
            <Box>
              <Text>{title}</Text>
            </Box>
          )}

          {categories && categories.length > 0 && (
            <Box
              marginTop={2}
              display="flex"
              rowGap={1}
              columnGap={1}
              flexWrap="wrap"
            >
              {categories.map((cat) => {
                return (
                  <Tag key={cat} variant="blue" outlined disabled>
                    {cat}
                  </Tag>
                )
              })}
            </Box>
          )}
        </GridColumn>
        <GridColumn span={'3/12'}>
          {link && (
            <Box
              display="flex"
              height="full"
              justifyContent="flexEnd"
              alignItems="flexEnd"
            >
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
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
