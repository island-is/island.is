import {
  Box,
  Button,
  Filter,
  FilterInput,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  Typography,
} from '@island.is/island-ui/core'
import * as styles from './DomainList.css'
import MockData from '../../lib/MockData'
import { useState } from 'react'

const DomainList = () => {
  const [inputSearchValue, setInputSearchValue] = useState('')

  return (
    <GridContainer className={styles.relative}>
      <Stack space={[2, 2, 3, 3]}>
        <GridRow>
          <Filter
            variant={'popover'}
            align="left"
            reverse
            labelClear={'Hreinsa'}
            labelClearAll={'Hreinsa allt'}
            labelOpen={'Sía'}
            labelClose={'Loka'}
            resultCount={0}
            filterInput={
              <FilterInput
                placeholder={'Leita'}
                name="session-nationalId-input"
                value={inputSearchValue}
                onChange={setInputSearchValue}
                backgroundColor="blue"
              />
            }
            onFilterClear={() => {
              setInputSearchValue('')
            }}
          />
        </GridRow>
        <Stack space={[1, 1, 2, 2]}>
          {MockData.map((item) => (
            <GridRow>
              <Box
                onClick={() => {
                  window.location.href = `/stjornbord/innskraningarkerfi/${item.id}/`
                }}
                display={'flex'}
                borderRadius={'large'}
                border={'standard'}
                width={'full'}
                paddingX={4}
                paddingY={3}
                justifyContent={'spaceBetween'}
                alignItems={'center'}
              >
                <Box>
                  <Stack space={1}>
                    <Typography variant={'h3'} color={'blue400'}>
                      {item.title}
                    </Typography>
                    <Typography variant={'p'}>{item.domain}</Typography>
                    <Box
                      display={'flex'}
                      flexDirection={'row'}
                      columnGap={'gutter'}
                    >
                      <Button
                        onClick={() => {
                          window.location.href = `/stjornbord/innskraningarkerfi/${item.id}/`
                        }}
                        size="small"
                        variant="text"
                      >
                        {item.numberOfApplications + ' applications'}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/stjornbord/innskraningarkerfi/${item.id}/vefthjonustur`
                        }}
                        size="small"
                        variant="text"
                      >
                        {item.numberOfApplications + ' APIs'}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
                <Box
                  display="flex"
                  flexDirection={['column', 'column', 'row', 'row', 'row']}
                  alignItems={'flexEnd'}
                  justifyContent={'flexEnd'}
                >
                  {item.tags.map((tag) => (
                    <Box margin={1}>
                      <Tag variant="purple" outlined>
                        {tag}
                      </Tag>
                    </Box>
                  ))}
                </Box>
              </Box>
            </GridRow>
          ))}
        </Stack>
      </Stack>
    </GridContainer>
  )
}

export default DomainList
