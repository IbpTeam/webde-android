var HomeView = function (service) {
    var employeeListView;

    this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div/>');
        this.$el.on('keyup', '.search-key', this.findByName);
        employeeListView = new EmployeeListView();
        this.render();
        console.log("in HomeView`s initialize.");
    };

    // function renderHomeView() {
    //     $('body').html(homeTpl());
    //     $('.search-key').on('keyup', findByName);
    // }

    this.render = function() {
        this.$el.html(this.template());
        $('.content', this.$el).html(employeeListView.$el);
        return this;
    };
    
    this.findByName = function() {
        service.findByName($('.search-key').val()).done(function(employees) {
            employeeListView.setEmployees(employees);
        });
    };

    this.initialize();
}