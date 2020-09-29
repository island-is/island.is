/**
 * Options used for provider filtering when
 * listing service providers from X-Road
 */
export const ProviderOptions = {
  /**
   * Naming pattern match for protection level
   * of service provider in X-Road.
   * Matching should be done against lowercase names
   * to make it case insensitive.
   */
  filters: {
    /**
     * Private providers needs to end with `Private`
     */
    private: '.*private$',
    /**
     * Protected providers need to end with `Protected`
     */
    protected: '.*protected',
    /**
     * Public providers needs to end with `Public`
     */
    public: '.*public$',
  },
}
