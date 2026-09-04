import { ApplicationsPage } from '../../components/ApplicationsPage'

export default async function SdfApplicationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <ApplicationsPage slug={slug} />
}
