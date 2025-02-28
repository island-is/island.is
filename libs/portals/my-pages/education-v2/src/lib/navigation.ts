import { EducationPaths } from './paths'

export const educationNavigationV2: PortalNavigationItem = {
  name: m.education,
  path: EducationPaths.EducationV2Root,
  icon: {
    icon: 'school',
  },
  description: m.educationDescription,
  children: [
    {
      name: m.educationGrunnskoli,
      path: EducationPaths.EducationV2Overview,
    },
  ],
}
