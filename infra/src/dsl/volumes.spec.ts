import { service, ServiceBuilder } from './dsl'
import { UberChart } from './uber-chart'
import { MissingSetting } from './types/input-types'
import { serializeService } from './map-to-values'
import { SerializeErrors, SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}
describe('Volume Support', () => {
  const sut: ServiceBuilder<'api'> = service('api')
    .volumes({
      name: 'something',
      storage: '1Gi',
      accessModes: 'ReadWriteOnce',
      mountPath: '/storage_one',
      storageClass: 'efs-csi',
    })
    .volumes({
      name: 'somethingelse',
      storage: '1Gi',
      accessModes: 'ReadWriteOnce',
      mountPath: '/storage_two',
      storageClass: 'efs-csi',
    })
  const stagingWithVolumes = serializeService(
    sut,
    new UberChart(Staging),
  ) as SerializeSuccess

  it('Support multi volume definitions', () => {
    expect(stagingWithVolumes.serviceDef.pvcs![0]).toEqual({
      name: 'something',
      storage: '1Gi',
      accessModes: 'ReadWriteOnce',
      mountPath: '/storage_one',
      storageClass: 'efs-csi',
    }),
      expect(stagingWithVolumes.serviceDef.pvcs![1]).toEqual({
        name: 'somethingelse',
        storage: '1Gi',
        accessModes: 'ReadWriteOnce',
        mountPath: '/storage_two',
        storageClass: 'efs-csi',
      })
  })
})
