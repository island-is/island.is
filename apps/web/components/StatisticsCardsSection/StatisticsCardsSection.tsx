import React from 'react'
import { GridContainer, Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { StatisticsCard, SimpleSlider } from '@island.is/web/components'

interface StatisticsSectionProps {
  title?: string
}

export const StatisticsCardsSection = ({ title }: StatisticsSectionProps) => {
  // TODO: Get this data from contnetful, this is just placeholders
  const statistics = [
    {
      __typename: 'statistics',
      id: '2F6n9qoAWTG1ekp12VTQOD',
      title: 'Stafræn ökuskírteini',
      slug: 'ad-eignast-barn',
      intro: '127.895',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/4b7HN4aN9kNhnqo9Ah8l7j/af8770efd74c91e955c4511b93a9f422/Barnavagn.svg',
        title: 'Barnavagn',
      },
    },
    {
      __typename: 'statistics',
      id: '62xAXAZgossE07lA4ZT7MO',
      title: 'Að missa ástvin',
      slug: 'ad-missa-astvin',
      intro: '57%',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/5puYInS6veEwVM8O42vjK4/5f8d48990e49f365851ffe3cf19786b9/Artboard_28_copy_11.svg',
        title: 'Að missa ástvin - lítil mynd',
      },
    },
    {
      __typename: 'statistics',
      id: '5SMAerVNcWJZ5dsVBLKkAL',
      title: 'Að fara á eftirlaun',
      slug: 'ad-fara-a-eftirlaun',
      intro: '43.900',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/4FAZsUMVGK6y2PV66xgt7V/78d3baa5eeba5ed82eeb2bd1ebed7185/V__kva_bl__m____potti.svg',
        title: 'Vökva blóm í potti',
      },
    },
    {
      __typename: 'statistics',
      id: '3sb9ux26eA4S3qxqDMziv3',
      title: 'Að fara út á vinnumarkaðinn',
      slug: 'ad-fara-ut-a-vinnumarkadinn',
      intro: '3/5',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/1nD4rfYzOTAq9HMpcW7cIX/d3d1217e965221eff220e8101bcab34b/Takast____hendur.svg',
        title: 'Takast í hendur',
      },
    },
    {
      __typename: 'statistics',
      id: '3Ijidl3zaUPkC9qIqfXqpY',
      title: 'Að flytja',
      slug: 'ad-flytja',
      intro: '89%',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/2EDkQe6XP3QlGRJpD9D1dY/8f21070d13a2bb3047d0fd1d24b34a47/Kassar_og_vasi.svg',
        title: 'Kassar og vasi',
      },
    },
    {
      __typename: 'statistics',
      id: '1nWCYhKhUGfWYGQVfHcUR0',
      title: 'Að hefja nám',
      slug: 'ad-hefja-nam',
      intro: '30%',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/4SRNLnIjKtgyqzvuJAyJoV/f115ff17a3611085a98945e03bd8c434/__tskriftarsk__rteini_og_hattur.svg',
        title: 'Útskriftarskírteini og hattur',
      },
    },
    {
      __typename: 'statistics',
      id: '3vTJup1Nk3lwB6AtzhX1ps',
      title: 'Að stofna fyrirtæki',
      slug: 'ad-stofna-fyrirtaeki',
      intro: '123.000',
      thumbnail: {
        __typename: 'Image',
        url:
          '//images.ctfassets.net/8k0h54kbe6bj/2N7hdZuk0mkuQqDonzmG55/47c24e4708515a7848bcac5301ca08c5/Skrifstofust__ll.svg',
        title: 'Skrifstofustóll',
      },
    },
  ]
  return (
    <GridContainer>
      <Box marginTop={[4, 4, 10]}>
        <SimpleSlider
          title={title}
          breakpoints={{
            0: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 1,
              slideWidthOffset: 100,
            },
            [theme.breakpoints.sm]: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 2,
            },
            [theme.breakpoints.md]: {
              gutterWidth: theme.spacing[3],
              slideCount: 2,
            },
            [theme.breakpoints.lg]: {
              gutterWidth: theme.spacing[3],
              slideCount: 3,
            },
          }}
          items={statistics
            .filter((x) => x.slug && x.title)
            .map(({ title, thumbnail, intro }, index) => {
              return (
                <StatisticsCard
                  key={index}
                  title={title}
                  description={intro}
                  image={{
                    title: thumbnail.title,
                    url: thumbnail.url,
                  }}
                />
              )
            })}
          carousleContoler
          logo
        />
      </Box>
    </GridContainer>
  )
}

export default StatisticsCardsSection
