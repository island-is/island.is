import styles from './service-portal-work-machines.module.scss'

/* eslint-disable-next-line */
export interface ServicePortalWorkMachinesProps {}

export function ServicePortalWorkMachines(
  props: ServicePortalWorkMachinesProps,
) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ServicePortalWorkMachines!</h1>
    </div>
  )
}

export default ServicePortalWorkMachines
