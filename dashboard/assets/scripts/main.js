/*jshint browser: true*/
/*global $:false */
'use strict';
(function($) {


    var $itemItems = $('.item-list li');
    var categoryItems = $('.category li');
    var legendItems = $('.legend li');

    var clearButtons = $('.filter-clear');

    var sidebar = $('.sidebar');
    var menuButton = $('.menu-icon');
    var isOpen = false;

    var changeActiveItem = function($items, theClass, $context) {
        $items.removeClass(theClass);
        $context.addClass(theClass);
    };

    var clearFilters = function($context) {
        $context.css('display', 'none');
        var listItems = $context.parent().find('li');
        $(listItems).removeClass('active');

    };

    var showClearButton = function($context) {
        $context.parent().parent().find('.filter-clear').css('display', 'block');
    };

    var filterItems = function() {
        var $activeSidebarItems = $('.sidebar .active');
        var filters = $activeSidebarItems.data('category');

        // filter list items based on category matches
        $itemItems.addClass('hide');
        $itemItems.filter('.' + filters).removeClass('hide');
    };

    var catItemsClick = function() {
        changeActiveItem(categoryItems, 'active', $(this));
        filterItems();
    };

    var legendItemsClick = function() {
        changeActiveItem(legendItems, 'active', $(this));
        showClearButton($(this));
        filterItems();
    };

    var clearButtonsClick = function() {
        clearFilters($(this));
        filterItems();
    };

    var menuButtonClick = function() {
        if (!isOpen) {
            isOpen = true;
            sidebar.addClass('open');
        } else {
            isOpen = false;
            sidebar.removeClass('open');
        }
    };

    // Events
    categoryItems.on('click', catItemsClick);

    legendItems.on('click', legendItemsClick);

    clearButtons.on('click', clearButtonsClick);

    menuButton.on('click', menuButtonClick);

})($);