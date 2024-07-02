import { Helmet } from 'react-helmet-async'

export const DynamicTitle = ({ title }: { title: string }) => (
  <Helmet>
    <title>{title + ' - Mínar síður - Ísland.is'}</title>
  </Helmet>
)
