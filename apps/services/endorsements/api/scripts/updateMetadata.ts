import 'reflect-metadata'
import { NestFactory } from '@nestjs/core/nest-factory'
import { Sequelize } from 'sequelize-typescript'
import Bottleneck from 'bottleneck'
import { logger } from '@island.is/logging'
import { Auth } from '@island.is/auth-nest-tools'
import { EndorsementsScope } from '@island.is/auth/scopes'
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

// lets init sequelize client with config from the api app
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

const acquireAuthToken = async (): Promise<string> => {
  const response = await fetch(`${environment.auth.issuer}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: environment.auth.clientId,
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      scope: EndorsementsScope.main,
      client_secret: environment.auth.clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to acquire access token')
  }

  const result = await response.json()

  return result.access_token
}

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
          ('' as unknown) as Auth, // TODO: Add auth here
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
  const app = await NestFactory.create(AppModule)
  endorsementMetadataService = app.get(EndorsementMetadataService)
  processEndorsementLists(() => {
    app.close()
  })
}
