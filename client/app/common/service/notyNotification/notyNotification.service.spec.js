'use strict';

describe('Service: notyNotification', function () {

  // load the service's module
  beforeEach(module('manageBoxApp'));

  // instantiate service
  var notyNotification;
  beforeEach(inject(function (_notyNotification_) {
    notyNotification = _notyNotification_;
  }));

  it('should do something', function () {
    expect(!!notyNotification).toBe(true);
  });

});
