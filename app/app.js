var wd = new Ext.Application({
    name: 'wd',

    launch: function() {

        wd.viewport = new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',
            items: [
                wd.views.homeCard,
                wd.views.dataCard,
            ]

        });

    }
});
