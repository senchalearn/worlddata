wd.models = {}; //namespace for models & stores

//
//wd.models.DataPoint = Ext.regModel("", {
//    fields: [
//        {name: "value", type: "int"},
////        {name: "decimal", type: "int"},
//        {name: "date", type: "int"},
//    ]
//});

wd.models.CountryIndicator = Ext.regModel("", {
    fields: [
        {name: "countryId", type: "string"},
        {name: "countryName", type: "string"},
        {name: "indicatorId", type: "string"},
        {name: "indicatorName", type: "string"},
        {name: "name", type: "string", convert: function(value, record) {
            return record.get('indicatorName');
            return record.get('countryName') + ' ' + record.get('indicatorName');
        }},
        {name: "alias", type: "string"},
    ],
    _data: null,
    getData: function () {
        if (!this._data) {
            this._data = new Ext.data.Store({
                fields: [
                    {name: "date", type: "date", dateFormat: "Y"},
                    {name: "value", type: "float"}
                ],
                sorters: 'date',
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
                        root: '1',
                        read: function (response) {
                            if (response[1]) {
                                return Ext.data.JsonReader.superclass.read.call(this, response);
                            }
                            return this.nullResultSet;
                        }
                    }
                }
            });
        };
        return this._data;
    }

});

wd.models.Indicator = Ext.regModel("", {
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

wd.models.Topic = Ext.regModel("", {
    fields: [
        {name: "id", type: "string"},
        {name: "value", type: "string"},
        {name: "sourceNote", type: "string"}
    ],
    _indicators: null,
    getIndicators: function () {
        if (!this._indicators) {
            this._indicators = new Ext.data.Store({
                model: wd.models.Indicator,
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

wd.models.Country = Ext.regModel("", {
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
        model: wd.models.CountryIndicator,
        autoLoad: false
    }),
    getCountryIndicator: function(indicator) {
        var index = this._countryIndicators.findExact('indicatorId', indicator.get('id'));
        var countryIndicator = index != -1 ? this._countryIndicators.getAt(index) : null;
        if (!countryIndicator) {
            countryIndicator = new wd.models.CountryIndicator({
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

wd.models.Region = Ext.regModel("", {
    fields: [
        {name: "id", type: "string"},
        {name: "code", type: "string"},
        {name: "name", type: "string"}
    ],
    _countries: null,
    getCountries: function () {
        if (!this._countries) {
            this._countries = new Ext.data.Store({
                model: wd.models.Country,
                autoLoad: true,
                pageSize: 300,
                proxy: {
                    type: 'scripttag',
                    url: 'http://api.worldbank.org' +
                        '/regions/' + this.get('code') +
                        '/countries' +
                        '?format=jsonP',
                    callbackParam: 'prefix',
                    limitParam: 'per_page',
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


//wd.models.recentCountries = new Ext.data.Store({
//    model: wd.models.Country,
//    autoLoad: true,
//    proxy: {
//        type: 'memory'
//    }
//});


wd.models.allRegions = new Ext.data.Store({
    model: wd.models.Region,
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
            //var recentCountriesRegion = new wd.models.Region({name:'Recently used countries'});
            //recentCountriesRegion.getCountries = function () {
            //    return wd.models.recentCountries;
            //};
            //this.insert(0, recentCountriesRegion);
        }
    }
});

wd.models.allTopics = new Ext.data.Store({
    model: wd.models.Topic,
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

wd.models.curatedCountryIndicators = new Ext.data.Store({
    model: wd.models.CountryIndicator,
    data: [
        {alias:"US Energy Usage", countryId:"USA", indicatorId:"EG.USE.COMM.KT.OE", unit:"Kt of oil equivalent"},
        {alias:"Korean Tech Exports", countryId:"KOR", indicatorId:"TX.VAL.TECH.CD", unit:"Current US$"},
        {alias:"Chinese Rail Usage", countryId:"CHN", indicatorId:"IS.RRS.PASG.KM", unit:"Million-passenger-km"},
        {alias:"Greek National Balance", countryId:"GRC", indicatorId:"BN.CAB.XOKA.GD.ZS", unit:"% of GDP"},
        {alias:"Indian Urban Population", countryId:"IND", indicatorId:"SP.URB.TOTL.IN.ZS", unit:"% of total population"},
        {alias:"Ukrainian Tractor Population", countryId:"UKR", indicatorId:"AG.AGR.TRAC.NO", unit:"Tractors"},
    ]
});