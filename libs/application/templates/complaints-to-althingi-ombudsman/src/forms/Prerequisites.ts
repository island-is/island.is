import { buildDataProviderItem, buildExternalDataProvider, buildForm, buildSection, Form, FormModes } from "@island.is/application/core";
import { prerequisites } from "../lib/messages";

export const Prerequisites: Form = buildForm({
	id: 'prerequisites.draft',
	title: 'Skilyrði',
	mode: FormModes.APPLYING,
	children: [
		buildSection({
			id: 'conditions',
			title: prerequisites.conditionsSection,
			children: [
				buildExternalDataProvider({
					id: 'approve.external.data',
					title: 'Utanaðkomandi gögn',
					dataProviders: [
						buildDataProviderItem({
							id: 'approve.data',
							type: 'TempDataProvider',
							title: 'Staðfesting á ákveðnu atriði',
							subTitle: 'Betri lýsing á atriðinu sem er verið að sækja annarsstaðar frá'
						}),
						
					],
				}),
			]
		})
	]
})