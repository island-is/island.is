import { ForbiddenError } from 'apollo-server-express'

import { authorize } from '../auth'
import { getApplication, createApplication } from './service'
import { ferdalagService } from '../../services'

class ApplicationResolver {
  @authorize({ role: 'admin' })
  public async getApplication(_, args, context) {
    if (true) {
      throw new ForbiddenError('Forbidden')
    }

    return { id: '1', email: 'foo', state: 'bla' }
    const application = await getApplication(args.ssn)
    if (application) {
      return {
        application: {
          id: application.id,
          state: application.state,
          email: application.data.email,
        },
      }
    }

    const serviceProviders = await ferdalagService.getServiceProviders(args.ssn)
    if (serviceProviders.length === 1) {
      console.debug(`Got a single service provider for ssn ${args.ssn}`)
      const [serviceProvider] = serviceProviders
      return {
        application: {
          id: serviceProvider.serviceProviderId,
          email: serviceProvider.email,
          state: 'empty',
        },
      }
    }

    return null
  }

  @authorize()
  public async createApplication(_, args, context) {
    const serviceProviders = await ferdalagService.getServiceProviders(
      args.input.ssn,
    )
    let state = 'approved'
    const comments = []
    if (serviceProviders.length > 1) {
      state = 'pending'
      comments.push('Multiple service providers found for ssn')
    } else if (serviceProviders.length < 1) {
      state = 'pending'
      comments.push('No service provider found for ssn')
    }

    const application = await createApplication(
      args.input,
      context,
      state,
      comments,
    )
    return {
      application: {
        id: application.id,
        state: application.state,
        email: application.data.email,
      },
    }
  }
}

const resolver = new ApplicationResolver()
export default {
  Query: {
    getApplication: resolver.getApplication,
  },
  Mutation: {
    createApplication: resolver.createApplication,
  },
}
