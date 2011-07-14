wb.views.home = {};
wb.views.home.card = new Ext.Panel({
    id: 'homeCard',
    dockedItems: {
        xtype: 'toolbar',
        title: 'The World Bank'
    },
    layout: {
        type: 'vbox'
    },
    items: [
        {
            xtype: 'button',
            text: 'Data by region',
            listeners: {
                tap: function () {
                    wb.views.cards.setActiveItem('regionsCard');
                }
            }
        }, {
            xtype: 'button',
            text: 'Data by indicator',
            listeners: {
                tap: function () {
                    Ext.Msg.alert("Coming soon");
                }
            }
        }, {
            xtype: 'button',
            text: 'Interesting data',
            listeners: {
                tap: function () {
                    Ext.Msg.alert("Coming soon");
                }
            }
        }, {
            xtype: 'button',
            text: 'Workbench',
            listeners: {
                tap: function () {
                    Ext.Msg.alert("Coming soon");
                }
            }
        },
        {
            xtype: 'button',
            cls: 'world',
            listeners: {
                tap: function () {
                    Ext.Msg.alert("This data &copy; etc etc");
                }
            }
        },
    ]
});

//----------------------

wb.views.regions = {};
wb.views.regions.toolbar = new Ext.Toolbar({
    title: "Regions",
    items: [{
        ui:'back',
        text: 'Home',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('homeCard', {type:'slide', direction:'right'});
        }}
    }]
});
wb.views.regions.list = new Ext.List({
    store: null,
    itemTpl: '{name}',
    listeners: {
        selectionchange: function (selectionModel, records) {
            if (records[0]) {
                wb.views.cards
                    .setActiveItem('regionCard')
                    .getActiveItem().update(records[0]);
            }
        }
    }
});

wb.views.regions.card = new Ext.Panel({
    id: 'regionsCard',
    dockedItems: [wb.views.regions.toolbar],
    items: [wb.views.regions.list]
});

//----------------------

wb.views.region = {};
wb.views.region.toolbar = new Ext.Toolbar({
    title: 'Region',
    items: [{
        ui:'back',
        text: 'Regions',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('regionsCard', {type:'slide', direction:'right'});
        }}
    }, {xtype:'spacer'}, {
        text: 'Home',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('homeCard', {type:'slide', direction:'right   '});
        }}
    }]
});
wb.views.region.card = new Ext.Panel({
    id: 'regionCard',
    layout: 'fit',
    dockedItems: [wb.views.region.toolbar],
    items: [
        (wb.views.region.list = new Ext.List({
            store: null,
            itemTpl: '{name}',
            listeners: {
                selectionchange: function (selectionModel, records) {
                    if (records[0]) {
                        wb.currentCountry = records[0];
                        if (!wb.currentIndicator) {
                            wb.views.cards.setActiveItem('topicsCard')
                        } else {
                            wb.views.cards
                                .setActiveItem('dataCard')
                                .getActiveItem().update(records[0]);
                        }
                    }
                }
            }
        }))
    ],
    update: function(region) {
        wb.views.region.toolbar.setTitle(region.get('name'));
        wb.views.region.list.bindStore(region.getCountries());
    }
});

//----------------------

wb.views.topics = {};
wb.views.topics.toolbar = new Ext.Toolbar({
    title: "Topics",
    items: [{
        ui:'back',
        text: 'Region',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('regionCard', {type:'slide', direction:'right'});
        }}
    }, {xtype:'spacer'}, {
        text: 'Home',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('homeCard', {type:'slide', direction:'right'});
        }}
    }]
});
wb.views.topics.list = new Ext.List({
    store: null,
    itemTpl: '{value}',
    listeners: {
        selectionchange: function (selectionModel, records) {
            if (records[0]) {
                wb.views.cards
                    .setActiveItem('topicCard')
                    .getActiveItem().update(records[0]);
            }
        }
    }
});
wb.views.topics.card = new Ext.Panel({
    id: 'topicsCard',
    layout: 'fit',
    dockedItems: [wb.views.topics.toolbar],
    items: [wb.views.topics.list]
});

//----------------------

wb.views.topic = {};
wb.views.topic.toolbar = new Ext.Toolbar({
    title: 'Topic',
    items: [{
        ui:'back',
        text: 'Topics',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('regionCard', {type:'slide', direction:'right'});
        }}
    }, {xtype:'spacer'}, {
        text: 'Home',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('homeCard', {type:'slide', direction:'right'});
        }}
    }]
});
wb.views.topic.list = new Ext.List({
    store: null,
    itemTpl: '{name}',
    listeners: {
        selectionchange: function (selectionModel, records) {
            if (records[0]) {
                wb.currentIndicator = records[0];
                if (!wb.currentCountry) {
                    wb.views.cards.setActiveItem('regionsCard')
                } else {
                    wb.views.cards
                        .setActiveItem('dataCard')
                        .getActiveItem().update();
                }
            }
        }
    }
});
wb.views.topic.card = new Ext.Panel({
    id: 'topicCard',
    layout: 'fit',
    dockedItems: [wb.views.topic.toolbar],
    items: [wb.views.topic.list],
    update: function(topic) {
        wb.views.topic.toolbar.setTitle(topic.get('value'));
        wb.views.topic.list.bindStore(topic.getIndicators());
    }
});

//----------------------

wb.views.data = {};
wb.views.data.study = new Ext.Button({
    text: 'Add to workbench',
    listeners: {tap: function () {
        alert('doing stuff with ' + this.countryIndicator.get('name'));
    }}
});

wb.views.data.toolbar = new Ext.Toolbar({
    title: 'Indicator',
    items: [
        {
            ui: 'back',
            text: 'Topic',
            listeners: {tap: function () {
                wb.views.cards.setActiveItem('topicCard', {type:'slide', direction:'right'});
            }}
        },
        {xtype:'spacer'},
        wb.views.data.study
    ]
});

wb.views.data.chart = new Ext.chart.Chart({
    title: 'Chart',
    store: null,
    interactions: [],
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
        showMarkers: false,
        fill: true,
        axis: 'left',
        xField: 'date',
        yField: 'value',
        style: {
            'stroke-width': 3,
            'fill': '#e5cfd1',
            'stroke': '#991924'
        }
    }]
});

wb.views.data.table = new Ext.List({
    title: 'Data',
    layout: 'fit',
    store: null,
    cls: 'grid',
    itemTpl: '<span class="date">{[values.date.getFullYear()]}</span><span class="value">{value}</span>'
});

wb.views.data.card = new Ext.TabPanel({
    id: 'dataCard',
    layout: 'fit',
    tabBar: {
        ui: 'light',
        layout: {pack: 'center'}
    },
    dockedItems: [wb.views.data.toolbar],
    items: [
        wb.views.data.chart,
        wb.views.data.table
    ],
    update: function() {
        var countryIndicator = wb.currentCountry.getCountryIndicator(wb.currentIndicator);
        wb.views.data.toolbar.setTitle(countryIndicator.get('name'));
        wb.views.data.study.countryIndicator = countryIndicator;
        var store = countryIndicator.getData();
        wb.views.data.chart.bindStore(store);
        wb.views.data.table.bindStore(store);
        
        //wb.models.recentCountries.add(country);
        //wb.models.recentCountries.sync();
    }
});

