import {
  AccessModes,
  Context,
  EnvironmentVariables,
  ExtraValues,
  Features,
  HealthProbe,
  Ingress,
  InitContainers,
  MountedFile,
  PersistentVolumeClaim,
  PostgresInfo,
  RedisInfo,
  ReplicaCount,
  Resources,
  Secrets,
  ServiceDefinition,
  XroadConfig,
} from './types/input-types'
type Optional<T, L extends keyof T> = Omit<T, L> & Partial<Pick<T, L>>

export class ServiceBuilder<ServiceType> {
  serviceDef: ServiceDefinition

  constructor(name: string) {
    this.serviceDef = {
      liveness: { path: '/', timeoutSeconds: 3, initialDelaySeconds: 3 },
      readiness: { path: '/', timeoutSeconds: 3, initialDelaySeconds: 3 },
      env: {},
      features: {},
      name: name,
      grantNamespaces: [],
      grantNamespacesEnabled: false,
      secrets: { CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY' },
      ingress: {},
      namespace: 'islandis',
      serviceAccountEnabled: false,
      securityContext: {
        privileged: false,
        allowPrivilegeEscalation: false,
      },
      resources: {
        limits: {
          memory: '256Mi',
          cpu: '200m',
        },
        requests: {
          memory: '128Mi',
          cpu: '100m',
        },
      },
      xroadConfig: [],
      files: [],
      volumes: [],
    }
  }

  extraAttributes(attr: ExtraValues) {
    this.serviceDef.extraAttributes = attr
    return this
  }

  liveness(path: string | Partial<HealthProbe>) {
    if (typeof path === 'string') {
      this.serviceDef.liveness.path = path
    } else {
      this.serviceDef.liveness = { ...this.serviceDef.liveness, ...path }
    }
    return this
  }

  readiness(path: string | Partial<HealthProbe>) {
    if (typeof path === 'string') {
      this.serviceDef.readiness.path = path
    } else {
      this.serviceDef.readiness = { ...this.serviceDef.readiness, ...path }
    }
    return this
  }

  healthPort(port: number) {
    this.serviceDef.healthPort = port
    return this
  }

  targetPort(port: number) {
    this.serviceDef.port = port
    return this
  }

  features(features: Partial<Features>) {
    this.serviceDef.features = features
    return this
  }

  /**
   * Sets the namespace for your service. Default value is `islandis` (optional). It sets the [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) for all resources.
   * @param name Namespace name
   */
  namespace(name: string) {
    this.serviceDef.namespace = name
    return this
  }

  /**
   * This is necessary to allow access to this service from other namespaces. This can be the case if a pod from a different namespace is using this service. A good example of that is the ingress controller service pods that are routing traffic to the services in the cluster.
   * @param namespaces list of namespaces that have access to the namespace this service is part of
   */
  grantNamespaces(...namespaces: string[]) {
    this.serviceDef.grantNamespaces = namespaces
    this.serviceDef.grantNamespacesEnabled = true
    return this
  }

  image(name: string) {
    this.serviceDef.image = name
    return this
  }

  setNamespace(name: string) {
    this.serviceDef.namespace = name
  }

  name() {
    return this.serviceDef.name
  }

  /**
   * Environment variables are used for a configuration that is not a secret. It can be environment-specific or not. Mapped to [environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/).
   * Environment variables are only applied to the service. If you need those on an `initContainer` you need to specify them at that scope. That means you may need to extract and reuse or duplicate the variables if you need them both for `initContainer` and the service.
   * @param key name of env variable
   * @param value value of env variable. A single string sets the same value across all environment. A dictionary with keys the environments sets an individual value for each one
   */
  env(envs: EnvironmentVariables) {
    this.assertUnset(this.serviceDef.env, envs)
    this.serviceDef.env = { ...this.serviceDef.env, ...envs }
    return this
  }

  /**
   * X-Road configuration blocks to inject to the container. Types of XroadConfig can contain environment variables and/or secrets that define how to contact an external service through X-Road
   * @param ...configs: X-road configs
   */
  xroad(...configs: XroadConfig[]) {
    this.serviceDef.xroadConfig = [...this.serviceDef.xroadConfig, ...configs]
    return this
  }

  /**
   * Files to be mounted inside the containers. Files must be in the helm repo.
   * @param ...files: list of MountedFile
   */
  files(...files: MountedFile[]) {
    this.serviceDef.files = [...this.serviceDef.files, ...files]
    return this
  }

  /**
   * Volumes to create and attach to containers
   * @param ...volumes: volume configs
   *
   */
  volumes(...volumes: PersistentVolumeClaim[]) {
    this.serviceDef.volumes = [...this.serviceDef.volumes, ...volumes]
    return this
  }

  /**
   * To perform maintenance before deploying the main service(database migrations, etc.), create an `initContainer` (optional). It maps to a Pod specification for an [initContainer](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/).
   * @param ic initContainer definitions
   */
  initContainer(ic: Optional<InitContainers, 'envs' | 'secrets' | 'features'>) {
    if (ic.postgres) {
      ic.postgres = {
        ...this.withDefaults(ic.postgres),
        extensions: ic.postgres.extensions,
      }
    }
    const uniqueNames = new Set(ic.containers.map((c) => c.name))
    if (uniqueNames.size != ic.containers.length) {
      throw new Error(
        'For multiple init containers, you must set a unique name for each container.',
      )
    }
    this.serviceDef.initContainers = {
      envs: {
        NPM_CONFIG_UPDATE_NOTIFIER: {
          local: 'true',
          dev: 'false',
          staging: 'false',
          prod: 'false',
        },
      },
      secrets: {},
      features: {},
      ...ic,
    }
    return this
  }

  /**
   * Secrets are configuration that is resolved at deployment time. Their values are _paths_ in the Parameter Store in AWS Systems Manager. There is a service in Kubernetes that resolves the concrete value of these secrets and they appear as environment variables on the service or the `initContainer`. Mapped to [ExternalSecrets](https://github.com/godaddy/kubernetes-external-secrets).
   * Like environment variables, secrets are only applied to the service. If you need those on an `initContainer` you need to specify them at that scope.
   *
   * To provision secrets in the Parameter Store, you need to get in touch with the DevOps team.
   * @param secrets Maps of secret names and their corresponding paths
   */
  secrets(secrets: Secrets) {
    this.assertUnset(this.serviceDef.secrets, secrets)
    this.serviceDef.secrets = { ...this.serviceDef.secrets, ...secrets }
    return this
  }

  command(cmd: string) {
    this.serviceDef.cmds = cmd
    return this
  }

  args(...args: string[]) {
    this.serviceDef.args = args
    return this
  }

  redis(redis?: RedisInfo) {
    this.serviceDef.redis = redis ?? {}
    return this
  }

  resources(res: Resources) {
    this.serviceDef.resources = res
    return this
  }

  replicaCount(replicaCount: ReplicaCount) {
    this.serviceDef.replicaCount = replicaCount
    return this
  }

  postgres(postgres?: PostgresInfo) {
    this.serviceDef.postgres = this.withDefaults(postgres ?? {})
    return this
  }
  /**
   * You can allow ingress traffic (traffic from the internet) to your service by creating an ingress controller. Mapped to an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress)
   * @param ingress Ingress parameters
   */
  ingress(ingress: { [name: string]: Ingress }) {
    this.serviceDef.ingress = ingress
    return this
  }

  /**
   * If your service needs to perform AWS API calls, you will need to create a [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) and associate it with an AWS IAM role using Kubernetes annotations.
   *
   * The AWS IAM Role and its permissions needs to be provisioned by the DevOps team.
   *
   * @param name Service account name
   */
  serviceAccount(name?: string) {
    this.serviceDef.accountName = name ?? this.serviceDef.name
    this.serviceDef.serviceAccountEnabled = true
    return this
  }

  private assertUnset<T extends {}>(current: T, envs: T) {
    const intersection = Object.keys({
      ...current,
    }).filter({}.hasOwnProperty.bind(envs))
    if (intersection.length) {
      throw new Error(
        `Trying to set same environment variable multiple times: ${intersection}`,
      )
    }
  }

  private withDefaults = (pi: PostgresInfo): PostgresInfo => {
    return {
      host: pi.host,
      username: pi.username ?? postgresIdentifier(this.serviceDef.name),
      passwordSecret:
        pi.passwordSecret ?? `/k8s/${this.serviceDef.name}/DB_PASSWORD`,
      name: pi.name ?? postgresIdentifier(this.serviceDef.name),
      extensions: this.serviceDef.initContainers?.postgres?.extensions,
    }
  }
}

const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')

export const ref = (renderer: (env: Context) => string) => {
  return renderer
}

export const service = <Service extends string>(
  name: Service,
): ServiceBuilder<Service> => {
  return new ServiceBuilder(name)
}

export const json = (value: unknown): string => JSON.stringify(value)
