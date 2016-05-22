app.service('validator', function() {
    //returns false if date invalid
    this.validateDate = function(date) {
        var now = new Date();
        var valDate = moment(date, "DD/MM/YYYY").toDate();
        if (valDate == "Invalid Date") {
            return false;
        }
        if ((now.getTime() - valDate.getTime()) <= 0) {
            return false;
        } else {
            return true;
        }
    }

    this.validateTieIds = function(id) {
        if (id > 0) {
            return true;
        } else {
            return false;
        }
    }
});