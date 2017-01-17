/**
 * Created by paul_ on 1/17/2017.
 */

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$('')

function animateClick(el,colorVal){
    $(el).animateCss('jello');
    $(el).animate({color: colorVal})
};

$( document ).ready(function() {
    $('.post').animateCss('fadeInUp');
});