import { ApplicationsPage } from '../../../components/ApplicationsPage'

export default function ApplicationSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  return <ApplicationsPage slug={params.slug} />
}
