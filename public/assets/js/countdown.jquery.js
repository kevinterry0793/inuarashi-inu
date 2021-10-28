(function ($) {
    "use strict";
    $.fn.countdown = function (options) {
        return $.fn.countdown.begin(this, $.extend({ year: 2016, month: 1, day: 1, hour: 0, minute: 0, second: 0, timezone: -6, labels: true, onFinish: function () {} }, options));
    };
    $.fn.countdown.begin = function (parent, settings) {
        var timespan, start, end;
        end = new Date(settings.year, settings.month - 1, settings.day, settings.hour, settings.minute, settings.second);
        start = $.fn.countdown.convertTimezone(settings.timezone);
        timespan = $.fn.countdown.getTimeRemaining(start, end, settings);
        if (!settings.init) {
            $.each(timespan, function (k, v) {
                var container, wrapper, time, label;
                container = $("<span/>").addClass("col-xs-6 col-sm-3").attr("id", k);
                wrapper = $("<span/>").addClass("wrapper");
                time = $("<span/>")
                    .addClass("time")
                    .text(v < 10 ? "0" + v : v.toLocaleString());
                if (settings.labels) {
                    label = $("<span/>")
                        .addClass("label")
                        .text(v === 1 ? $.fn.countdown.singularize(k) : k);
                    container.append(wrapper.append(time).append(label));
                } else {
                    container.append(wrapper.append(time));
                }
                parent.append(container.addClass("animated rotateIn"));
            });
            settings.init = true;
        } else {
            $.each(timespan, function (k, v) {
                $(".time", "#" + k).text(v < 10 ? "0" + v : v.toLocaleString());
                $(".label", "#" + k).text(v === 1 ? $.fn.countdown.singularize(k) : k);
            });
        }
        if (settings.target_reached) {
            settings.onFinish();
        } else {
            setTimeout(function () {
                $.fn.countdown.begin(parent, settings);
            }, 1000);
        }
    };
    $.fn.countdown.singularize = function (str) {
        return str.substr(0, str.length - 1);
    };
    $.fn.countdown.convertTimezone = function (timezone) {
        var now, local_time, local_offset, utc;
        now = new Date();
        local_time = now.getTime();
        local_offset = now.getTimezoneOffset() * 60000;
        utc = local_time + local_offset;
        return new Date(utc + 3600000 * timezone);
    };
    $.fn.countdown.getTimeRemaining = function (start, end, settings) {
        var timeleft, remaining;
        remaining = {};
        timeleft = end.getTime() - start.getTime();
        timeleft = timeleft < 0 ? 0 : timeleft;
        if (timeleft === 0) {
            settings.target_reached = true;
        }
        remaining.days = Math.floor(timeleft / (24 * 60 * 60 * 1000));
        remaining.hours = Math.floor((timeleft / (24 * 60 * 60 * 1000) - remaining.days) * 24);
        remaining.minutes = Math.floor(((timeleft / (24 * 60 * 60 * 1000) - remaining.days) * 24 - remaining.hours) * 60);
        remaining.seconds = Math.floor((timeleft / 1000) % 60);
        return remaining;
    };
})(jQuery);
