import { UnwrapPromise } from 'next/dist/lib/coalesced-function'
import { makeEmailAccount, registerEmailAddressWithSES } from '../email-account'
const emailAccounts: {
  [name: string]: UnwrapPromise<ReturnType<typeof makeEmailAccount>>
} = {}

const emailTask = {
  createEmailAccount: async (name: string) => {
    if (!emailAccounts[name]) {
      const emailAccount = await makeEmailAccount()
      await registerEmailAddressWithSES(emailAccount)
      emailAccounts[name] = emailAccount
      return emailAccount.email
    } else {
      return emailAccounts[name].email
    }
  },

  getLastEmail: ({ name, retries }: { name: string; retries: number }) => {
    if (!emailAccounts[name]) cypressError(`Email user not created yet`)
    return emailAccounts[name].getLastEmail(retries)
  },
}

export { emailTask }
