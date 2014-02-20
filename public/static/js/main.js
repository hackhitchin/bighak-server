/**
 * Created by robberwick on 08/02/14.
 */
require.config({
    baseUrl: '/static/js/app',
    paths: {
        jquery: '../libs/jquery-1.11.0.min',
        lodash: '../libs/lodash-2.4.1.min'
    }
});

require(['jquery', 'bighak'], function($, Bighak){
    var bighak = Bighak();

    bighak.init();

});