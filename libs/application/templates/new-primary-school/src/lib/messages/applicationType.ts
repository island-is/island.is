import { defineMessages } from 'react-intl'

export const applicationTypeMessages = defineMessages({
  sectionTitle: {
    id: 'nps.application:applicationType.sectionTitle',
    defaultMessage: 'Tegund umsóknar',
    description: 'Application type',
  },
  schoolTransferSubLabel: {
    id: 'nps.application:applicationType.schoolTransferSubLabel',
    defaultMessage:
      'Sé barnið þitt skráð í skóla getur þú óskað eftir að það verði skráð í annan skóla í því sveitarfélagi þar sem þú býrð. Þú getur einnig sótt um að barnið þitt fari í skóla í öðru sveitarfélagi eða í sjálfstætt starfandi skóla. Almennt gildir að í sveitarfélögum er val um grunnskóla en ef takmarka þarf fjölda nemenda í einstaka skólum eiga nemendur áfram rétt á skólavist í þeim skóla sem þeir þegar eru skráðir í.',
    description:
      'If your child is already registered in a school, you can request a transfer to another school within your municipality. You can also apply for your child to attend a school in another municipality or an independent school. In general, families can choose between primary schools within the municipality. In general, municipalities offer a choice of primary schools. However, if it becomes necessary to limit the number of students in certain schools, students still retain the right to continue their schooling at the school where they are already enrolled.',
  },
  continuingEnrollmentSubLabel: {
    id: 'nps.application:applicationType.continuingEnrollmentSubLabel',
    defaultMessage:
      'Sé barnið þitt þegar skráð í skóla utan þess sveitarfélags þar sem það á lögheimili eða í sjálfstætt starfandi skóla, þá þarf foreldri að óska eftir áframhaldandi skólavist á hverju ári, með endurnýjun umsóknar.',
    description:
      'If your child is already enrolled in a school outside the municipality where they are legally registered, or in an independent school, the parent must request continuing enrollment each year by submitting a renewed application.',
  },
})
