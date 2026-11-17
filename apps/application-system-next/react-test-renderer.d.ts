// `react-test-renderer` ships no type declarations, so under `strict` an import
// of it fails with TS7016. This declares only the members the specs use; the
// renderer itself is typed as `any`.
declare module 'react-test-renderer' {
  namespace TestRenderer {
    type ReactTestRenderer = any
    function create(element: unknown, options?: unknown): ReactTestRenderer
  }
  export default TestRenderer
}
