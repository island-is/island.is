import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Text,
  Button,
} from '@island.is/island-ui/core'
import Link from 'next/link'

import img from '../../../assets/images/educationLicense.svg'

const ContactBanner = ({ slug }: { slug?: string }) => {
  let link = '/s/stafraent-island/hafa-samband'

  switch (slug) {
    case 'syslumenn':
      link = '/thjonustuvefur/syslumenn/hafa-samband'
      break
    default:
      break
  }

  return (
    <Box background="purple100" padding={[7, 10, 10]} borderRadius="large">
      <GridRow>
        <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
          <Text variant="h3" as="h3" marginBottom={2}>
            {'Finnurðu ekki það sem þig vantar?'}
          </Text>
          <Text variant="intro" marginBottom={[5, 10]}>
            {'Hvernig getum við aðstoðað?'}
          </Text>
          <Link href={link}>
            <Button type="button" variant="ghost" icon="arrowForward">
              Hafa samband
            </Button>
          </Link>
        </GridColumn>
        <GridColumn
          span={['8/8', '2/8']}
          offset={['0', '0', '1/8']}
          order={[2, 1]}
        >
          <Box textAlign={['center', 'right']} padding={[6, 0]}>
            <img src={img} alt="" />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default ContactBanner
