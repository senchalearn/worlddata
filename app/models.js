wd.models.CountryIndicator = Ext.regModel("", {
    fields: [
        {name: "countryId", type: "string"},
        {name: "indicatorId", type: "string"},
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


wd.stores.curatedCountryIndicators = new Ext.data.Store({
    model: wd.models.CountryIndicator,
    data: [
        {alias:"US Energy Usage", countryId:"USA", indicatorId:"EG.USE.COMM.KT.OE", unit:"Kt of oil equivalent"},
        {alias:"Korean Tech Exports", countryId:"KOR", indicatorId:"TX.VAL.TECH.CD", unit:"Current US$"},
        {alias:"Chinese Rail Usage", countryId:"CHN", indicatorId:"IS.RRS.PASG.KM", unit:"Million passenger km"},
        {alias:"Greek Debt", countryId:"GRC", indicatorId:"BN.CAB.XOKA.GD.ZS", unit:"Balance (% of GDP)"},
        {alias:"Urban Growth in India", countryId:"IND", indicatorId:"SP.URB.TOTL.IN.ZS", unit:"Urban population (% of total)"},
        {alias:"Ukrainian Tractors", countryId:"UKR", indicatorId:"AG.AGR.TRAC.NO", unit:"Number of tractors"},
    ]
});