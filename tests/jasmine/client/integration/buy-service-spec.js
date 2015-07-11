describe('Stripe', function () {

  beforeEach(function (done) {
    Meteor.call('stripeStub/stub', {}, done)
    // spy on the Meteor.call method that we will use to create a customer
    spyOn(Meteor, 'call');
  });

  describe('successful payments', function () {

    it('should create a customer', function () {

      // - - SETUP
      // relies on beforeEach for setup

      // - - EXECUTE
      Letterpress.Services.BuyService.buy();

      // - - VERIFY
      // make sure the createCustomer method was called on the server with the token
      expect(Meteor.call).toHaveBeenCalledWith('createCustomer', {}, jasmine.any(Function));

    });

  });

  it('should show the user a confirmation', function () {

    // - - SETUP
    // spy on the router since we'll be showing a confirmation using a new route
    spyOn(Router, 'go');
    // trigger the stripe token handler, which will call the Meteor method
    Letterpress.Services.BuyService.buy();

    // grab the most recent meteor method (createCustomer) and grab the callback
    var args = Meteor.call.calls.mostRecent().args;
    var callback = args[args.length - 1];

    // - - EXECUTE
    // mimic a callback from the server without errors
    callback();

    // - - VERIFY
    // make sure the user is taken to the confirmation screen
    expect(Router.go).toHaveBeenCalledWith('/subscription-confirmation');

  });

});