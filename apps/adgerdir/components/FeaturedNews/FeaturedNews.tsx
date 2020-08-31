import React, { FC } from 'react'
import cn from 'classnames'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
  Typography,
  Button,
} from '@island.is/island-ui/core'
import { Heading, Image } from '@island.is/adgerdir/components'

import * as styles from './FeaturedNews.treat'

interface FeaturedNewsProps {}

const image = {
  url: '/img.jpg',
  title: 'ok',
  contentType: 'jpeg',
  width: 800,
  height: 400,
}

export const FeaturedNews: FC<FeaturedNewsProps> = ({ children }) => {
  return (
    <Box paddingX={[1, 1, 1, 1, 6]}>
      <GridContainer>
        <GridRow>
          <GridColumn span={[12, 12, 12, 12, 10]} offset={[0, 0, 0, 0, 1]}>
            <Box marginBottom={[6, 6, 10]}>
              <Box marginBottom={[3, 3, 3, 3, 6]}>
                <Image type="apiImage" image={image} />
              </Box>
              <Stack space={3}>
                <Heading
                  subtitle="Aðgerðir í menntamálum"
                  title="Umhyggja, sveigjanleiki og þrautseigja verði leiðarljós í skólastarfi"
                  intro="Fulltrúar lykilaðila í starfsemi leik- og grunnskóla undirrituðu í dag sameiginlega yfirlýsingu um leiðarljós skólanna á komandi skólaári."
                />
                <Typography variant="p">
                  Í yfirlýsingunni er áréttað mikilvægi þess að skólastarf fari
                  fram með eins hefðbundnum hætti og frekast er unnt og réttur
                  allra nemenda til náms sé tryggður.
                </Typography>
                <Typography variant="p">
                  „Saman munum við gera allt hvað við getum til að tryggja áfram
                  skólastarf þar sem menntun, vellíðan og öryggi nemenda og
                  starfsfólks er í forgangi. Umhyggja, sveigjanleiki og
                  þrautseigja verða leiðarljós þeirrar samvinnu,“ segir m.a. í
                  yfirlýsingunni.
                </Typography>
                <Button variant="text" icon="arrowRight">
                  Lesa meira
                </Button>
              </Stack>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Box className={styles.centeredBorder} marginBottom={[6, 6, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn span={[12, 12, 12, 12, 10]} offset={[0, 0, 0, 0, 1]}>
              <Box className={styles.topBorder}></Box>
            </GridColumn>
            <GridColumn span={[12, 12, 12, 5, 4]} offset={[0, 0, 0, 0, 1]}>
              <Box marginY={10}>
                <Image type="apiImage" image={image} />
              </Box>
              <Stack space={3}>
                <Heading
                  main={false}
                  subtitle="Aðgerðir í menntamálum"
                  title="Umhyggja, sveigjanleiki og þrautseigja verði leiðarljós í skólastarfi"
                  intro="Fulltrúar lykilaðila í starfsemi leik- og grunnskóla undirrituðu í dag sameiginlega yfirlýsingu um leiðarljós skólanna á komandi skólaári."
                  variant="h3"
                  as="h3"
                />
                <Button variant="text" icon="arrowRight">
                  Lesa meira
                </Button>
              </Stack>
            </GridColumn>
            <GridColumn span={[12, 12, 12, 5, 4]} offset={[0, 0, 0, 2, 2]}>
              <Box marginY={10}>
                <Image type="apiImage" image={image} />
              </Box>
              <Stack space={3}>
                <Heading
                  main={false}
                  subtitle="Aðgerðir í menntamálum"
                  title="Umhyggja, sveigjanleiki og þrautseigja verði leiðarljós í skólastarfi"
                  intro="Fulltrúar lykilaðila í starfsemi leik- og grunnskóla undirrituðu í dag sameiginlega yfirlýsingu um leiðarljós skólanna á komandi skólaári."
                  variant="h3"
                  as="h3"
                />
                <Button variant="text" icon="arrowRight">
                  Lesa meira
                </Button>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}

export default FeaturedNews
