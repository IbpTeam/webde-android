var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        var destip = "192.168.160.176";//localhost
        url = serviceURL ? serviceURL : "http://" + destip + ":5000/employees";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url + "?name=" + searchKey});
    }


}