// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    //add later
    //var homeTpl = Handlebars.compile($("#home-tpl").html());
    //var employeeListTpl = Handlebars.compile($("#employee-list-tpl").html());

    //add later
    // function findByName() {
    //     service.findByName($('.search-key').val()).done(function (employees) {
    //         $('.content').html(employeeListTpl(employees));
    //     });
    // }

    /* ---------------------------------- Local Variables ---------------------------------- */
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EmployeeListView.prototype.template = Handlebars.compile($("#employee-list-tpl").html());
    var service = new EmployeeService();
    service.initialize().done(function () {
        $('body').html(new HomeView(service).render().$el);
    });
    /* --------------------------------- Event Registration -------------------------------- */
    // $('.search-key').on('keyup', findByName);
    // $('.help-btn').on('click', function() {
    //     alert("Employee Directory v3.4");
    // });

    /* ---------------------------------- Local Functions ---------------------------------- */
    // function findByName() {
    //     service.findByName($('.search-key').val()).done(function (employees) {
    //         var l = employees.length;
    //         var e;
    //         $('.employee-list').empty();
    //         for (var i = 0; i < l; i++) {
    //             e = employees[i];
    //             $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
    //         }
    //     });
    // }

    //add later
    document.addEventListener('deviceready', function () {
      if (navigator.notification) { // Override default HTML alert with native dialog
          window.alert = function (message) {
              navigator.notification.alert(
                  message,    // message
                  null,       // callback
                  "Workshop", // title
                  'OK'        // buttonName
              );
          };
      }
    }, false);
}());