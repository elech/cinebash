var _ = require('lodash');


exports.paginate = function(query){
	var pagination = {};
	pagination.skip = query.offset || 0;
	pagination.limit = query.limit || 50;
	return pagination;
}

exports.generatePagination = function(dbParams, pagination){
		var paginationURLs = {};
		var queryString = "?";
		_.map(dbParams, function(val, key, dbParams){
			queryString += key + "=" + val + "&";
		})
		paginationURLs.next = queryString + "offset=" + (parseInt(pagination.skip) + parseInt(pagination.limit)) + "&limit=" + pagination.limit;
		paginationURLs.prev = queryString;
		return paginationURLs;
}