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






console.log('js loaded');
