require('app/models/transaction');

Balanced.Hold = Balanced.Transaction.extend({
    source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
    debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),

    hold_status: function() {
        if(this.get('debit')) {
            return 'captured';
        } else if(this.get('is_void')) {
            return "void";
        } else if(Date.parseISO8601(this.get('expires_at')) < new Date()) {
            return "expired";
        } else {
            return "created";
        }
    }.property('debit', 'is_void', 'expires_at'),

    can_void_or_capture: function() {
        return this.get('hold_status') === 'created';
    }.property('hold_status'),

    type_name: function () {
        return "Hold";
    }.property(),

    funding_instrument_description: function () {
        return this.get('source.description');
    }.property('source.description')
});

Balanced.TypeMappings.addTypeMapping('hold', 'Balanced.Hold');
