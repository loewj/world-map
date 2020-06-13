// add tooltips to each element on the map
// $("path").each(function(index, el) {
//     $(el).attr("data-toggle", "tooltip");
//     $(el).attr("data-placement", "top");
//     $(el).attr("title", $(el).attr("name"));
// });

// // enable tooltips
// $(function () {
//     $('[data-toggle="tooltip"]').tooltip()
// });

$(document).ready(function() {

	$('#fullpage').fullpage({
		//options here
		autoScrolling:true,
        // scrollHorizontally: true,
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE"
	});

	//methods
	$.fn.fullpage.setAllowScrolling(true);
});

$("path").hover(function() {
	$(".location-display h1").html($(this).attr('title'));
});

$("path").mouseleave(function() {
	$(".location-display h1").html("&nbsp;");
});

$("path").click(function() {
    fullpage_api.moveSectionDown();
});