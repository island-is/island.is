import {
  Box,
  Button,
  GridContainer,
  GridRow,
  Tag,
  Typography,
} from '@island.is/island-ui/core'
import { Link, useParams } from 'react-router-dom'
import MockApplications from '../../lib/MockApplications'

const Applications = () => {
  const { tenant } = useParams()
  return (
    <GridContainer>
      <GridRow rowGap={3}>
        <Box display={'flex'} justifyContent={'spaceBetween'} columnGap={4}>
          <Box>
            <Typography variant={'h2'}>Applications</Typography>
            <Typography variant={'p'}>
              Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae
              mauris accumsan at tellus facilisi.
            </Typography>
          </Box>
          <Box>
            <Button>Create Application</Button>
          </Box>
        </Box>
      </GridRow>
      <GridRow marginTop={'gutter'}>
        {MockApplications.map((item) => (
          <Box
            marginTop={'gutter'}
            padding={'gutter'}
            borderRadius={'large'}
            border={'standard'}
            width={'full'}
          >
            <Typography variant={'h3'}>
              <Link to={'/innskraningarkerfi/' + tenant + '/forrit/' + item.id}>
                {item.name}{' '}
              </Link>
            </Typography>
            <Typography variant={'p'}>{item.tenant}</Typography>
            {item.environmentTags.map((tag) => (
              <Tag>{tag}</Tag>
            ))}
          </Box>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default Applications
