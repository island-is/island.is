const { getJestProjects } = require('@nrwl/jest')

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/services/notifications',
    '<rootDir>/libs/infra-monitoring',
    '<rootDir>/libs/vmst-client',
    '<rootDir>/libs/api/domains/islykill',
    '<rootDir>/libs/api/domains/rsk',
    '<rootDir>/libs/api/domains/rsk-company-info',
    '<rootDir>/libs/application/nest/application',
    '<rootDir>/libs/application/templates/complaints-to-althingi-ombudsman',
    '<rootDir>/libs/application/templates/driving-instructor-registrations',
    '<rootDir>/libs/clients/national-registry',
    '<rootDir>/libs/clients/rsk-company-info',
    '<rootDir>/libs/service-portal/settings/islykill',
    '<rootDir>/libs/shared/table',
  ],
}
