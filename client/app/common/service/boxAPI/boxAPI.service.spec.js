'use strict';

describe('Service: thingAPI', function () {

  // load the service's module
  beforeEach(module('manageBoxApp'));

  // instantiate service
  var thingAPI;
  beforeEach(inject(function (_thingAPI_) {
    thingAPI = _thingAPI_;
  }));

  it('should do something', function () {
    expect(!!thingAPI).toBe(true);
  });

});
