import React, { useState } from 'react'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Swiper,
} from '@island.is/island-ui/core'
import { LifeEventCard } from './components/LifeEventCard'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

const demoData = [
  {
    title: 'Að eignast barn',
    intro:
      'Allt frá meðgöngu að fæðingu, nafngjöf og fyrstu mánuðunum í lífi barnsins.',
    url: '/',
    image:
      'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
    thumbnail:
      'https://images.ctfassets.net/8k0h54kbe6bj/27zQiwe9955vZHXxOeqMkO/9bcfc6f0cdbaa8c9d5cdfd9144de94bd/life-event-ad-eignast-barn.png',
  },
  {
    title: 'Að flytja',
    intro:
      'Að flytja innanlands, utan úr heimi eða til útlanda. Umsóknir, skyldur og það sem þarf að hafa í huga.',
    url: '/',
    image:
      'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
    thumbnail:
      'https://images.ctfassets.net/8k0h54kbe6bj/4uI4AHH4fpT052SPhrfBsG/f2cd83c61a86ceb248c8f43880ff34fb/life-event-ad-flytja.png',
  },
  {
    title: 'Að stofna fyrirtæki ',
    intro:
      'Öll tilskilin leyfi og upplýsingar sem þarf til að stofna fyrirtæki á Íslandi og hefja rekstur.',
    url: '/',
    image:
      'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
    thumbnail:
      'https://images.ctfassets.net/8k0h54kbe6bj/6IcelQ8gMAhHgfaiaKueWG/0b3ccb56ed29032e01d0a56d10c35736/life-event-ad-stofna-fyrirtaeki.png',
  },
  {
    title: 'Að fara á eftirlaun',
    intro:
      'Hvenær, hvernig og hvers vegna og svo framvegis, réttindi og þjónusta sem er í boði fyrir eftirlaunaþega.',
    url: '/',
    image:
      'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
    thumbnail:
      'https://images.ctfassets.net/8k0h54kbe6bj/56X1rykxSuc1UhasQcVhpY/589dd0d3ea56c5caf6179700dd7c9b5a/life-event-eftirlaun.png',
  },
  {
    title: 'Að fara í nám',
    intro:
      'Námsframboð og svo framvegis, námsmat og tengingar við erlenda skóla eða eitthvað.',
    url: '/',
    image:
      'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
    thumbnail:
      'https://images.ctfassets.net/8k0h54kbe6bj/7LZaYygQz3dGjUHIzCxQzu/08a2b0a678b03f0c7989d15770866db5/life-event-ad-fara-i-nam.png',
  },
  {
    title: 'Að fara út á vinnumarkaðinn',
    intro:
      'Íslenskur vinnumarkaður, möguleikar, réttindi og það sem þarf að hafa í huga.',
    url: '/',
    image:
      'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
    thumbnail:
      'https://images.ctfassets.net/8k0h54kbe6bj/34onRJ6hfuZAR2hO1jgMhg/700e30d316826b3a77850f1e4e58f6f5/life-event-ad-fara-ut-a-vinnumarkadinn.png',
  },
]

interface LifeEventsSectionProps {
  title?: string
}

const LifeEventsCardsSection: React.FC<LifeEventsSectionProps> = ({
  title = 'Lífsviðburðir',
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const renderMobile = () => (
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12">
          <Typography variant="h3" as="h3" paddingBottom={[2, 2, 4]}>
            {title}
          </Typography>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="12/12">
          <Swiper>
            {demoData.map((lifeEvent) => (
              <LifeEventCard
                key={lifeEvent.title}
                title={lifeEvent.title}
                intro={lifeEvent.intro}
                url={lifeEvent.url}
                image={lifeEvent.image}
                thumbnail={lifeEvent.thumbnail}
              />
            ))}
          </Swiper>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )

  const renderDesktop = () => (
    <GridContainer>
      <GridRow>
        <GridColumn span={['6/12', '6/12', '12/12']}>
          <Typography variant="h3" as="h3" paddingBottom={4}>
            {title}
          </Typography>
        </GridColumn>
      </GridRow>
      <GridRow>
        {demoData.map((lifeEvent) => (
          <GridColumn
            span={['12/12', '12/12', '6/12', '6/12', '4/12']}
            paddingBottom={3}
            key={lifeEvent.title}
          >
            <LifeEventCard
              title={lifeEvent.title}
              intro={lifeEvent.intro}
              url={lifeEvent.url}
              image={lifeEvent.image}
              thumbnail={lifeEvent.thumbnail}
            />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )

  return isMobile ? renderMobile() : renderDesktop()
}

export default LifeEventsCardsSection
