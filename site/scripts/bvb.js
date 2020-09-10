var bird1Category = '';
var bird1Value = '';
var bird1Name = '';
var bird2Category = '';
var bird2Value = '';
var bird2Name = '';
var $battleTitle = $('.battleTitle');
var $leftIntroImage = $('.intro-image-left');
var $rightIntroImage = $('.intro-image-right');
var $differencesDiv = $('.differences');
var $differencesTable = $('.differences-table');
var $loadingMessageDiv = $('.loading-message');
var loadingMessage = 'Loading data...';
var errorMessage = 'Something went wrong! Please start over. :-(';
var differencesHeadline = 'Key differences between BIRD1 and BIRD2...'
var quizintrotext = "You'll be shown a series of pictures. For each one, decide if it's a "
var differenceData;
var bird1Data;
var bird2Data;
var quizPhotoArray = [];
var quizSlideCount;
var currentQuizSlide = 0;


// Fired when the user picks the first bird.
$("#bird1").on("change", function() {
    bird1Value = $("#bird1").val();
    bird1Category = $("#bird1 option:selected").data('category');
    bird1Name = $("#bird1 option:selected").text();
    console.log("change 1 triggered with a value of " + bird1Value + ', which has a category of ' + bird1Category);
    $("#bird1").addClass("hide");
    $('.start-over-button').removeClass('hide');

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
    $differencesDiv.addClass('loading').removeClass('hide');
    $loadingMessageDiv.html(loadingMessage).removeClass('error-message').addClass('loading-message');
    // Retrieve the differences list, and the data for the two birds.
    $.when(getData('/data/differencesList.json'), getData('data/species/' + bird1Value + '.json'), getData('data/species/' + bird2Value + '.json'))
    .done(function(differenceDataResult, leftBirdDataResult, rightBirdDataResult) {
        console.log('got ALL the data!');
        console.log('Difference data is...');
        console.log(JSON.stringify(differenceDataResult));
        console.log('leftBird data is...');
        console.log(JSON.stringify(leftBirdDataResult));
        console.log('RightBird data is...');
        console.log(JSON.stringify(rightBirdDataResult));
        differenceData = differenceDataResult[0];
        bird1Data = leftBirdDataResult[0];
        bird2Data = rightBirdDataResult[0];
        displayResults();

    })
    .fail(function(err) {
        console.log("Couldn't get all the data!");
        // Error handling.
        $loadingMessageDiv.html(errorMessage).addClass('error-message').removeClass('loading-message');
        $differencesDiv.removeClass('loading');
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
    $('.start-over-button').addClass('hide');
    $('.take-the-quiz-button').addClass('hide');
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

// Load all of the difference data onto the page.
function displayResults() {
    $('.difference-headline').html(differencesHeadline.replace('BIRD1',bird1Name).replace('BIRD2',bird2Name));
    var output = '';
    for (var i = 0; i < differenceData.length; i++) {
        console.log("Checking " + differenceData[i].key);



// TODO: TURN THIS INTO A FUNCTION!

        // First, do we even have entries for this difference?
        if (typeof bird1Data.differences[differenceData[i].key] !== 'undefined' || typeof bird2Data.differences[differenceData[i].key] !== 'undefined') {
            // We do, so output the difference title.
            output += '<tr><th colspan=2 class="trait-headline">' + differenceData[i].title + '</th></tr>';
            output += '<tr><td class="left">';

            // BIRD 1
            if (typeof bird1Data.differences[differenceData[i].key] === 'undefined') {
                // This bird doesn't have any info for this difference.
                output += '&nbsp;';
            } else {
                // This bird does have data for this difference. First, let's see if it has species-specific info. If it does, use that.
                if (typeof bird1Data.differences[differenceData[i].key][bird2Value] !== 'undefined') {
                    output += bird1Data.differences[differenceData[i].key][bird2Value].text;
                } else {
                    // There's nothing specific, so just output the generic difference text.
                    if (typeof bird1Data.differences[differenceData[i].key].general !== 'undefined') {
                        output += bird1Data.differences[differenceData[i].key].general.text;
                    } else {
                        output += '&nbsp;'
                    }
                }
            }
            output += '</td><td class="right">';

            // BIRD 2
            if (typeof bird2Data.differences[differenceData[i].key] === 'undefined') {
                // This bird doesn't have any info for this difference.
                output += '&nbsp;';
            } else {
                // This bird does have data for this difference. First, let's see if it has species-specific info. If it does, use that.
                if (typeof bird2Data.differences[differenceData[i].key][bird1Value] !== 'undefined') {
                    output += bird2Data.differences[differenceData[i].key][bird1Value].text;
                } else {
                    // There's nothing specific, so just output the generic difference text.
                    if (typeof bird2Data.differences[differenceData[i].key].general !== 'undefined') {
                        output += bird2Data.differences[differenceData[i].key].general.text;
                    } else {
                        output += '&nbsp;'
                    }
                }
            }
            output += '</td></tr>';
        } else {
            console.log('\tThere is no data for ' + differenceData[i].key);
        }
    }
    if (output !== '') {
        output = '<table cellpadding=0 cellspacing=0><tr><th class="table-bird-name left">' + bird1Name + '</th><th class="table-bird-name right">' + bird2Name + '</th></tr>' + output + '</table>';
        $differencesTable.html(output);
        $differencesDiv.removeClass('loading');
        $('.quiz-button').removeClass('hide');
    }
}



$('.js-quiz').on('click', function() {
    $('.modal-wrapper').removeClass('hide');
    $('.quiz-intro-text').html(quizintrotext + bird1Name + ' or a ' + bird2Name + '.<br>Ready?');
    loadQuizPhotos();
});

$('.modal-close').on('click', function() {
    $('.modal-wrapper').addClass('hide');
});


function loadQuizPhotos() {
    for (var i = 0; i < bird1Data.quiz.photos.length; i++) {
        quizPhotoArray.push(bird1Data.quiz.photos[i]);
    }
    for (i = 0; i < bird2Data.quiz.photos.length; i++) {
        quizPhotoArray.push(bird2Data.quiz.photos[i]);
    }
    console.log(quizPhotoArray);
    shuffle(quizPhotoArray);
    console.log(quizPhotoArray);
    quizSlideCount = quizPhotoArray.length;
    loadNextQuizImage();
}

function loadNextQuizImage() {
    $('.quizImage').attr("src", quizPhotoArray[currentQuizSlide]);
    currentQuizSlide++;
}

$('.quizImage').on('click', function() {
    loadNextQuizImage();
});

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


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }




console.log('js loaded');
