/*------------------------------------------------------------------------------------------------*\
    Fall-Back Cookie Notice Pattern v0.1
    ------------------------------------

    To avoid any confusion, it's probably best to copy these settings to another file that you're
    concatenating and then make any changes to the defaults.
\*------------------------------------------------------------------------------------------------*/

var cookie_name                   = 'fallback_accept_cookies';
var cookie_expire_days            = 60;
var cookie_notice_id              = 'cookie_notice';
var cookie_button_id              = 'accept_cookies';
var cookie_notice_class           = 'cookie_notice';
var cookie_button_class           = '';
var cookie_close_class            = 'cookie_notice--close';
var cookie_notice_effect_duration = 1000;
var cookie_html                   =
'<div id="' + cookie_notice_id + '" class="' + cookie_notice_class + '">' + "\n" +
'<p class="cookie_notice__message">This site uses <a href="http://www.allaboutcookies.org/" rel="external" target="_blank">cookies</a> to improve user experience. By using this site you agree to our use of cookies.</p>' + "\n" +
'<span class="cookie_notice__action"><button id="' + cookie_button_id + '" class="' + cookie_button_class + '">Dismiss</button></span>' + "\n" +
'</div>';

/*!

    Fall-Back Nav-Bar v2.0.0

    https://github.com/Fall-Back/Nav-Bar

    Copyright (c) 2017, Andy Kirk

    Released under the MIT license https://git.io/vwTVl

*/

(function() {

    var ready = function(fn) {

        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {

            fn();

        } else {

            document.addEventListener('DOMContentLoaded', fn);

        }

    }



	var navbar = {



        init: function() {

            var nav_bar = document.querySelector('.nav-bar');

            var nav_bar_js_classname = 'js-nav-bar';

            // Note that `getComputedStyle` on psuedo elements doesn't work in Opera Mini, but in

            // this case I'm happy to serve only the unenhanced version to Opera Mini.

            var css_is_loaded = (

                window.getComputedStyle(nav_bar, ':before')

                .getPropertyValue('content')

                .replace(/(\"|\')/g, '')

                == 'CSS Loaded'

            );

            //console.log(window.getComputedStyle(nav_bar, ':before').getPropertyValue('content'));

            //console.log(css_is_loaded);



            if (css_is_loaded) {

                // Add the JS class names ...

                if (nav_bar.classList) {

                    nav_bar.classList.add(nav_bar_js_classname);

                } else {

                    nav_bar.className += ' ' + nav_bar_js_classname;

                }

                // ... and button actions:

                // (note a dilema here, as the toggle button code is designed to be generic, but I

                // don't want to run it for ALL `.js-toggle-button` by default, because I'm being

                // more discerning than that. I.e. I NEVER want this running for Opera Mini, and I

                // ONLY want it running for Nav-Bars if the Nav-Bar CSS has loaded.

                // Maybe just abstract the toggle code into a standalone file, and make it callable

                // and act upon a selector that's passed to it).

                var buttons = document.querySelectorAll('.js-nav-bar .js-toggle-button');

                Array.prototype.forEach.call(buttons, function(button, i) {

                    var button_id = button.getAttribute('id');



                    button.setAttribute('aria-expanded', 'false');



                    // Main toggle button:

                    button.addEventListener('click', function() {

                        // Switch the `aria-expanded` attribute:

                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;



                        // Close any open submenu:

                           var expanded_buttons = document.querySelectorAll('.js-nav-bar .js-toggle-button[aria-expanded="true"]');

                        Array.prototype.forEach.call(expanded_buttons, function(expanded_button, i) {

                            expanded_button.setAttribute('aria-expanded', 'false');

                        });



                        // Set the attribute:

                        this.setAttribute('aria-expanded', !expanded);



                        // Set the focus to the first link if submenu newly opened:

                        if (!expanded) {

                            var first_link = document.querySelector('#' + button_id + '--target .subnav__link');

                            first_link.focus();

                        }

                    });



                });

            }

        }

	}



	ready(navbar.init);

})();


/*!
    Fall-Back Over-Panel v2.0.0
    https://github.com/Fall-Back/Over-Panel
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }


    /* From Modernizr */
    var whichTransitionEvent = function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

                    over_panel = {

                          init: function() {
                           var over_panels = document.querySelectorAll('.over-panel');
            var over_panel_js_classname           = 'js-over-panel';
            var over_panel_control_js_classname   = 'js-over-panel-control';
            var over_panel_is_open_classname      = 'js-over-panel_is-open';
            var over_panel_is_animating_classname = 'js-over-panel_is-animating';

            var transitionEvent = whichTransitionEvent();

            // Note that `getComputedStyle` on psuedo elements doesn't work in Opera Mini, but in
            // this case I'm happy to serve only the unenhanced version to Opera Mini.
            var css_is_loaded = (
                window.getComputedStyle(over_panels[0], ':before')
                .getPropertyValue('content')
                               .replace(/(\"|\')/g, '')
                == 'CSS Loaded'
            );

            if (css_is_loaded) {
                Array.prototype.forEach.call(over_panels, function(over_panel, i) {


                    // Find corresponding controls:
                                         var over_panel_id = over_panel.getAttribute('id');
                                         var over_panel_control = document.querySelector('[aria-controls="' + over_panel_id + '"]');
                    var over_panel_overlay = over_panel.querySelector('.over-panel__overlay');

                    // Check we've got a corresponding control. If not we can't proceed so skip:
                    if (!over_panel_control) {
                        return;
                    }

                    // Add the JS class names ...
                    // ... to the panel: ...
                    if (over_panel.classList) {
                        over_panel.classList.add(over_panel_js_classname);
                    } else {
                        over_panel.className += ' ' + over_panel_js_classname;
                       }
                    // ... and the control:
                       if (over_panel_control.classList) {
                        over_panel_control.classList.add(over_panel_control_js_classname);
                    } else {
                        over_panel_control.className += ' ' + over_panel_control_js_classname;
                    }

                    // Main toggle button:
                    over_panel_control.addEventListener('click', function() {

                        if (over_panel.classList) {
                            over_panel.classList.add(over_panel_is_animating_classname);
                        } else {
                            over_panel.className += ' ' + over_panel_is_animating_classname;
                        }

                        // Invert the `aria-expanded` attribute:
                        var expanded = this.getAttribute('aria-expanded') === 'true' || false;

                        // Set the attribute:
                        this.setAttribute('aria-expanded', !expanded);

                        // Toggle the `is_open` class:
                        if (!expanded) {
                            if (over_panel.classList) {
                                over_panel.classList.add(over_panel_is_open_classname);
                            } else {
                                over_panel.className += ' ' + over_panel_is_open_classname;
                            }
                        } else {
                            if (over_panel.classList) {
                                over_panel.classList.remove(over_panel_is_open_classname);
                            } else {
                                over_panel.className = over_panel.className.replace(new RegExp('(^|\\b)' + over_panel_is_open_classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                            }
                        }
                    });

					// Overlay click action:
					over_panel_overlay.addEventListener('click', function() {
						over_panel_control.click()
					});

                    // Remove `animating` class at transition end.
                    transitionEvent && over_panel.addEventListener(transitionEvent, function() {
                        if (over_panel.classList) {
                            over_panel.classList.remove(over_panel_is_animating_classname);
                        } else {
                            console.log('Animation ended');
                            over_panel.className = over_panel.className.replace(new RegExp('(^|\\b)' + over_panel_is_animating_classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                        }
                    });

                    // Focus trap inspired by:
					// http://heydonworks.com/practical_aria_examples/progressive-hamburger.html
                    var over_panel_contents = over_panel.querySelector('.over-panel__contents');
                    var focusables          = over_panel_contents.querySelectorAll('a, button, input, select, textarea');
                    var first_focusable     = focusables[0];
                    var last_focusable      = focusables[focusables.length - 1];

                    // At end of navigation block, return focus to navigation menu button
                    last_focusable.addEventListener('keydown', function(e) {
                        if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && !e.shiftKey) {
							e.preventDefault();
							over_panel_control.focus();
                        }
                    });

                    // At start of navigation block, refocus close button on SHIFT+TAB
                    over_panel_control.addEventListener('keydown', function(e) {
                        if (over_panel_control.getAttribute('aria-expanded') == 'true' && e.keyCode === 9 && e.shiftKey) {
                            e.preventDefault();
                            last_focusable.focus();
                        }
                    });
                });
            }
        }
	}

	ready(over_panel.init);
})();

/*!
    Fall-Back Cookie Notice v1.1.0
    https://github.com/Fall-Back/Cookie-Notice
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    var createCookie = function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    var readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    var eraseCookie = function(name) {
        createCookie(name,"",-1);
    }

    var cookienotice = {

        init: function() {
            var accepted_cookies = readCookie(cookie_name);
            if (!accepted_cookies) {
                var body_el = document.getElementsByTagName('body')[0];
                body_el.insertAdjacentHTML('afterbegin', cookie_html);

                document.getElementById(cookie_button_id).onclick = function(){
                    createCookie(cookie_name, 'true', cookie_expire_days);
                    document.getElementById(cookie_notice_id).className += '  ' + cookie_close_class;
                    /*
                        Without CSS (or transition suport - IE9) the notice won't disappear, so wait until fade
                        has finished then remove:
                    */
                    setTimeout(function(){
                        var c = document.getElementById(cookie_notice_id);
                        c.parentNode.removeChild(c);
                    }, cookie_notice_effect_duration);
                };
            }
        }
    }

    ready(cookienotice.init);
})();

/*!
    Fall-Back SVG v1.1.0
    https://github.com/Fall-Back/SVG
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    var svg = {

        init: function() {
            /*
                Fix CSS shortcomings in older browsers. Specifically fix the width of the objects container
                to be the same width as the object.
            */

            if (!!(
                document.body.style.msTouchSelect !== undefined /* IE10+ */
             || (document.all && document.addEventListener && !window.atob) /* IE9 */
             || Object.prototype.toString.call(window.operamini) === '[object OperaMini]' /* Opera Mini */
            )) {

                var objs = document.getElementsByTagName('object');
                var i = 0
                  , l = objs.length
                  , data
                  , obj;

                for (i; i < l; i++) {
                    obj = objs[i];
                    // Check object is inside of an .svg__link and
                    // not inside of an .svg--fluid
                    if (obj.parentNode.className.indexOf('svg__link') == -1 || obj.parentNode.parentNode.className.indexOf('svg--fluid') >= 0) {
                        continue;
                    }


                    // If the .svg container has a width of 'auto', things don't work, so we need to
                    // temporarily set the width to 100% so the children can expand to their natural
                    // width:
                    var svg = obj.parentNode.parentNode;
                    // Is the width 'auto' or not set.
                    if (svg.style.width == '' || svg.style.width == 'auto') {
                        svg.style.width  = '100%';
                    }


                    // Also, if there's an auto width parent to the .svg container (e.g. for styling a
                    // box or whatever) we need to do the same. Apply the .svg-container class to that
                    // element.
                    var container = svg.parentNode;
                    // Is the width 'auto' or not set.
                    if (container.className.indexOf('svg-container') > 0 && (container.style.width == '' || container.style.width == 'auto')) {
                        container.style.width  = '100%';
                    }


                    obj.style.maxWidth         = 'none';
                    obj.style.minWidth         = '0';
                    obj.parentNode.style.width = '100%';
                    obj.parentNode.style.width = obj.offsetWidth + 'px';
                    obj.style.maxWidth         = '100%';


                    // Reset the container width:
                    container.style.width  = '';


                    // Reset the svg width:
                    svg.style.width  = '';
                }
            }
        }
    }

    ready(svg.init);
})();

