const moment = require('moment');

module.exports = {
    generateDate : function(date,format) {
        return moment(date).format(format);
    }
}