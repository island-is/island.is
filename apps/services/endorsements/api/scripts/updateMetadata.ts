import 'reflect-metadata'
import { NestFactory } from '@nestjs/core/nest-factory'
import { Sequelize } from 'sequelize-typescript'
import Bottleneck from 'bottleneck'
import jsonwebtoken from 'jsonwebtoken'
import { logger } from '@island.is/logging'
import { Auth } from '@island.is/auth-nest-tools'
import { GenericScope } from '@island.is/auth/scopes'
import * as sequelizeConfig from '../sequelize.config'
import { Endorsement } from '../src/app/modules/endorsement/models/endorsement.model'
import { EndorsementList } from '../src/app/modules/endorsementList/endorsementList.model'
import { EndorsementMetadataService } from '../src/app/modules/endorsementMetadata/endorsementMetadata.service'
import { EndorsementMetaField } from '../src/app/modules/endorsementMetadata/types'
import { AppModule } from '../src/app/app.module'
import { EndorsementMetadata } from '../src/app/modules/endorsementMetadata/endorsementMetadata.model'
import { environment } from '../src/environments'

interface EndorsementListFieldMap {
  [key: string]: EndorsementMetaField[]
}

interface EndorsementMetadataResponse {
  id: string
  meta: EndorsementMetadata
}

// taken from @island.is/auth-nest-tools
interface JwtPayload {
  nationalId?: string
  scope: string | string[]
  client_id: string
  act?: {
    nationalId: string
    scope?: string | string[]
  }
  actor?: {
    nationalId: string
    scope?: string | string[]
  }
}

// INIT
const sequelizeConfigKey = environment.production ? 'production' : 'development'
new Sequelize({
  ...sequelizeConfig[sequelizeConfigKey],
  models: [Endorsement, EndorsementList],
  define: { underscored: true },
})

let endorsementMetadataService: EndorsementMetadataService

const limiter = new Bottleneck({
  minTime: Number(process.env.MIN_TIME) || 100, // 100 ms between requests (10 req/sec)
  maxConcurrent: Number(process.env.MAX_CONCURRENT) || 10,
})

// AUTH
const acquireAuthToken = async (): Promise<string> => {
  const tokenOptions = {
    client_id: environment.endorsementClient.clientId,
    grant_type: 'client_credentials',
    scope: GenericScope.system,
    client_secret: environment.endorsementClient.clientSecret,
  }
  const response = await fetch(`${environment.auth.issuer}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(tokenOptions),
  })

  if (!response.ok) {
    throw new Error('Failed to acquire access token')
  }

  const result = await response.json()

  return result.access_token
}

// taken from @island.is/auth-nest-tools
const parseScopes = (scopes: undefined | string | string[]): string[] => {
  if (scopes === undefined) {
    return []
  }
  if (typeof scopes === 'string') {
    return scopes.split(' ')
  }
  return scopes
}

// token is not validated at this point, we expect the underlying services to authenticate the token
const convertTokenToAuth = (token: string): Auth => {
  try {
    const decodedPayload = jsonwebtoken.decode(token) as JwtPayload

    return {
      scope: parseScopes(decodedPayload.scope),
      client: decodedPayload.client_id,
      authorization: token,
    }
  } catch (e) {
    logger.error('Failed to convert token to authentication')
    throw e
  }
}

/*
This script can take long to execute, this ensures auth wont time out
*/
let currentAuth: Auth | undefined
let lastTokenTime = new Date()
let fetchingAuth = false
const getClientAuth = async (): Promise<Auth> => {
  const currentTime = new Date()
  const refreshTime = new Date(lastTokenTime)
  const authRefreshHours = 2
  refreshTime.setHours(lastTokenTime.getHours() + authRefreshHours) // refresh every X hours

  // if refresh time is in the past we refresh the auth
  if ((refreshTime < currentTime || !currentAuth) && !fetchingAuth) {
    fetchingAuth = true
    const clientAuthToken = await acquireAuthToken()

    // store the auth
    currentAuth = convertTokenToAuth(clientAuthToken)

    // remember fetched time
    lastTokenTime = currentTime
  }

  return currentAuth as Auth // auth is always set at this point
}

// DATA
const createEndorsementListFieldMap = (
  endorsementLists: EndorsementList[],
): EndorsementListFieldMap =>
  endorsementLists.reduce((map: EndorsementListFieldMap, endorsementList) => {
    // add endorsement list to map
    map[endorsementList.id] = endorsementList.endorsementMetadata.reduce(
      // return names of fields with the keepUpToDate marked as true
      (fieldsToUpdate: EndorsementMetaField[], metadata) => {
        if (metadata.keepUpToDate) {
          return [...fieldsToUpdate, metadata.field]
        } else {
          return fieldsToUpdate
        }
      },
      [],
    )
    return map
  }, {})

const getEndorsementMetadata = async (
  endorsement: Endorsement,
  fieldsToUpdate: EndorsementMetaField[],
): Promise<EndorsementMetadataResponse | null> => {
  // we skip endorsements with no fields to update
  if (fieldsToUpdate.length) {
    logger.info('Will update', {
      endorsement: endorsement.id,
      fields: fieldsToUpdate,
    })
    return {
      meta: {
        ...endorsement.meta,
        // we get only updated fields from this function
        ...(await endorsementMetadataService.getMetadata(
          {
            nationalId: endorsement.endorser,
            fields: fieldsToUpdate,
          },
          await getClientAuth(),
        )),
      },
      id: endorsement.id,
    }
  }
  return Promise.resolve(null)
}

const processEndorsements = async (
  endorsementListMap: EndorsementListFieldMap,
  index = 0,
): Promise<null> => {
  const endorsementsChunkSize = 100
  // find a batch of endorsements belonging to given lists
  const endorsements = await Endorsement.findAll({
    where: {
      endorsementListId: Object.keys(endorsementListMap),
    },
    // we paginate to reduce memory usage
    limit: endorsementsChunkSize,
    offset: index * endorsementsChunkSize,
  })

  const endorsementUpdates = await Promise.all(
    endorsements.map((endorsement) =>
      // we throttle to reduce load on external services
      limiter.schedule(() =>
        getEndorsementMetadata(
          endorsement,
          endorsementListMap[endorsement.endorsementListId],
        ),
      ),
    ),
  ).then(
    (data) =>
      ([] as typeof data)
        .concat(...data)
        .filter((metadata) =>
          Boolean(metadata),
        ) as EndorsementMetadataResponse[],
  ) // flatten the responses to a single array and remove null responses

  await Promise.all(
    endorsementUpdates.map(({ id, meta }) => {
      return Endorsement.update({ meta }, { where: { id } })
    }),
  )

  logger.info(
    'Updated endorsements',
    endorsementUpdates.map(({ id }) => id),
  )

  if (endorsements.length === endorsementsChunkSize) {
    return processEndorsements(endorsementListMap, index + 1)
  } else {
    return null
  }
}

const processEndorsementLists = async (cb: () => void, index = 0) => {
  const endorsementListsChunkSize = 10

  // find this batch of endorsementLists that might need updating
  const endorsementLists = await EndorsementList.findAll({
    // we paginate to reduce memory usage
    limit: endorsementListsChunkSize,
    offset: index * endorsementListsChunkSize,
  })

  const endorsementListFieldMap = createEndorsementListFieldMap(
    endorsementLists,
  )

  await processEndorsements(endorsementListFieldMap)

  if (endorsementLists.length === endorsementListsChunkSize) {
    processEndorsementLists(cb, index + 1)
  } else {
    cb()
  }
}

export default async () => {
  if (!environment.production) {
    // Lets make sure it is clear in logs if this is running in dev mode
    logger.warn('>>>RUNNING IN DEV MODE!!!<<<')
  }

  await getClientAuth() // pre fetch auth
  const app = await NestFactory.create(AppModule)
  endorsementMetadataService = app.get(EndorsementMetadataService)
  processEndorsementLists(() => {
    app.close()
  })
}
