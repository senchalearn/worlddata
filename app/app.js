var wb = new Ext.Application({

    launch: function() {
        wb.cards = new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',
            defaults: {
                layout: 'fit'
            },
            items: [
                {
                    id: 'regionsCard',
                    dockedItems: [{
                        xtype: 'toolbar',
                        title: 'World Bank'
                    }],
                    items: [{
                        xtype: 'list',
                        store: wb.data.allRegions,
                        itemTpl: '{name}',
                        listeners: {
                            selectionchange: function (selectionModel, records) {
                                if (records[0]) {
                                    wb.cards
                                        .setActiveItem('regionCard')
                                        .getActiveItem().updateWithRecord(records[0]);
                                }
                            }
                        }
                    }]
                }, {
                    id: 'regionCard',
                    dockedItems: [(wb.regionCardToolbar = new Ext.Toolbar({
                        title: 'Region',
                        items: [{
                            ui:'back',
                            text: 'Regions',
                            listeners: {tap: function () {
                                wb.cards.setActiveItem('regionsCard', {type:'slide', direction:'right'});
                            }}
                        }]
                    }))],
                    items: [
                        (wb.regionCardList = new Ext.List({
                            store: null,
                            itemTpl: '{name}',
                            listeners: {
                                selectionchange: function (selectionModel, records) {
                                    if (records[0]) {
                                        wb.cards
                                            .setActiveItem('countryCard')
                                            .getActiveItem().updateWithCountry(records[0]);
                                    }
                                }
                            }
                        }))
                    ],
                    updateWithRecord: function(record) {
                        wb.regionCardToolbar.setTitle(record.get('name'));
                        wb.regionCardList.bindStore(record.getCountries());
                    }
                }, {
                    id: 'countryCard',
                    dockedItems: [(wb.countryCardToolbar = new Ext.Toolbar({
                        title: 'Country',
                        items: [{
                            ui:'back',
                            text: 'Region',
                            listeners: {tap: function () {
                                wb.cards.setActiveItem('regionCard', {type:'slide', direction:'right'});
                            }}
                        }, {xtype:'spacer'}, {
                            text: 'Home',
                            listeners: {tap: function () {
                                wb.cards.setActiveItem('regionsCard', {type:'slide', direction:'right   '});
                            }}
                        }]
                    }))],
                    layout: {type: 'vbox', align:'stretch'},
                    items: [
                        (wb.countryCardList = new Ext.List({
                            store: wb.data.allTopics,
                            itemTpl: '{value}',
                            listeners: {
                                selectionchange: function (selectionModel, records) {
                                    if (records[0]) {
                                        wb.cards
                                            .setActiveItem('topicCard')
                                            .getActiveItem().updateWithTopicAndCountry(records[0], this.country);
                                    }
                                }
                            }
                        }))
                    ],
                    updateWithCountry: function(country) {
                        wb.countryCardToolbar.setTitle(country.get('name'));
                        wb.countryCardList.country = country;
                    }
                }, {
                    id: 'topicCard',
                    dockedItems: [(wb.topicCardToolbar = new Ext.Toolbar({
                        title: 'Topic',
                        items: [{
                            ui:'back',
                            text: 'Country',
                            listeners: {tap: function () {
                                wb.cards.setActiveItem('countryCard', {type:'slide', direction:'right'});
                            }}
                        }, {xtype:'spacer'}, {
                            text: 'Home',
                            listeners: {tap: function () {
                                wb.cards.setActiveItem('regionsCard', {type:'slide', direction:'right'});
                            }}
                        }]
                    }))],
                    items: [
                        (wb.topicCardList = new Ext.List({
                            store: null,
                            itemTpl: '{name}',
                            listeners: {
                                selectionchange: function (selectionModel, records) {
                                    if (records[0]) {
                                        wb.cards
                                            .setActiveItem('indicatorCard')
                                            .getActiveItem().updateWithIndicatorAndCountry(records[0], this.country);
                                    }
                                }
                            }
                        }))
                    ],
                    updateWithTopicAndCountry: function(topic, country) {
                        wb.topicCardToolbar.setTitle(country.get('name') + ' ' + topic.get('value'));
                        wb.topicCardList.bindStore(topic.getIndicators());
                        wb.topicCardList.country = country;
                    }
                }, {
                    id: 'indicatorCard',
                    xtype: 'tabpanel',
                    tabBar: {
                        ui: 'light',
                        layout: {pack: 'center'}
                    },
                    dockedItems: [
                        (wb.indicatorCardToolbar = new Ext.Toolbar({
                            title: 'Indicator',
                            items: [
                                {
                                    ui: 'back',
                                    text: 'Topic',
                                    listeners: {tap: function () {
                                        wb.cards.setActiveItem('topicCard', {type:'slide', direction:'right'});
                                    }}
                                },
                                {xtype:'spacer'},
                                (wb.indicatorCardStudy = new Ext.Button({
                                    text: 'Study',
                                    listeners: {tap: function () {
                                        alert('doing stuff with ' + this.countryIndicator.get('name'));
                                    }}
                                }))
                            ]
                        }))
                    ],
                    items: [
                        (wb.indicatorCardChart = new Ext.chart.Chart({
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
                        })),
                        (wb.indicatorCardTable = new Ext.List({
                            title: 'Data',
                            layout: 'fit',
                            store: null,
                            cls: 'grid',
                            itemTpl: '<span class="date">{[values.date.getFullYear()]}</span><span class="value">{value}</span>'
                        }))
                    ],
                    updateWithIndicatorAndCountry: function(indicator, country) {
                        var countryIndicator = country.getCountryIndicator(indicator);
                        wb.indicatorCardToolbar.setTitle(countryIndicator.get('name'));
                        wb.indicatorCardStudy.countryIndicator = countryIndicator;
                        var store = countryIndicator.getData();
                        wb.indicatorCardChart.bindStore(store);
                        wb.indicatorCardTable.bindStore(store);
                        
                        //wb.data.recentCountries.add(country);
                        //wb.data.recentCountries.sync();
                    }
                }
            ] 
        });
    }


});