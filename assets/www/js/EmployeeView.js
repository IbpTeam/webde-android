var EmployeeView = function(employee) {

	this.initialize = function() {
	    this.$el = $('<div/>');
	    this.$el.on('click', this.addLocation);//'.media', .add-location-btn
	};

	this.render = function() {
	    this.$el.html(this.template(employee));
	    return this;
	};

	this.addLocation = function(event) {
        console.log("in function addLocation");
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(
            function(position) {
                alert(position.coords.latitude + ',' + position.coords.longitude);
                console.log("position.coords.latitude + ',' + position.coords.longitude");
            },
            function() {
                alert('Error getting location');
                console.log("Error getting location");
            });
        return false;
	};

    this.initialize();
}