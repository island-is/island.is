import { Checkbox, Table as T, Text } from '@island.is/island-ui/core'

type Scope = {
  id: string
  nafn: string
  heitiUmbods: string
  lysing: string
  tegundRettinda: string
}

const mockData: Scope[] = [
  {
    id: '1',
    nafn: 'Ísland.is',
    heitiUmbods: 'Rafrænt pósthólf',
    lysing: 'Veitir heimild til að skoða rafrænt pósthólf',
    tegundRettinda: 'Lesa',
  },
  {
    id: '2',
    nafn: 'Ísland.is',
    heitiUmbods: 'Mínar síður: Heilsufarsupplýsingar',
    lysing:
      'Veitir heimild til að lesa heilsu-farsupplýsingar á Mínum síðum inná Ísland.is',
    tegundRettinda: 'Lesa og skrifa',
  },
  {
    id: '3',
    nafn: 'Skatturinn',
    heitiUmbods: 'Skila skattframtali',
    lysing:
      'Veitir heimild til að sjá alfarið um skattaframtal fyrir einstaklinig, færa inn upplýsingar og skila framtali',
    tegundRettinda: 'Lesa og skrifa',
  },
  {
    id: '4',
    nafn: 'Ísafjarðarbær',
    heitiUmbods: 'Velferðarsvið Ísafjarðarbæjar',
    lysing: 'Veitir heimild til að skoða rafrænt pósthólf',
    tegundRettinda: 'Lesa og skrifa',
  },
  {
    id: '5',
    nafn: 'Ísafjarðarbær',
    heitiUmbods: 'Velferðarsvið Ísafjarðarbæjar',
    lysing:
      'Veitir heimild til að lesa heilsu-farsupplýsingar á Mínum síðum inná Ísland.is',
    tegundRettinda: 'Lesa og skrifa',
  },
  {
    id: '6',
    nafn: 'Landspítali',
    heitiUmbods: 'Velferðarsvið Ísafjarðarbæjar',
    lysing:
      'Veitir heimild til að sjá alfarið um skattaframtal fyrir einstaklinig, færa inn upplýsingar og skila framtali',
    tegundRettinda: 'Lesa og skrifa',
  },
  {
    id: '7',
    nafn: 'Sjúkratryggingar',
    heitiUmbods: 'Velferðarsvið Ísafjarðarbæjar',
    lysing: 'Veitir heimild til að skoða rafrænt pósthólf',
    tegundRettinda: 'Lesa og skrifa',
  },
]

const headerArray = [
  '',
  'Nafn',
  'Heiti Umboðs',
  'Lýsing á umboði',
  'Tegund Réttinda',
]

export const ScopesTable = () => {
  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {headerArray.map((item) => (
            <T.HeadData style={{ paddingInline: 16 }} key={item}>
              <Text variant="medium" fontWeight="semiBold">
                {item}
              </Text>
            </T.HeadData>
          ))}
        </T.Row>
      </T.Head>
      <T.Body>
        {mockData.map((item) => {
          return (
            <T.Row key={item.id}>
              <T.Data style={{ paddingInline: 16 }}>
                <Checkbox />
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{item.nafn}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{item.heitiUmbods}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{item.lysing}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">{item.tegundRettinda}</Text>
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
