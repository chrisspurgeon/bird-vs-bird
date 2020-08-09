$("#bird1").on("change", function() {
    console.log("change 1 triggered");
    $("#bird1").addClass("hide");
    $("#bird2").val('');
    $("#bird2").focus();
    $("#bird2").removeClass("hide");
});

$("#bird2").on("change", function() {
    console.log("change 2 triggered");
    $("#bird2").addClass("hide");
    $("#bird1").val('')
    $("#bird1").focus();
    $("#bird1").removeClass("hide");
});

$.get("scripts/FRGU.json", function(data) {
    window.FRGU = data;
    window.FRGU.photoCount = data.photos.length;
    window.FRGU.next = 0;
    console.log('got json');
});
$.get("scripts/LAGU.json", function(data) {
    window.LAGU = data;
    window.LAGU.photoCount = data.photos.length;
    window.LAGU.next = 0;
    console.log('got json');
});
$(".testphoto").click(function() {
    var which;
    if (Math.random() < 0.5) {
        which = FRGU;
    } else {
        which = LAGU;
    }
    var $img = $('.testphoto')[0];
    $($img).attr('src', which.photos[which.next]);
    which.next++;
    console.log('which.next is ' + which.next);
});



console.log('js loaded');
