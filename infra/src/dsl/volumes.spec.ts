import { service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes'
import { SerializeSuccess, ServiceHelm } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './service-dependencies'

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
  const sut: ServiceBuilder<'api'> = service('api').volumes(
    {
      name: 'something',
      size: '1Gi',
      accessModes: 'ReadOnly',
      mountPath: '/storage_one',
    },
    {
      name: 'somethingelse',
      size: '1Gi',
      accessModes: 'ReadWrite',
      mountPath: '/storage_two',
    },
  )

  let stagingWithVolumes: SerializeSuccess<ServiceHelm>
  beforeEach(async () => {
    stagingWithVolumes = (await renderers.helm.serializeService(
      sut,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>
  })
  it('Support multi volume definitions', () => {
    expect(stagingWithVolumes.serviceDef[0].pvcs![0]).toEqual({
      name: 'something',
      size: '1Gi',
      accessModes: 'ReadOnlyMany',
      mountPath: '/storage_one',
      storageClass: 'efs-csi',
    }),
      expect(stagingWithVolumes.serviceDef[0].pvcs![1]).toEqual({
        name: 'somethingelse',
        size: '1Gi',
        accessModes: 'ReadWriteMany',
        mountPath: '/storage_two',
        storageClass: 'efs-csi',
      })
  })
  it('Support default name for volumes', async () => {
    const sut: ServiceBuilder<'api'> = service('api').volumes({
      size: '1Gi',
      accessModes: 'ReadOnly',
      mountPath: '/storage_one',
    })
    const stagingWithDefaultVolume = (await renderers.helm.serializeService(
      sut,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>
    expect(stagingWithDefaultVolume.serviceDef[0].pvcs![0]).toEqual({
      name: 'api',
      size: '1Gi',
      accessModes: 'ReadOnlyMany',
      mountPath: '/storage_one',
      storageClass: 'efs-csi',
    })
  })
})
