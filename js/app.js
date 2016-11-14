(function() {
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .directive('foundItems', FoundItems);

  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItemList.html',
      scope: {
        list: '<myList',
        onRemove: '&'
      }
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  MenuSearchService.$inject = ['$http'];

  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    var promise;
    narrowCtrl.textSearch = "";
    narrowCtrl.message = undefined;

    narrowCtrl.narrowMenu = function() {
      if(narrowCtrl.textSearch !== "") {
        promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.textSearch);
        console.log(promise);
        promise.then(function(response) {
        console.log(response);
        narrowCtrl.found = response;
        if(narrowCtrl.found.length < 1) {
          narrowCtrl.message = "Nothing found!";
        } else {
          narrowCtrl.message = undefined;
        }
        });
      } else {
        narrowCtrl.message = "Nothing found!";
        narrowCtrl.found = [];
      }
    };

    narrowCtrl.removeItem = function(itemIndex) {
      console.log("Ha ingresado a leiminiar");
    };

  }

  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      var response =  $http  ({
      //return $http  ({
        method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      })
      .then(
        function (result) {
          var itemsResult = result.data;
          var foundItems = [];
            angular.forEach(itemsResult,function(item) {
              angular.forEach(item, function(itemLevel2) {
                if(itemLevel2.description.includes(searchTerm)) {
                  foundItems.push(itemLevel2);
                }
              })
            })
            console.log('Num reg found: ', foundItems.length);
            return foundItems;
          });
          return response;
    };
  }

})();
