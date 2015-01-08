'use strict';

describe('Directive: wmwindow', function () {

  // load the directive's module
  beforeEach(module('ngWindowManager'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<wm-window></wm-window>');
    element = $compile(element)(scope);
    expect(element.children.length).toBe(3);
  }));
});
