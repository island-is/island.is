import {
  ActionCard,
  Box,
  DropdownMenu,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Text,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { SignatureCollectionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SignatureList } from '@island.is/api/schema'
import { format } from 'date-fns'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { searchWidth } from '../styles.css'
import { useDebounce } from 'react-use'
import img from '../../../assets/img.jpg'

const Lists = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const lists = useLoaderData() as SignatureList[]
  const [searchFor, setSearchFor] = useState('')
  const [allLists, setAllLists] = useState(lists)

  const onSearch = (searchTerm: string) => {
    if (searchTerm.length) {
      const searchResults = lists.filter((list: SignatureList) => {
        return (
          list.owner.name.toLowerCase().includes(searchTerm) ||
          list.area.name.toLowerCase().includes(searchTerm) ||
          list.owner.nationalId.includes(searchTerm)
        )
      })

      setAllLists(searchResults)
      console.log(allLists)
    } else {
      setAllLists(lists)
    }
  }

  useDebounce(
    () => {
      onSearch(searchFor)
    },
    500,
    [lists, searchFor],
  )

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn span={['3/12']}>
          <Hidden below="md">
            <PortalNavigation
              navigation={signatureCollectionNavigation}
              title={formatMessage(m.signatureListsTitle)}
            />
          </Hidden>
        </GridColumn>
        <GridColumn
          offset={['0', '0', '1/12']}
          span={['12/12', '12/12', '8/12']}
        >
          <IntroHeader
            title={formatMessage(m.signatureListsTitle)}
            intro={formatMessage(m.signatureListsIntro)}
            img={img}
            imgPosition="right"
          />
          <Box display={['block', 'flex']} marginBottom={[5, 10]}>
            <Box className={searchWidth} marginRight={2}>
              <FilterInput
                name="searchList"
                value={searchFor}
                onChange={(v) => setSearchFor(v)}
                placeholder={formatMessage(m.searchInAllListsPlaceholder)}
              />
            </Box>
            <Box marginTop={[2, 0]}>
              <DropdownMenu
                title={formatMessage(m.filterLists)}
                icon="filter"
                items={[]}
              />
            </Box>
          </Box>
          {allLists && allLists.length > 0 ? (
            <Stack space={5}>
              {allLists.map((list: SignatureList) => {
                return (
                  <ActionCard
                    key={list.id}
                    eyebrow={
                      formatMessage(m.listDateTil) +
                      ': ' +
                      format(new Date(list.endTime), 'dd.MM.yyyy')
                    }
                    heading={list.owner.name + ' - ' + list.area.name}
                    text={formatMessage(m.collectionTitle)}
                    progressMeter={{
                      currentProgress: list.numberOfSignatures ?? 0,
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                    cta={{
                      label: formatMessage(m.viewList),
                      variant: 'text',
                      icon: 'arrowForward',
                      onClick: () => {
                        navigate(
                          SignatureCollectionPaths.SignatureList.replace(
                            ':id',
                            list.id,
                          ),
                        )
                      },
                    }}
                  />
                )
              })}
            </Stack>
          ) : searchFor.length > 0 ? (
            <Box display="flex">
              <Text>{formatMessage(m.noListsFoundBySearch)}</Text>
              <Box marginLeft={1}>
                <Text variant="h5">{searchFor}</Text>
              </Box>
            </Box>
          ) : (
            <Text>{formatMessage(m.noLists)}</Text>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Lists
