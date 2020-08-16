var bird1Category = '';
var bird1Value = '';
var bird1Name = '';
var bird2Category = '';
var bird2Value = '';
var bird2Name = '';
var $battleTitle = $('.battleTitle');
var $leftIntroImage = $('.intro-image-left');
var $rightIntroImage = $('.intro-image-right');
var differences;


// Get the list of possible differences.
function loadDifferences() {
    $.get("data/differencesList.json")
    .done(function (data) {
        console.log('got difference data!');
        differences = data;
        for (var i = 0; i < differences.length; i++) {
            console.log(differences[i].key + " = " + differences[i].title);
        }
    })
    .fail(function(data, status, err) {
        console.log("ERROR! Difference list not found.");
    });
}



$("#bird1").on("change", function() {
    bird1Value = $("#bird1").val();
    bird1Category = $("#bird1 option:selected").data('category');
    bird1Name = $("#bird1 option:selected").text();
    console.log("change 1 triggered with a value of " + bird1Value + ', which has a category of ' + bird1Category);
    $("#bird1").addClass("hide");
    $('.js-startover').removeClass('hide');

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
    console.log()
});

$("#bird2").on("change", function() {
    console.log("change 2 triggered");
    bird2Value = $("#bird2").val();
    bird2Category = $("#bird2 option:selected").data('category');
    bird2Name = $("#bird2 option:selected").text();
    $("#bird2").addClass("hide");
    displayIntro();
    $('.differences').addClass('loading').removeClass('hide');
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
    });
});

function getData(dataPath) {
    console.log('Reached getData() with a path of ' + dataPath);
    return $.get(dataPath, function(data) {
        console.log('got some data! Here it is...');
        console.log(JSON.stringify(data));
        // return data;
    });
}

function loadDifferenceData() {
    $('.differences').addClass('loading').removeClass('hide');
    loadDifferences();
//    loadLeft();
//    loadRight();
}

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

function displayIntro() {
    $battleTitle.html(bird1Name + ' vs. ' + bird2Name);
    $battleTitle.removeClass('hide');
    $leftIntroImage.attr('src', 'images/birds/' + bird1Value + '/' + bird1Value + '-left.jpg');
    $rightIntroImage.attr('src', 'images/birds/' + bird2Value + '/' + bird2Value + '-right.jpg');
    $('.intro-images').removeClass('hide');
}

// $.get("data/species/FRGU.json", function(data) {
//     window.FRGU = data;
//     window.FRGU.photoCount = data.photos.length;
//     window.FRGU.next = 0;
//     console.log('got json');
// });
// $.get("data/species/LAGU.json", function(data) {
//     window.LAGU = data;
//     window.LAGU.photoCount = data.photos.length;
//     window.LAGU.next = 0;
//     console.log('got json');
// });
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
