/*
* jQuery Power Pinboard Plugin 3.0.0
*
* Copyright (c) 2010 Bill SerGio, The Infomercial King (tvmogul@gmail.com)
*
* I used $.ajax() jQuery method instead of the limited functionality in the $.getJSON() method of in the jQuery library.
* The $.ajax() method gives us access to the Error call back method of the AJAX request. 
* With this method and my unified AJAX response, handling errors is actually quite easy. 
* All AJAX errors are piped through my AJAXFailHandler() method which creates a "fail" AJAX response 
* and sets SUCCESS flag to false) and then manually executes the AJAX callback, passing in the fail response. 
* MIT (http://www.opensource.org/licenses/mit-license.php) licensed.
* GNU GPL (http://www.gnu.org/licenses/gpl.html) licensed.
*/
(function ($, undefined) {
    "use strict";
    var isLoading = false;

    $.fn.rsslistfetch = function (content, opts) {

        // Default parameters
        var defaults = {
            page: 1,
            entries: 50,
            apiURL: 'ppdata/data1.txt',   //'ppdata/software.html';
            dataType: 'json',    //'html';    //dataType = {'json', 'jsonp', 'html', 'static' }
            header: false,
            headerclass: '',
            text: false,
            images: true,
            fulltext: false,
            date: false,
            speed: 900,
            selector: '>div',
            easing: 'easeOutElastic',
            onhover: 'rocker'
        };
        var opts = $.extend(defaults, opts);


        var selector = this;

        var now = Date.parse(new Date());
        var category = opts;
        //this.version = '3.1.0';
        this.opts = opts;

        this.$element = $(content).css('position', 'relative');


        var _page = opts.page;
        var _entries = opts.entries;
        var _apiURL = opts.apiURL;
        var _dataType = opts.dataType;
        var _onhover = opts.onhover;
        var _header = opts.header;
        var _headerclass = opts.headerclass;
        var _text = opts.text;
        var _images = opts.images;
        var _fulltext = opts.findUrl;
        var _date = opts.date;

        //var container = $(this);
        //var containerId = container.attr('id');
        //container.empty();

        /**
        * Begins the API call to retrieve dat from local file or external source
        */
        //function loadData() {
        if (dataType === 'static') {
            isLoading = false;
            // dataType = 'static', i.e., html is already embedded in web page
            applyLayout();
            retutn;
        }

        // Capture scroll event.
        //$(document).bind('scroll', onScroll);

        isLoading = true;
        //$('#loaderCircle').show();

        // Here we are retrieving our json data from a local file so we do not have any cross domain issue
        if ((dataType === 'json') || (dataType === 'html')) {
            $.ajax({
                url: apiURL,
                cache: false,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: dataType,
                crossDomain: true,    // this is set to true so it works in editors liek vs2013
                data: { page: page }, // Page parameter to make sure we load new data
                success: onLoadData,
                //success: function (data) {
                //    var outputData = $.parseJSON(data.Data);
                //    token = outputData.Token;
                //    ExecuteOtherRequests(token);
                //},
                error: function (e) {
                    isLoading = false;
                    $('#pinboard').html('');
                    //alert('error:' + JSON.stringify(e));
                    $('#pinboard').html(JSON.stringify(e));
                    $('#pinboard').css('text-align', 'left');
                }
            });
        }
        else if (dataType === 'jsonp') { // We use JSONP to resolve a cross domain call
            // Author: Bill SerGio:
            // To deal with the problem of making a cross domain call from the browser we will use JSONP.
            // The 2 main ways of implementing JSONP are using eithier a webservice (typically PHP or C# .NET) or a C# .NET Hnadler.

            //C# .NET HANDLER
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // The design concept I prefer for JSONP was that instead of having multiple generic handlers or a single handler
            // with lots of switch/if statement I prefer to use a single generic handler with Factory design pattern.
            // The Factory returns a class based upon the methodName that is passed which is used to only handle that request.
            // The Factory reads the methodName and its class from the web.config file and instantiates the handler.
            // The generic handler requests the Factory for the handler and performs some pre/post processing.
            // See my article on implemmenting a JSONP Handler for JSONP: http://www.software-rus.com/Software/_JSONPMobileHandler/index.html
            // In this example we pass in all the parameters as url variables:
            var _cat = "cars";
            var _start = 1;
            var _max = 50;
            var _pc = 90403;  //_pc = postal code
            var _rad = 50; // _rad = zip code radius for trageting ads by zip code radius
            // The code below will not work until you setup your JSONP server!!!
            // See my article for full source code: http://www.software-rus.com/Software/_JSONPMobileHandler/index.html
            var url = 'http://www.YOUR_DOMAIN.com/rsshandler.ashx?cat=' + _cat + '&start=' + _start + '&max=' + _max + '&pc=' + _pc + '&rad=' + _rad + '&methodName=Feeds&jsonp=onLoadData';
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp'
            });

            //PHP JSONP METHOD
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // For those people who prefer using PHP you can setup your own JSONP Server on PHP as follows:
            // ============================================================================================
            //JAVASCRIPT
            //$.getJSON('http://www.YOUR_DOMAIN.com/jsonp.php?callback=?','firstname=Jeff',function(res){
            //    alert('Your name is '+res.fullname);
            //});
            //SERVER SIDE
            //<?php
            //    $fname = $_GET['firstname'];
            //    if($fname=='Bill')
            //    {
            //        //header("Content-Type: application/json");
            //        echo $_GET['callback'] . '(' . "{'fullname' : 'Bill SerGio'}" . ')';
            //    }
            //?>
            //Ready-made JSONP services
            //Now that you know how to use JSONP, you can start using some ready-made JSONP Web services
            //to build your applications and mashups. Following are some starting points for your next
            //development projects. (Hint: You may copy-and-paste the given URLs into the address
            //field of your browser to examine the resulting JSONP response.)
            //Digg API: Top stories from Digg:
            //http://services.digg.com/stories/top?appkey=http%3A%2F%2Fmashup.com&type=javascript
            //&callback=?
            //Geonames API: Location info for a zip-code:
            //http://www.geonames.org/postalCodeLookupJSON?postalcode=10504&country=US&callback=?
            //Flickr API: Most recent cat pictures from Flickr:
            //http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any
            //&format=json&jsoncallback=?
            //Yahoo Local Search API: Search pizza in zip-code location 10504:
            //http://local.yahooapis.com/LocalSearchService/V3/localSearch?appid=YahooDemo&query=pizza
            //&zip=10504&results=2&output=json&callback=?
        }

        /**
        * Receives data from the API, creates HTML for images and updates the layout
        */
        function onLoadData(data) {

            isLoading = false;
            //$('#loaderCircle').hide();

            // Increment page index for future calls.
            page++;

            var html = '';

            // This will load plain html with no script tags
            //apiURL = 'ppdata/data.html',
            //dataType = 'html'
            if (dataType === 'html') {
                html = data;
            }
            else {
                // Create HTML for images.
                var i = 0, length = data.length, image;
                for (; i < length; i++) {

                    //<div class="col-sm-3 code" data-foo="5">
                    //    <span class="insides">
                    //        <img style="width:100%;height:120px;" src="img_software/MobileChess.png" />
                    //        <p class="ztitle center-wrapper">Angular Responsive Shopping Cart</p>
                    //        <p class="zdesc">Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah </p>
                    //        <div class="zurl"><a href="http://www.software-rus.com/Software/_Angular_Responsive_Cart/index.html" target="_blank">source code</a></div>
                    //    </span>
                    //</div>

                    image = data[i];

                    html += '<div class="col-sm-3 ' + image.filters + '" data-foo="' + image.foo + '">';

                    html += '<span class="insides">';

                    // Video or Image?
                    if (image.video.length > 0) {
                        html += '<iframe width="100%" height="200" src="' + image.video + '" frameborder="0" allowfullscreen="true"></iframe>';
                    }
                    else {
                        //To vary height based on width you can use the code slashed out below:
                        //if ((image.width === 'undefined') || (image.width === '') || (image.width === 0)) { //To avoid division by zero NaN result
                        //    html += '<img src="' + image.preview + '" width="100%" height="200" style="height: 200px !important;">';
                        //} else { html += '<img src="' + image.preview + '" width="200" height="' + Math.round(image.height / image.width * 200) + '">'; }
                        //  html += '<img src="' + image.preview + '" style="width: 77% !important;height: 200px !important;">';
                        html += '<img src="' + image.preview + '" style="max-width: 100% !important;width: auto !important;height: 200px !important;">';
                    }

                    // Image Title.
                    html += '<p class="ztitle center-wrapper">' + image.title + '</p>';

                    // Image Description.
                    html += '<p class="zdesc">' + image.desc + '</p>';

                    // Image Url.
                    html += '<div class="zurl"><a href="' + image.url + '" target="_blank">source code</a></div>';

                    html += '</span></div>';
                }
            }

            // Clear contents of our Pinboard Container!
            $('#pinboard').empty();

            // Add image HTML to page.
            $('#pinboard').html(html);


            // Apply layout.
            applyLayout();

        };

        $.fn.Rocker = function (method, options) {
            options = $.extend({
                degrees: ['1', '3', '1', '0', '-1', '-3', '-1', '0'],
                delay: 69,
                limit: null,
                randomStart: true,
                onRocker: function (o) {
                },
                onRockerStart: function (o) {
                },
                onRockerStop: function (o) {
                }
            }, options);
            var methods = {
                rock: function (o, step) {
                    if (step === undefined) {
                        step = options.randomStart ? Math.floor(Math.random() * options.degrees.length) : 0;
                    }
                    if (!$(o).hasClass('rocking')) {
                        $(o).addClass('rocking');
                    }
                    var degree = options.degrees[step];
                    $(o).css({
                        '-webkit-transform': 'rotate(' + degree + 'deg)',
                        '-moz-transform': 'rotate(' + degree + 'deg)',
                        '-ms-transform': 'rotate(' + degree + 'deg)',
                        '-o-transform': 'rotate(' + degree + 'deg)',
                        '-sand-transform': 'rotate(' + degree + 'deg)',
                        'transform': 'rotate(' + degree + 'deg)'
                    });
                    if (step === (options.degrees.length - 1)) {
                        step = 0;
                        if ($(o).data('rocks') === undefined) {
                            $(o).data('rocks', 1);
                        }
                        else {
                            $(o).data('rocks', $(o).data('rocks') + 1);
                        }
                        options.onRocker(o);
                    }
                    if (options.limit && $(o).data('rocks') == options.limit) {
                        return methods.stop(o);
                    }
                    o.timeout = setTimeout(function () {
                        methods.rock(o, step + 1);
                    }, options.delay);
                },
                stop: function (o) {
                    $(o).data('rocks', 0);
                    $(o).css({
                        '-webkit-transform': 'rotate(0deg)',
                        '-moz-transform': 'rotate(0deg)',
                        '-ms-transform': 'rotate(0deg)',
                        '-o-transform': 'rotate(0deg)',
                        '-sand-transform': 'rotate(0deg)',
                        'transform': 'rotate(0deg)'
                    });
                    if ($(o).hasClass('rocking')) {
                        $(o).removeClass('rocking');
                    }
                    clearTimeout(o.timeout);
                    o.timeout = null;
                    options.onRockerStop(o);
                },
                isRocking: function (o) {
                    return !o.timeout ? false : true;
                }
            };
            if (method === 'isRocking' && this.length === 1) {
                return methods.isRocking(this[0]);
            }
            this.each(function () {
                if ((method === 'start' || method === undefined) && !this.timeout) {
                    methods.rock(this);
                    options.onRockerStart(this);
                }
                else if (method === 'stop') {
                    methods.stop(this);
                }
            });
            return this;
        };


        /**
        * Refreshes layout.
        */
        function applyLayout() {

            var $pinboard = jQuery('#pinboard');
            $pinboard.powerpinboard({
                speed: opts.speed,        //900,
                selector: opts.selector,  // '>div',
                easing: opts.easing       //'easeOutElastic'
            });

            $('div#pinboard div').hover(function () {

                if (onhover === 'rocker') {
                    $(this).Rocker('start');
                    //part#2
                    //var matchedElementSize = $('div#pinboard div').size();
                    //interval = setInterval(function () {
                    //    $($('div#pinboard div').get(Math.floor(Math.random() * matchedElementSize))).Rocker('start', { limit: 5 });
                    //}, 1000);
                }
                else if (onhover === 'spin360') {
                    $(this).removeClass('spin360');
                    $(this).addClass('spin360');
                }
            }, function () {
                if (onhover === 'rocker') {
                    $(this).Rocker('stop');
                    //part#2
                    //clearInterval(interval);
                }
                else if (onhover === 'spin360') {
                    $(this).removeClass('spin360');
                }
            });

        };

        return this;
    };



    var PowerPinboard = function (content, params) {
        this.params = params;
        this.$element = $(content).css('position', 'relative');
        this._init();
    };

    PowerPinboard.prototype = {
        _init: function () {
            this.items = $(this.params.selector, this.$element).css({
                position: 'absolute',
                top: 0,
                left: 0
            }).data('pinboard', 1);
            this.position();
            var t = this, timer;
            $(window).on('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    t.position();
                }, 100);
            });
        },
        _max: function (x, w, hs) {
            var i = w, j = hs[x];
            while (i--) {
                if (j < hs[x + i])
                    j = hs[x + i];
            }
            return j;
        },
        position: function () {
            var w = parseInt(this.$element.width()), is = this.items.filter(function () {
                return $(this).data('pinboard');
            }), l = is.length, i = w + 1, hs = [], j, _x = 0;
            while (i--)
                hs[i] = 0;
            for (i = 0; i < l; i++) {
                var $i = is.eq(i),
					_r = $i[0].getBoundingClientRect(),
                    			$iw = Math.floor(_r.width),
                    			$ih = Math.floor(_r.height),
					x = 0,
					j = 0,
					h = Infinity,
					_h = h,
					k,
					_w,
					_k;
                while (j <= w) {
                    k = j - 1;
                    _w = j + $iw;
                    while (k++ <= _w) {
                        _k = k + $iw;
                        if (_k <= w) {
                            _h = this._max(k, $iw, hs) + $ih;
                            if (h > _h) {
                                h = _h;
                                x = k;
                            }
                        }
                    }
                    j += $iw;
                }
                $i.stop().animate({
                    left: x,
                    top: h - $ih
                }, this.params.speed, this.params.easing);
                j = $iw;
                while (j--)
                    hs[j + x] = h;
            }
            this.$element.height(Math.max.apply(Math, hs));
        },
        filter: function (selector) {
            this.items.data('pinboard', 1).show().not(selector).data('pinboard', 0).hide();
            this.position();
        },
        sort: function (by, way) {
            if (by == undefined)
                by = 'text';
            if (way == undefined)
                way = 'asc';
            this.items.sort(function (a, b) {
                var $a, $b;
                if (by != 'text') {
                    $a = $(a).data(by);
                    $b = $(b).data(by);
                } else {
                    $a = $(a).text();
                    $b = $(b).text();
                }
                if (way == 'asc')
                    if ($a > $b)
                        return 1;
                    else
                        return -1;
                else if ($a < $b)
                    return 1;
                else
                    return -1;
            }).appendTo(this.$element);
            this.position();
        }

    };
    $.fn.powerpinboard = function (option, p1, p2) {
        return this.each(function () {
            var $this = $(this), data = $this.data('pinboard'), params = $.extend({}, $.fn.powerpinboard.defaults, $this.data(), typeof option == 'object' && option);
            if (!data)
                $this.data('pinboard', (data = new PowerPinboard(this, params)));
            if (typeof option == 'string')
                data[option](p1, p2);
        });
    };
    $.fn.powerpinboard.defaults = {
        speed: 1200,
        selector: '>div',
        easing: 'easeOutElastic'
    };

    $.fn.Rocker = function (method, options) {
        options = $.extend({
            degrees: ['1', '3', '1', '0', '-1', '-3', '-1', '0'],
            delay: 69,
            limit: null,
            randomStart: true,
            onRocker: function (o) {
            },
            onRockerStart: function (o) {
            },
            onRockerStop: function (o) {
            }
        }, options);
        var methods = {
            rock: function (o, step) {
                if (step === undefined) {
                    step = options.randomStart ? Math.floor(Math.random() * options.degrees.length) : 0;
                }
                if (!$(o).hasClass('rocking')) {
                    $(o).addClass('rocking');
                }
                var degree = options.degrees[step];
                $(o).css({
                    '-webkit-transform': 'rotate(' + degree + 'deg)',
                    '-moz-transform': 'rotate(' + degree + 'deg)',
                    '-ms-transform': 'rotate(' + degree + 'deg)',
                    '-o-transform': 'rotate(' + degree + 'deg)',
                    '-sand-transform': 'rotate(' + degree + 'deg)',
                    'transform': 'rotate(' + degree + 'deg)'
                });
                if (step === (options.degrees.length - 1)) {
                    step = 0;
                    if ($(o).data('rocks') === undefined) {
                        $(o).data('rocks', 1);
                    }
                    else {
                        $(o).data('rocks', $(o).data('rocks') + 1);
                    }
                    options.onRocker(o);
                }
                if (options.limit && $(o).data('rocks') == options.limit) {
                    return methods.stop(o);
                }
                o.timeout = setTimeout(function () {
                    methods.rock(o, step + 1);
                }, options.delay);
            },
            stop: function (o) {
                $(o).data('rocks', 0);
                $(o).css({
                    '-webkit-transform': 'rotate(0deg)',
                    '-moz-transform': 'rotate(0deg)',
                    '-ms-transform': 'rotate(0deg)',
                    '-o-transform': 'rotate(0deg)',
                    '-sand-transform': 'rotate(0deg)',
                    'transform': 'rotate(0deg)'
                });
                if ($(o).hasClass('rocking')) {
                    $(o).removeClass('rocking');
                }
                clearTimeout(o.timeout);
                o.timeout = null;
                options.onRockerStop(o);
            },
            isRocking: function (o) {
                return !o.timeout ? false : true;
            }
        };
        if (method === 'isRocking' && this.length === 1) {
            return methods.isRocking(this[0]);
        }
        this.each(function () {
            if ((method === 'start' || method === undefined) && !this.timeout) {
                methods.rock(this);
                options.onRockerStart(this);
            }
            else if (method === 'stop') {
                methods.stop(this);
            }
        });
        return this;
    };


})(jQuery);

//window.jQuery = window.$ = jQuery;

