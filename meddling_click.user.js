// ==UserScript== 
// @name           meddling_click
// @namespace      http://d.hatena.ne.jp/samurai20000/
// @include        http://*
// @include        https://*
// ==/UserScript==

(function() {
    function MeddlingClick() {
        this.init.apply(this, arguments);
    }

    MeddlingClick.prototype = {
        init: function () {
            var a = document.querySelectorAll('a, input, textarea, button, img');
            this.links = {};

            for (var i = 0, j = a.length; i < j; i++) {
                this.links[a[i]] = this.getElementPosition(a[i]);
                this.links[a[i]].elm = a[i];
            }
        },

        getTargetLink: function (e) {
            var pos        = this.getMousePosition(e);
            var targetLink = null;
            var min        = Infinity;

            for (var key in this.links) {
                var link = this.links[key];

                var d = this.getDistance(pos, link);

                if (min > d && this.is_MeddlingArea(link.height, d)) { 
                    min = d;
                    targetLink = link;
                }
            }

            if (targetLink) {
                this.focus(targetLink.elm);
                this.click(targetLink.elm);
            }
        },

        getDistance: function(mouse_pos, link) {
            var distance = Infinity;
            if (mouse_pos.x < link.left) {
                if (mouse_pos.y < link.top) {
                    distance = Math.sqrt(Math.pow(link.left - mouse_pos.x, 2) +
                                         Math.pow(link.top - mouse_pos.y, 2));
                } else if (mouse_pos.y >= link.top && mouse_pos.y <= link.bottom) {
                    distance = Math.sqrt(Math.pow(link.left - mouse_pos.x, 2));
                } else {
                    distance = Math.sqrt(Math.pow(link.left - mouse_pos.x, 2) +
                                         Math.pow(link.bottom - mouse_pos.y, 2));
                }
            } else if (mouse_pos.x >= link.left && mouse_pos.x <= link.right) {
                if (mouse_pos.y < link.top) {
                    distance = Math.sqrt(Math.pow(link.top - mouse_pos.y, 2));
                } else {
                    distance = Math.sqrt(Math.pow(link.bottom - mouse_pos.y, 2));
                }
            } else {
                if (mouse_pos.y < link.top) {
                    distance = Math.sqrt(Math.pow(link.right - mouse_pos.x, 2) +
                                         Math.pow(link.top - mouse_pos.y, 2));
                } else if (mouse_pos.y >= link.top && mouse_pos.y <= link.bottom) {
                    distance = Math.sqrt(Math.pow(link.right - mouse_pos.x, 2));
                } else {
                    distance = Math.sqrt(Math.pow(link.right - mouse_pos.x, 2) +
                                         Math.pow(link.buttom - mouse_pos.y, 2));
                }
            }
            return distance;
        },

        is_MeddlingArea: function(link_height, distance){
            var area = Math.sqrt(Math.pow(link_height, 2) * 2);
            return area >= distance ? true : false;
        },

        click: function(elm) {
            if (elm.href) location.href = elm.href;
        },

        focus: function(elm) {
            elm.focus();
        },

        getMousePosition: function (e) {
            var pos = {
                x: e.pageX + document.documentElement.scrollLeft,
                y: e.pageY + document.documentElement.scrollTop
            };
            return pos;
        },

        getElementPosition: function (elm) {
            var pos = elm.getBoundingClientRect();
            return {
                width  : Math.round(pos.width),
                height : Math.round(pos.height),
                left   : Math.round(pos.left),
                top    : Math.round(pos.top),
                right  : Math.round(pos.right),
                bottom : Math.round(pos.bottom)
            };
        }
    };

    // main
    var meddling_click = new MeddlingClick();
    document.addEventListener('mouseup', function(event) {meddling_click.getTargetLink(event)}, false);
}());


