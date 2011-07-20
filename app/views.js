wd.views.home = {};

wd.views.homeCard = new Ext.Panel({
    dockedItems: [{
        xtype: 'toolbar',
        title: 'World Data',
        items: [{xtype:'spacer'}, {
            iconCls:'info',
            iconMask: true,
            ui: 'plain',
            listeners: {
                tap: function () {
                    Ext.Msg.alert("Attribution", "The datasets displayed in this application come from <a href='worldbank.org'>The World Bank</a>, via its JSONP API.");
                }
            }
        }]
    }],
    layout:'fit',
    items: [{
        xtype: 'list',
        store: wd.stores.curatedCountryIndicators,
        itemTpl: '{alias}',
        listeners: {
            selectionchange: function (selectionModel, records) {
                if (records[0]) {
                    wd.viewport.setActiveItem(wd.views.dataCard);
                    wd.views.dataCard.update(records[0]);
                }
            }
        }
    }]
});

//----------------------

wd.views.dataChart = new Ext.chart.Chart({
    title: 'Chart',
    store: null,
    theme: 'WorldData',
    interactions: [{
        type: 'reset'
    }, {
        type: 'panzoom'
    }],
    axes: [{
        type: 'Numeric',
        grid: true,
        position: 'left',
        fields: ['value'],
        title: 'Value'
    }, {
        type: 'Time',
        dateFormat: 'Y',
        grid: true,
        position: 'bottom',
        fields: ['date'],
        title: 'Date'
    }],
    series: [{
        type: 'line',
        lineWidth: 1,
        showMarkers: true,
        fill: true,
        axis: 'left',
        xField: 'date',
        yField: 'value'
    }]
});

wd.views.dataToolbar = new Ext.Toolbar({
    title: 'Indicator',
    items: [{
        ui:'back',
        text: 'Home',
        listeners: {tap: function () {
            wd.viewport.setActiveItem(wd.views.homeCard, {type:'slide', direction:'right'});
        }}
    }]
});

wd.views.dataCard = new Ext.Panel({
    id: '',
    layout: 'fit',
    dockedItems: [wd.views.dataToolbar],
    items: [
        wd.views.dataChart
    ],
    update: function(countryIndicator) {
        wd.views.dataToolbar.setTitle(countryIndicator.get('alias'));
        wd.views.dataChart.bindStore(countryIndicator.getData());
        wd.views.dataChart.axes.items[0].title = countryIndicator.get('unit')
        return this;
    }

});
