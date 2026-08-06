import { ApplicationsPage } from '../../components/ApplicationsPage'

export default function SdfApplicationSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  return <ApplicationsPage slug={params.slug} />
}
