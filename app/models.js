wb.data = {}, //namespace for models & stores

//
//wb.data.DataPoint = Ext.regModel("", {
//    fields: [
//        {name: "value", type: "int"},
////        {name: "decimal", type: "int"},
//        {name: "date", type: "int"},
//    ]
//});

wb.data.CountryIndicator = Ext.regModel("", {
    fields: [
        {name: "countryId", type: "string"},
        {name: "countryName", type: "string"},
        {name: "indicatorId", type: "string"},
        {name: "indicatorName", type: "string"},
        {name: "name", type: "string", convert: function(value, record) {
            return record.get('countryName') + ' ' + record.get('indicatorName');
        }},
    ],
    _data: null,
    getData: function () {
        if (!this._data) {
            this._data = new Ext.data.Store({
                fields: [
                    {name: "date", type: "int"},
                    {name: "value", type: "float"},
                ],
                autoLoad: true,
                proxy: {    
                    type: 'scripttag',
                    url: 'http://api.worldbank.org' +
                        '/countries/' + this.get('countryId') +
                        '/indicators/' + this.get('indicatorId') +
                        '?per_page=100&MRV=100&frequency=Y&format=jsonP',
                    callbackParam: 'prefix',
                    reader: {
                        type: 'json',
                        root: '1'
                    }
                }
            });
        };
        return this._data;
    }

});

wb.data.Indicator = Ext.regModel("", {
    fields: [
        {name: "id", type: "string"},
        {name: "name", type: "string"},
        {name: "source", type: "string", convert: function (value) {
            return value.value;
        }},
        {name: "sourceNote", type: "string"},
        {name: "sourceOrganization", type: "string"}
    ]
});

wb.data.Topic = Ext.regModel("", {
    fields: [
        {name: "id", type: "string"},
        {name: "value", type: "string"},
        {name: "sourceNote", type: "string"}
    ],
    _indicators: null,
    getIndicators: function () {
        if (!this._indicators) {
            this._indicators = new Ext.data.Store({
                model: wb.data.Indicator,
                autoLoad: true,
                proxy: {    
                    type: 'scripttag',
                    url: 'http://api.worldbank.org' +
                        '/topics/' + this.get('id') +
                        '/indicators/' +
                        '?format=jsonP',
                    callbackParam: 'prefix',
                    reader: {
                        type: 'json',
                        root: '1'
                    }
                }
            });
        };
        return this._indicators;
    }
});

wb.data.Country = Ext.regModel("", {
    fields: [
        {name: "id", type: "string"},
        {name: "iso2Code", type: "string"},
        {name: "name", type: "string"},
        {name: "capitalCity", type: "string"},
        {name: "longitude", type: "string"},
        {name: "latitude", type: "string"},
        {name: "incomeLevel", type: "string", convert: function (value) {
            return value.value;
        }},
        {name: "lendingType", type: "string", convert: function (value) {
            return value.value;
        }}
    ],
    _countryIndicators: new Ext.data.Store({
        model: wb.data.CountryIndicator,
        autoLoad: false
    }),
    getCountryIndicator: function(indicator) {
        var index = this._countryIndicators.findExact('indicatorId', indicator.get('id'));
        var countryIndicator = index != -1 ? this._countryIndicators.getAt(index) : null;
        if (!countryIndicator) {
            console.log('made new countryIndicator');
            countryIndicator = new wb.data.CountryIndicator({
                countryId: this.get('id'),
                countryName: this.get('name'),
                indicatorId: indicator.get('id'),
                indicatorName: indicator.get('name')
            });
            this._countryIndicators.add(countryIndicator);
        };
        return countryIndicator;
    }
});

wb.data.Region = Ext.regModel("", {
    fields: [
        {name: "id", type: "string"},
        {name: "code", type: "string"},
        {name: "name", type: "string"}
    ],
    _countries: null,
    getCountries: function () {
        if (!this._countries) {
            this._countries = new Ext.data.Store({
                model: wb.data.Country,
                autoLoad: true,
                proxy: {
                    type: 'scripttag',
                    url: 'http://api.worldbank.org' +
                        '/regions/' + this.get('code') +
                        '/countries' +
                        '?format=jsonP',
                    callbackParam: 'prefix',
                    reader: {
                        type: 'json',
                        root: '1'
                    }
                }
            });
        };
        return this._countries;
    }
});


wb.data.recentCountries = new Ext.data.Store({
    model: wb.data.Country,
    autoLoad: true,
    proxy: {
        type: 'memory'
    }
});


wb.data.allRegions = new Ext.data.Store({
    model: wb.data.Region,
    autoLoad: true,
    proxy: {
        type: 'scripttag',
        url: 'http://api.worldbank.org/region?format=jsonP',
        callbackParam: 'prefix',
        reader: {
            type: 'json',
            root: '1'
        }
    },
    listeners: {
        load: function () {
            var recentCountriesRegion = new wb.data.Region({name:'Recently used countries'});
            recentCountriesRegion.getCountries = function () {
                return wb.data.recentCountries;
            }
            this.insert(0, recentCountriesRegion);
        }
    }
});

wb.data.allTopics = new Ext.data.Store({
    model: wb.data.Topic,
    autoLoad: true,
    proxy: {
        type: 'scripttag',
        url: 'http://api.worldbank.org/topics?format=jsonP',
        callbackParam: 'prefix',
        reader: {
            type: 'json',
            root: '1'
        }
    }
});