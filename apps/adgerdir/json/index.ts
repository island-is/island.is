export const categories = [
  {
    title: 'Fjölskyldumál og velferð',
    description:
      'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
  },
  {
    title: 'Eldri borgarar',
    description: 'Þjónusta, réttindi og lífeyrismál.',
  },
  {
    title: 'Bætur',
    description: 'Bótagreiðslur til einstaklinga frá ríki og sveitarfélögum.',
  },
  {
    title: 'Málefni fatlaðra',
    description: 'Réttindi, bætur, jafnrétti og umönnun.',
  },
  {
    title: 'Menntun',
    description:
      'Leikskólar, grunnskólar, framhaldsskólar, háskólar, styrkir og lán.',
  },
  {
    title: 'Ferðalög og búseta erlendis',
    description: 'Útgáfa vegabréfa, evrópska sjúkrakortið, störf erlendis.',
  },
  {
    title: 'Fjölskyldumál og velferð',
    description:
      'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
  },
]

export const tags = [
  { title: 'COVID-19' },
  { title: 'Atvinnuleysisbætur' },
  { title: 'Hlutabætur' },
  { title: 'Ferðagjöf' },
  { title: 'Gifting' },
  { title: 'Fæðingarorlof' },
  { title: 'Skilnaður' },
  { title: 'Færnimat' },
  { title: 'Styrkir og lán' },
  { title: 'Örorkumat' },
  { title: 'Framhaldsskólar' },
  { title: 'Veiðikort' },
  { title: 'Dvalarleyfi' },
  { title: 'Sótt um hæli' },
]

export const articles = [
  { title: 'Skráning nafns' },
  { title: 'Nafnabreyting' },
  { title: 'Breytt ritun nafns' },
  { title: 'Breytt skráning á kyni' },
]

export const getTags = (count = 5) => {
  const c = count > 0 && count > tags.length ? tags.length : count
  const shuffledTags = tags.sort(() => Math.random() - 0.5)
  return shuffledTags.slice(0, c)
}

export const selectOptions = categories.map((x) => ({
  label: x.title,
  value: x.title,
}))
