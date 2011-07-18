var wb = new Ext.Application({
    name: 'wb',
    launch: function() {

        wb.views.cards = new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',
            items: [
                wb.views.home.card,
                wb.views.regions.card,
                wb.views.region.card,
                wb.views.topics.card,
                wb.views.topic.card,
                wb.views.data.card,
            ]

        });

        wb.views.regions.list.bindStore(wb.models.allRegions);
        wb.views.topics.list.bindStore(wb.models.allTopics);

    }


});
