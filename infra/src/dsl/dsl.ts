import {
  Ingress,
  InitContainers,
  SecretType,
  EnvironmentVariables,
  Context,
  Service,
  ServiceDefinition,
  ExtraValues,
  Resources,
  ReplicaCount,
  PostgresInfo,
  OpsEnv,
  HealthProbe,
  Toggle,
} from './types/input-types'

export class ServiceBuilder<ServiceType> implements Service {
  extraAttributes(attr: ExtraValues) {
    this.serviceDef.extraAttributes = attr
    return this
  }
  serviceDef: ServiceDefinition
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
  targetPort(port: number) {
    this.serviceDef.port = port
    return this
  }

  toggles(toggles: { [name: string]: Toggle }) {
    this.serviceDef.toggles = toggles
    return this
  }

  constructor(name: string) {
    this.serviceDef = {
      liveness: { path: '/', timeoutSeconds: 3, initialDelaySeconds: 3 },
      readiness: { path: '/', timeoutSeconds: 3, initialDelaySeconds: 3 },
      env: {},
      toggles: {},
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
    }
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
    this.serviceDef.env = { ...this.serviceDef.env, ...envs }
    return this
  }

  /**
   * To perform maintenance before deploying the main service(database migrations, etc.), create an `initContainer` (optional). It maps to a Pod specification for an [initContainer](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/).
   * @param ic initContainer definitions
   */
  initContainer(ic: InitContainers) {
    if (ic.postgres) {
      ic.postgres = this.withDefaults(ic.postgres)
    }
    const uniqueNames = new Set(ic.containers.map((c) => c.name))
    if (uniqueNames.size != ic.containers.length) {
      throw new Error(
        'For multiple init containers, you must set a unique name for each container.',
      )
    }
    this.serviceDef.initContainers = ic
    return this
  }

  /**
   * Secrets are configuration that is resolved at deployment time. Their values are _paths_ in the Parameter Store in AWS Systems Manager. There is a service in Kubernetes that resolves the concrete value of these secrets and they appear as environment variables on the service or the `initContainer`. Mapped to [ExternalSecrets](https://github.com/godaddy/kubernetes-external-secrets).
   * Like environment variables, secrets are only applied to the service. If you need those on an `initContainer` you need to specify them at that scope.
   *
   * To provision secrets in the Parameter Store, you need to get in touch with the DevOps team.
   * @param secrets Maps of secret names and their corresponding paths
   */
  secrets(secrets: { [key: string]: SecretType }) {
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

  resources(res: Resources) {
    this.serviceDef.resources = res
    if (res.limits && res.limits.memory) {
      if (this.serviceDef.env.NODE_OPTIONS) {
        throw new Error(
          'NODE_OPTIONS already set. At the moment of writing, there is no known use case for this, so this might need to be revisited in the future.',
        )
      }
      this.env({
        NODE_OPTIONS: `--max-old-space-size=${
          parseInt(res.limits.memory, 10) - 48
        }`,
      })
    }
    return this
  }

  replicaCount(replicaCount: ReplicaCount) {
    this.serviceDef.replicaCount = replicaCount
    return this
  }

  private withDefaults = (pi: PostgresInfo): PostgresInfo => {
    return {
      host: pi.host,
      username: pi.username ?? postgresIdentifier(this.serviceDef.name),
      passwordSecret:
        pi.passwordSecret ?? `/k8s/${this.serviceDef.name}/DB_PASSWORD`,
      name: pi.name ?? postgresIdentifier(this.serviceDef.name),
    }
  }

  postgres(postgres?: PostgresInfo) {
    this.serviceDef.postgres = this.withDefaults(postgres ?? {})
    return this
  }

  redis(host?: string) {
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
