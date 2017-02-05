'use strict';
 
clientApp.service('modalservice', function($modal) {

	var modalservice = {};
	var modalInstance;
	modalservice.show = function(size, templatename, controller,scope,windowSize) {

		modalInstance = $modal.open({
			templateUrl :templatename,
			controller : controller,
			size : size,
			scope :scope,
			windowClass : windowSize,
			resolve: {
                items: function () {
                    return scope;
                }
            }
		// resolve : {
		//	ngModel: function(){return _ngModel}
		//  }
		});
	}

	modalservice.hide = function() {
		modalInstance.close();
	}

	modalservice.close = function() {
        modalInstance.dismiss("cancel");
    }

	return modalservice;
});
