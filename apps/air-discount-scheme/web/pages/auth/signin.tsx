import { NextApiRequest, NextApiResponse } from 'next'
import { signIn, getSession, csrfToken, getProviders } from "next-auth/client";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   signIn('identity-server')
// }
export default function SignIn({ providers }) {
  if(providers) {
    console.log(providers)
    //return null
  }
  return (
    <Link href="/api/auth/signin">Sign in here</Link>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

