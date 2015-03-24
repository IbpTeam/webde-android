/**
 * af.pop - a pop/alert library for html5 mobile apps
 * copyright Indiepath 2011 - Tim Fisher
 * Modifications/enhancements by Intel for App Framework
 *
 */
/* EXAMPLE
btns = {
  "Close":function(){console.log("Close CB")},
  "Play":function(){console.log("Play CB")},
  "PageUp":function(){console.log("PageUp CB")},
  "PageDown":function(){console.log("PageDown CB")},
}
$.query("#afui").popPanel({
  title:"Alert! Alert!",
  message:"This is a test of the emergency alert system!! Don't PANIC!",
  onShow:function(){console.log("showing popup");},
  buttons: btns,
});

You can programatically trigger a close by dispatching a "close" event to it.
$("#afui").popup("I'm replacing an alert box");
$("#afui").popup({title:'Alert',id:'myTestpop'});
$("#myTestpop").trigger("close");

  cancelText:"Cancel me",
  cancelCallback: function(e){
    console.log("cancelled, Parameters:  + JSON.stringify(e)");
  },
  doneText:"I'm done!",
  doneCallback: function(){console.log("Done for!, Parameters:  + JSON.stringify(arguments[0])");},
*/


/* global af */
(function ($) {
    "use strict";
    $.fn.popPanel = function (opts) {
        return new popPanel(this[0], opts);
    };
    var queue = [];
    var popPanel = (function () {
        var popPanel = function (containerEl, opts) {

            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                window.alert("Error finding container for popPanel " + containerEl);
                return;
            }
            if (typeof (opts) !== "object" || typeof (opts.buttons) !== "object"){                  
              window.alert("Error Parameter");
            };
            // console.log(opts);

            try {
                this.id = opts.id = opts.id || $.uuid(); //opts is passed by reference
                this.title = opts.title || "PopUp";
                this.message = opts.message || "";
                this.onShow = opts.onShow || function () {};
                this.buttons = opts.buttons;

                queue.push(this);
                if (queue.length === 1)
                    this.show();
            } catch (e) {
                console.log("error adding popPanel " + e);
            }

        };

        popPanel.prototype = {
            id: null,
            title: null,
            message: null,
            cancelText: null,
            cancelCallback: null,
            doneText: null,
            doneCallback: null,
            onShow: null,
            show: function () {
                var self = this;
                var footer = $("<footer>");
                var key, count=0;                
                for(key in this.buttons){
                  footer.append(
                    $.create("a", {className: "button " + ((count%2==0)?"left":"right")}).html(key)
                  );
                  count++;
                }
                // console.log(footer);
                $.create("div", {id: this.id, className: "ibpPopPanel hidden"})
                .append(
                  $("<header>").html(this.title)
                )
                .append(
                  $("<div>").html(this.message)
                )
                .append(
                  footer
                )
                .appendTo($(this.container));
                
                var $el = $.query("#" + this.id);
                $el.bind("close", function () {
                    self.hide();
                });
                $el.find("A").each(function () {
                  var button = $(this);
                  button.bind("click", function (e) {
                    // console.log(button.html());
                    self.buttons[button.html()]();
                    if("Close" == button.html() || "Stop" == button.html()){
                      self.hide();
                    }
                    e.preventDefault();
                  });
                });
                self.positionpopPanel();
                $.blockUI(0.5);

                $el.bind("orientationchange", function () {
                    self.positionpopPanel();
                });

                //force header/footer showing to fix CSS style bugs
                $el.find("header").show();
                $el.find("footer").show();
                setTimeout(function(){
                    $el.removeClass("hidden").addClass("show");
                    self.onShow(self);
                },50);
            },

            hide: function () {
                var self = this;
                $.query("#" + self.id).addClass("hidden");
                $.unblockUI();
                if(!$.os.ie&&!$.os.android){
                    setTimeout(function () {
                        self.remove();
                    }, 250);
                }
                else
                    self.remove();
            },

            remove: function () {
                var self = this;
                var $el = $.query("#" + self.id);
                $el.unbind("close");
                $el.find("BUTTON#action").unbind("click");
                $el.find("BUTTON#cancel").unbind("click");
                $el.unbind("orientationchange").remove();
                queue.splice(0, 1);
                if (queue.length > 0)
                    queue[0].show();
            },

            positionpopPanel: function () {
                var popPanel = $.query("#" + this.id);
                popPanel.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popPanel[0].clientHeight / 2) + "px");
                popPanel.css("left", (window.innerWidth / 2) - (popPanel[0].clientWidth / 2) + "px");
            }
        };

        return popPanel;
    })();
    var uiBlocked = false;
    $.blockUI = function (opacity) {
        if (uiBlocked)
            return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $.query("BODY").prepend($("<div id='mask'" + opacity + "></div>"));
        $.query("BODY DIV#mask").bind("touchstart", function (e) {
            e.preventDefault();
        });
        $.query("BODY DIV#mask").bind("touchmove", function (e) {
            e.preventDefault();
        });
        uiBlocked = true;
    };

    $.unblockUI = function () {
        uiBlocked = false;
        $.query("BODY DIV#mask").unbind("touchstart");
        $.query("BODY DIV#mask").unbind("touchmove");
        $("BODY DIV#mask").remove();
    };

})(af);