import { NotFoundException } from '@nestjs/common'

import { SharedNamespaceIntrospectionService } from './shared-namespace-introspection.service'

describe('SharedNamespaceIntrospectionService', () => {
  const service = new SharedNamespaceIntrospectionService()

  describe('listSharedNamespaces', () => {
    it('includes application.system', () => {
      const namespaces = service.listSharedNamespaces()
      expect(
        namespaces.some((entry) => entry.namespace === 'application.system'),
      ).toBe(true)
    })
  })

  describe('introspectSharedNamespace', () => {
    it('returns descriptors for application.system', () => {
      const result = service.introspectSharedNamespace('application.system')
      expect(result.namespace).toBe('application.system')
      expect(result.messageDescriptors.length).toBeGreaterThan(0)
      expect(
        result.messageDescriptors.every((descriptor) =>
          descriptor.id.startsWith('application.system:'),
        ),
      ).toBe(true)
      expect(
        result.messageDescriptors.some(
          (descriptor) => descriptor.id === 'application.system:button.next',
        ),
      ).toBe(true)
    })

    it('returns descriptors for uiForms.application', () => {
      const result = service.introspectSharedNamespace('uiForms.application')
      expect(result.messageDescriptors.length).toBeGreaterThan(0)
      expect(
        result.messageDescriptors.every((descriptor) =>
          descriptor.id.startsWith('uiForms.application:'),
        ),
      ).toBe(true)
    })

    it('throws for unknown namespace', () => {
      expect(() => service.introspectSharedNamespace('ra.application')).toThrow(
        NotFoundException,
      )
    })
  })
})
