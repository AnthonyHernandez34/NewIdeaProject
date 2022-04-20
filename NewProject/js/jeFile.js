'use strict';
$(".text-overlay").css({
    top: $(".headings.back").position().top,
    left: $(".headings.back").position().left
});
$(".overlay").hide();
$(document).ready(function () {
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }

    window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var $line = $(".scroll-nav"),
        $bar = $(".scroll-block"),
        $pages = $(".pages"),
        $overlay = $(".overlay"),
        $textOverlay = $(".text-overlay"),
        lineHeight = $line.height(),
        barHeight = $bar.height(),
        pagesHeight = $pages.height(),
        textOverlayHeight = $textOverlay.height(),
        headingsHeight = 10 * 4 * 16,
        minTop = $line.offset().top,
        maxTop = lineHeight - barHeight,
        maxTopCont = pagesHeight - $(window).height(),
        maxOverlayTop = 9 * 4 * 16,
        curTop = 0,
        curContTop = 0,
        curOverlayTop = 0,
        diff = 0,
        diffCont = 0,
        diffPercent = 0,
        diffOverlay = 0,
        matrix,
        matrixCont,
        matrixOverlay,
        point;

    var dragFunction = function (y) {
        matrix = $bar.css("transform");
        curTop = parseFloat(matrix.split(",").pop()) || 0;
        matrixCont = $pages.css("transform");
        curContTop = parseFloat(matrixCont.split(",").pop()) || 0;
        matrixOverlay = $textOverlay.css("transform");
        if (!isNaN(parseFloat(matrixOverlay.split(",").pop()))) {
            curOverlayTop = parseFloat(matrixOverlay.split(",").pop());
        } else {
            curOverlayTop = 0;
        }
        diff = y - point;
        diffPercent = diff / lineHeight;
        diffCont = diffPercent * (maxTopCont + $(".page").height());
        diffOverlay = parseFloat(diffPercent * headingsHeight);
        point = point + diff;
        curTop = curTop + diff;
        curContTop = curContTop - diffCont;
        curOverlayTop = Number(curOverlayTop) + Number(diffOverlay);
        if (curTop < 0) {
            curTop = 0;
            curContTop = 0;
            curOverlayTop = 0;
        }
        if (curTop > maxTop) {
            curTop = maxTop;
            curContTop = 0 - maxTopCont;
            curOverlayTop = maxOverlayTop;
        }
        function transforms() {
            requestAnimFrame(transforms);
            $bar.css("transform", "translate3d(0px, " + curTop + "px,0px)");
            $pages.css("transform", "translate3d(0px, " + curContTop + "px,0px)");
            $textOverlay.css(
                "transform",
                "translate3d(0px, " + curOverlayTop + "px,0px)"
            );
            $(".text-overlay .headings").css(
                "transform",
                "translate3d(0px, " + (0 - curOverlayTop) + "px,0px)"
            );
        }
        transforms();
    };

    $(document).on("mousedown", ".scroll-block", function (e) {
        $("body").addClass("no-select");
        $(this).addClass("active");
        $overlay.show();
        $overlay.css("top");
        $overlay.addClass("visible");
        point = e.pageY;

        $(document).on("mousemove", function (e) {
            console.log(e.pageX);
            if (!$bar.hasClass("active")) return;
            dragFunction(e.pageY);
        });
    });

    $(document).on("mouseup", function () {
        $("body").removeClass("no-select");
        $bar.removeClass("active");
        $overlay.removeClass("visible");
        setTimeout(function () {
            $overlay.hide();
        }),
            100;
        $(document).off("mousemove");
    });

    /* RESIZE FUNCTION */
    var onResize = debounce(function () {
        $(".overlay").show();
        $(".text-overlay").css({
            top: $(".headings.back").position().top,
            left: $(".headings.back").position().left
        });
        $(".overlay").hide();
        lineHeight = $line.height();
        barHeight = $bar.height();
        pagesHeight = $pages.height();
        textOverlayHeight = $textOverlay.height();
        minTop = $line.offset().top;
        maxTop = lineHeight - barHeight;
        maxTopCont = pagesHeight - $(window).height();
        dragFunction();
    }, 350);
    $(window).resize(onResize);
});
