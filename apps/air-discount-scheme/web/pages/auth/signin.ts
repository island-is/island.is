import { NextApiRequest, NextApiResponse } from 'next'
import { signIn, getSession, csrfToken, getProviders } from "next-auth/client";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   signIn('identity-server')
// }
export default function SignIn({ providers }) {
  if(providers) {
    return null
  }
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

