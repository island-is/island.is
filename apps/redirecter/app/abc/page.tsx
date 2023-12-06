import { NextResponse } from 'next/server'

// Redirect to https://nx.dev/getting-started/intro?utm_source=nx-project
export default async function Index() {
  return NextResponse.redirect(
    'https://nx.dev/getting-started/intro?utm_source=nx-project',
  )
}
