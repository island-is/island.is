import Procures from './procures'

// This company will be used as a dashboard for the service desk with the navigation
// and the main content area.
// But until we have more components to show, we will just show render the procures.
const ServiceDesk = () => {
  return (
    <div>
      <Procures />
    </div>
  )
}

export default ServiceDesk
