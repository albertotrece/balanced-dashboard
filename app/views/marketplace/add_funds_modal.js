Balanced.AddFundsModalView = Balanced.View.extend({
    templateName: 'modals/add_funds',

    dollar_amount: null,

    selected_bank_account: function () {
        if (this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    verified_bank_accounts: function () {
        return this.get('marketplace.owner_customer.verified_bank_accounts');
    }.property('marketplace.owner_customer.verified_bank_accounts'),

    open: function () {
        var verified_bank_accounts = this.get('marketplace.owner_customer.verified_bank_accounts');
        var source_uri = (verified_bank_accounts && verified_bank_accounts.length > 0) ? verified_bank_accounts[0].get('uri') : null;

        var debit = Balanced.Debit.create({
            uri: this.get('marketplace.owner_customer.debits_uri'),
            source_uri: source_uri,
            amount: null
        });

        this.set('dollar_amount', null);
        this.set('model', debit);

        $('#add-funds').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var debit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            debit.set('validationErrors', {'amount': error});
            return;
        }
        debit.set('amount', cents);

        debit.create().then(function () {
            self.get('marketplace').refresh();
            $('#add-funds').modal('hide');
        });
    }
});
