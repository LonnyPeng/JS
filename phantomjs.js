var page = require('webpage').create(), system = require('system'), fs = require('fs');
var ajaxUrl = "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js";

page.viewportSize = {width: window.screen.width, height: window.screen.height};
page.zoomFactor = 1;

page.open(system.args[1], function (status) {
    if (status === 'success') {
        var body = page.evaluate(function () {
            return document.getElementsByTagName('html')[0].getBoundingClientRect(); 
        });

        var isJQ = page.evaluate(function () {
            return typeof(jQuery) == "function" ? true : false;
        });

        var action = function () {
            page.evaluate(function () {
                $(document).ready(function () {
                    //action
                    $('body').trigger("mouseenter");
                });
            });
        };
        
        if (isJQ) {
            action();
        } else {
            page.includeJs(ajaxUrl, function () {
                action();
            });
        }

        page.clipRect = {top: body.top, left: body.left, width: body.width, height: body.height};

        page.render(system.args[2]); //save image
        fs.write(system.args[3], page.content, 'w'); //save html

        page.close();
        phantom.exit();
    }
});
