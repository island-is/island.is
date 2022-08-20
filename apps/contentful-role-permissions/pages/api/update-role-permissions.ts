import type { NextApiRequest, NextApiResponse } from 'next'
import { extractInitialCheckboxStateFromRolesAndContentTypes } from '../../utils'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body as ReturnType<
    typeof extractInitialCheckboxStateFromRolesAndContentTypes
  >

  // TODO: perform the update

  res.status(200).json(data)
}
