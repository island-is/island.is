'use strict'

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addIndex(
        'payment_flow_fjs_charge_confirmation',
        ['payment_flow_id'],
        {
          name: 'payment_flow_fjs_charge_confirmation_payment_flow_id_idx',
        },
      ),
      queryInterface.addIndex('payment_flow_charge', ['payment_flow_id'], {
        name: 'payment_flow_charge_payment_flow_id_idx',
      }),
      queryInterface.addIndex('payment_flow_event', ['payment_flow_id'], {
        name: 'payment_flow_event_payment_flow_id_idx',
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeIndex(
        'payment_flow_fjs_charge_confirmation',
        'payment_flow_fjs_charge_confirmation_payment_flow_id_idx',
      ),
      queryInterface.removeIndex(
        'payment_flow_charge',
        'payment_flow_charge_payment_flow_id_idx',
      ),
      queryInterface.removeIndex(
        'payment_flow_event',
        'payment_flow_event_payment_flow_id_idx',
      ),
    ])
  },
}
