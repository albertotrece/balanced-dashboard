Balanced.Marketplace = Balanced.UserMarketplace.extend({
    credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
    debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
    refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
    holds: Balanced.Model.hasMany('holds', 'Balanced.Hold'),
    transactions: Balanced.Model.hasMany('transactions', 'Balanced.Transaction'),
    callbacks: Balanced.Model.hasMany('callbacks', 'Balanced.Callback'),

    funding_instruments: Balanced.Model.hasMany('funding_instruments', 'Balanced.FundingInstrument'),
    bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
    cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),

    owner_account: Balanced.Model.belongsTo('owner_account', 'Balanced.Account'),
    owner_customer: Balanced.Model.belongsTo('owner_customer', 'Balanced.Customer'),

    customers: Balanced.Model.hasMany('customers', 'Balanced.Customer'),

    callbacks_uri: function () {
        return this.get('uri') + '/callbacks';
    }.property('uri'),

    funding_instruments_uri: function () {
        return this.get('uri') + '/search?limit=10&offset=0&q=&type[in]=bank_account,card';
    }.property('uri')
});

Balanced.Marketplace.reopenClass({
    constructUri: function (id) {
        return '/v1/marketplaces/' + id;
    },

    current: function () {
        var marketplace = Balanced.Marketplace.create({
            uri: '/v1/marketplaces'
        });
        Balanced.Marketplace.find('/v1/marketplaces').then(function (marketplaces) {
            marketplace._updateFromJson(marketplaces.items[0]);
        });

        return marketplace;

    }
});

Balanced.TypeMappings.addTypeMapping('marketplace', 'Balanced.Marketplace');
