var idToURIConverter;
idToURIConverter = {

    convertIdToURI: function (id) {
        return "<http://foodsafety.data.admin.ch/business/" + id + ">";
    },

    convertURIToId: function (uri) {
        var a = uri.indexOf("business") + 9;
        return uri.substring(a,uri.length-1);
    }

};
