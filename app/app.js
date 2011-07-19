var wd = new Ext.Application({
    name: 'wd',
    launch: function() {

        wd.views.cards = new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',
            items: [
                wd.views.home.card,
                wd.views.regions.card,
                wd.views.region.card,
                wd.views.topics.card,
                wd.views.topic.card,
                wd.views.data.card,
            ]

        });

        wd.views.regions.list.bindStore(wd.models.allRegions);
        wd.views.topics.list.bindStore(wd.models.allTopics);

        wd.views.home.list.bindStore(wd.models.curatedCountryIndicators);

    }


});
