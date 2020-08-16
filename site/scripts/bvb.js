var bird1Category = '';
var bird1Value = '';
var bird1Name = '';
var bird2Category = '';
var bird2Value = '';
var bird2Name = '';
var $battleTitle = $('.battleTitle');
var $leftIntroImage = $('.intro-image-left');
var $rightIntroImage = $('.intro-image-right');


// Fired when the user picks the first bird.
$("#bird1").on("change", function() {
    bird1Value = $("#bird1").val();
    bird1Category = $("#bird1 option:selected").data('category');
    bird1Name = $("#bird1 option:selected").text();
    console.log("change 1 triggered with a value of " + bird1Value + ', which has a category of ' + bird1Category);
    $("#bird1").addClass("hide");
    $('.js-startover').removeClass('hide');

    // Now that we've picked the first bird, make the second bird select element contain only related birds.
    var bird2Options = $("#bird2 option");
    $(bird2Options).removeClass('hide');
    for (var i = 0; i < bird2Options.length; i++) {
        if ($(bird2Options[i]).data('category') !== bird1Category || $(bird2Options[i]).val() === bird1Value) {
            $(bird2Options[i]).addClass('hide');
        }
    }
    $("#bird2").val('');
    $("#bird2").focus();
    $("#bird2").removeClass("hide");
});


// Fired when the user picks the second bird.
$("#bird2").on("change", function() {
    console.log("change 2 triggered");
    bird2Value = $("#bird2").val();
    bird2Category = $("#bird2 option:selected").data('category');
    bird2Name = $("#bird2 option:selected").text();
    $("#bird2").addClass("hide");
    // Loads the bird1 vs. bird2 top images and text.
    displayIntro();
    // Display the data loading presentation
    $('.differences').addClass('loading').removeClass('hide');
    // Retrieve the differences list, and the data for the two birds.
    $.when(getData('/data/differencesList.json'), getData('data/species/' + bird1Value + '.json'), getData('data/species/' + bird2Value + '.json'))
    .done(function(differenceData, leftBirdData, rightBirdData) {
        console.log('got ALL the data!');
        console.log('Difference data is...');
        console.log(JSON.stringify(differenceData));
        console.log('leftBird data is...');
        console.log(JSON.stringify(leftBirdData));
        console.log('RightBird data is...');
        console.log(JSON.stringify(rightBirdData));
    })
    .fail(function(err) {
        console.log("Couldn't get all the data!");
        // TODO: Error handling.
    });
});


// AJAX call to retrieve JSON data
function getData(dataPath) {
    console.log('Reached getData() with a path of ' + dataPath);
    return $.get(dataPath, function(data) {
        console.log('got some data! Here it is...');
        console.log(JSON.stringify(data));
    });
}

// Fired when the user clicks the Start Over button
$('.js-startover').on('click', resetAll);

function resetAll() {
    console.log('fired reset all');
    $('#bird2').addClass('hide');
    $('#bird1 option').removeClass('hide');
    $('#bird2 option').removeClass('hide');
    $('#bird1').val('');
    $('#bird1').removeClass('hide');
    $('.js-startover').addClass('hide');
    $('.intro-images').addClass('hide');
    $battleTitle.addClass('hide');
    $('.differences').addClass('hide').removeClass('loading');
    bird1Category = '';
    bird1Value = '';
    bird2Category = '';
    bird2Value = '';
}

// Loads the bird vs. bird images
function displayIntro() {
    $battleTitle.html(bird1Name + ' vs. ' + bird2Name);
    $battleTitle.removeClass('hide');
    $leftIntroImage.attr('src', 'images/birds/' + bird1Value + '/' + bird1Value + '-left.jpg');
    $rightIntroImage.attr('src', 'images/birds/' + bird2Value + '/' + bird2Value + '-right.jpg');
    $('.intro-images').removeClass('hide');
}

// $(".testphoto").click(function() {
//     var which;
//     if (Math.random() < 0.5) {
//         which = FRGU;
//     } else {
//         which = LAGU;
//     }
//     var $img = $('.testphoto')[0];
//     $($img).attr('src', which.photos[which.next]);
//     which.next++;
//     console.log('which.next is ' + which.next);
// });



console.log('js loaded');
