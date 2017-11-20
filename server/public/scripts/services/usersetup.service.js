myApp.service('UserSetupService', function ($http) {
    console.log('UserSetupService loaded');
    var self = this;

    var storeToSave = {
        label: ''
    }

    var pantryToSave = {
        label: ''
    }

    self.stores = {
        allstores: []
    }
    self.userPantryList = [];

    self.saveStore = function(store) {
        storeToSave.label = store;
        return $http.post('/stores', storeToSave)
        .then(function(response) {
            console.log('new store added');
            self.getStores();
            return response;
        }).catch(function(error){
            console.log('Failed to add store', error);
        })
    }//end save store

    self.savePantry = function(pantry) {
        pantryToSave.label = pantry;
        return $http.post('/pantries', pantryToSave)
        .then(function(response){
            console.log('new pantry added');
            return response;
        }).catch(function(error){
            console.log('Failed to add pantry', error);
        })
    }//end save pantry

    self.getStores = function() {
        $http.get('/stores/userstores')
        .then(function(response) {
            self.stores.allstores = response.data;
            console.log('response data for stores', self.stores.allstores);
        }).catch(function(error){
            console.log('error');
        })
    }

    self.getPantries = function () {
        $http.get('/pantries/userpantries')
            .then(function (response) {
                self.userPantryList = response.data;
                console.log('response data for pantries', self.userPantryList);
            }).catch(function (error) {
                console.log('error');
            })
    }
})