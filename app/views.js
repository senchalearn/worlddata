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
                    wb.resetSelections();
                    wb.views.cards.setActiveItem(
                        wb.views.regions.card.update(wb.views.home.card, 'Home')
                    );
                }
            }
        }, {
            xtype: 'button',
            text: 'Data by indicator',
            listeners: {
                tap: function () {
                    wb.resetSelections();
                    wb.views.cards.setActiveItem(
                        wb.views.topics.card.update(wb.views.home.card, 'Home')
                    );
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
wb.views.regions.backButton = new Ext.Button({
    ui:'back',
    text: 'Home',
    backTo: 'homeCard',
    listeners: {tap: function () {
        wb.resetCountry();
        wb.views.cards.setActiveItem(this.backTo, {type:'slide', direction:'right'});
    }}
});
wb.views.regions.toolbar = new Ext.Toolbar({
    title: "Regions",
    items: [wb.views.regions.backButton]
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
    items: [wb.views.regions.list],
    update: function(backTo, text) {
        wb.views.regions.backButton.setText(text).backTo = backTo;
        return this;
    }
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
                            wb.views.cards.setActiveItem(
                                wb.views.topics.card.update(wb.views.region.card, 'Region')
                            );
                        } else {
                            wb.views.cards.setActiveItem(
                                wb.views.data.card.update(wb.views.region.card, 'Region')
                            );
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
wb.views.topics.backButton = new Ext.Button({
    ui:'back',
    text: 'Home',
    backTo: 'homeCard',
    listeners: {tap: function () {
        wb.resetIndicator();
        wb.views.cards.setActiveItem(this.backTo, {type:'slide', direction:'right'});
    }}
});
wb.views.topics.toolbar = new Ext.Toolbar({
    title: "Topics",
    items: [wb.views.topics.backButton]
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
    items: [wb.views.topics.list],
    update: function(backTo, text) {
        wb.views.topics.backButton.setText(text).backTo = backTo;
        return this;
    }
});

//----------------------

wb.views.topic = {};
wb.views.topic.toolbar = new Ext.Toolbar({
    title: 'Topic',
    items: [{
        ui:'back',
        text: 'Topics',
        listeners: {tap: function () {
            wb.views.cards.setActiveItem('topicsCard', {type:'slide', direction:'right'});
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
                    wb.views.cards.setActiveItem(
                        wb.views.regions.card.update(wb.views.topic.card, 'Topic')
                    );
                } else {
                    wb.views.cards.setActiveItem(
                        wb.views.data.card.update(wb.views.topic.card, 'Topic')
                    );
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
wb.views.data.backButton = new Ext.Button({
    ui:'back',
    text: 'Home',
    backTo: 'homeCard',
    listeners: {tap: function () {
        wb.views.cards.setActiveItem(this.backTo, {type:'slide', direction:'right'});
    }}
});

wb.views.data.study = new Ext.Button({
    text: 'Add to workbench',
    listeners: {tap: function () {
        alert('doing stuff with ' + this.countryIndicator.get('name'));
    }}
});

wb.views.data.toolbar = new Ext.Toolbar({
    title: 'Indicator',
    items: [
        wb.views.data.backButton,
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
    update: function(backTo, text) {
        wb.views.data.backButton.setText(text).backTo = backTo;

        var countryIndicator = wb.currentCountry.getCountryIndicator(wb.currentIndicator);
        wb.views.data.toolbar.setTitle(countryIndicator.get('name'));
        wb.views.data.study.countryIndicator = countryIndicator;
        var store = countryIndicator.getData();
        wb.views.data.chart.bindStore(store);
        wb.views.data.table.bindStore(store);

        //wb.models.recentCountries.add(country);
        //wb.models.recentCountries.sync();

        return this;
    }

});

wb.resetSelections = function() {
    wb.resetCountry();
    wb.resetIndicator();
}
wb.resetCountry = function() {
    wb.currentCountry = null;
    wb.views.regions.list.selModel.deselectAll();
    wb.views.region.list.selModel.deselectAll();
}
wb.resetIndicator = function() {
    wb.currentIndicator = null;
    wb.views.topics.list.selModel.deselectAll();
    wb.views.topic.list.selModel.deselectAll();
}