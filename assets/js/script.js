// defining inital variables
let options = {}
let jacketRequirementElement = $('#sliderWithValue')
let sweaterRequirementElement = $('#sliderWithValue2')
let answers = $('#answers')
var temp;
var choices;
var sweaterOutput = $('sweaterOutput');
var jacketOutput = $('jacketOutput');
var jacketOutputText = 50;
var sweaterOutputText = 65;
$.getJSON('data.json', function (data){
    choices = data
});
// api key for the weather https://developer.accuweather.com/
let weatherApiKey = 'QnoBmmKUFEVUywOBW0Xbu5EnxoX0Jyot' 
// api key for the IPaddress https://www.abstractapi.com/ip-geolocation-api
let ipAddressApiKey = '935f7d46cc714485a37a6995ea276daa'

$('#option').click(function(){
    optionsMenu();
    $('#option').hide()
});
// clear page function
function clearPage(){
    while (answers[0].hasChildNodes()) {
        answers[0].removeChild(answers[0].lastChild);
    }
}


// options menu
function optionsMenu (){
    clearPage()
    answers.removeClass('main answers')
    var optionsScreen = $('<div>').attr('id', 'welcomeScreen').addClass('section has-text-primary-light modal is-active');
    answers.append(optionsScreen);
    var modalContent = $('<div>').addClass('modal-content is-flex is-justify-content-center is-align-items-center is-align-content-center columns');
    var optionsQuestions = $('<div>').attr('id', 'optionsQuestions').addClass('column main is-6');
    var optionsH3 = $('<h3>').text('Options');
    modalContent.append(optionsQuestions);
    var jacketDiv = $('<div>');
    var jacketH4 = $('<h4>').text('What temp to put on a jacket');
    jacketSlider = $('<input>').attr('id', 'sliderWithValue').addClass('slider has-output is-fullwidth').attr('min', '0').attr('max', '100').attr('value', jacketOutputText).attr('step', '1').attr('type', 'range');
    jacketOutput = $('<output>').attr('for', 'sliderWithValue').attr('id', 'jacketOutput').text(jacketOutputText);
    jacketDiv.append(jacketH4, jacketSlider, jacketOutput);
    var sweaterDiv = $('<div>');
    var sweaterH4 = $('<h4>').text('What temp to put on a sweater');
    sweaterSlider = $('<input>').attr('id', 'sliderWithValue2').addClass('slider has-output is-fullwidth').attr('min', '0').attr('max', '100').attr('value', sweaterOutputText).attr('step', '1').attr('type', 'range');
    sweaterOutput = $('<output>').attr('for', 'sliderWithValue2').attr('id', 'sweaterOutput').text(sweaterOutputText);
    sweaterDiv.append(sweaterH4, sweaterSlider, sweaterOutput);
    var goBtn = $('<button>').addClass('button is-rounded').attr('id', 'question').text('Save')
    optionsQuestions.append(optionsH3, jacketDiv, sweaterDiv, goBtn);
    optionsScreen.append(modalContent);
    bulmaSlider.attach();
    $(goBtn).click(function(){
        handleSave(jacketSlider, sweaterSlider)
        loadOptions()
        iterateTempStatement()
        optionsScreen.removeClass('is-active')
        $('#option').show()
        answers.addClass('main answers')
        console.log(temp)
    });    
}

// zipcode prompt
function zipcodeMenu(){
    clearPage()
    $('#option').hide()
    answers.removeClass('main')
    var modal = $('<div>').addClass('modal is-active is-clipped');
    var modalBackground = $('<div>').addClass('modal-background');
    var modalContent = $('<div>').addClass('modal-content');
    var zipCodeQuestionText = $('<h4>').text('Please enter your Zipcode').addClass('is-light')
    var postalInput = $('<input>').attr('id', 'postalcodeInput').attr('placeholder', 'please enter your zip code');
    var postalBtn = $('<button>').addClass('button is-small is-rounded').attr('id','zipCodeBtn').text('Submit');
    modalContent.append(zipCodeQuestionText, postalInput);
    answers.append(modal);
    modal.append(modalBackground, modalContent, postalBtn);
    // add more fuctionality to the click
    $('#zipCodeBtn').click(function(){
        var postal_code =  $('#postalcodeInput').val()
        gitZipLocationKey(postal_code)
        modal.removeClass('is-active')
        answers.addClass('main')
        $('#option').show()
    });
    
}


// call to load options
loadOptions()

// creates html based on temperatures and options
function iterateTempStatement(){
    clearPage()
    console.log(sweaterOutputText)
    if (temp <= sweaterOutputText && temp >= jacketOutputText) {
        var tooCold = $('<div>').attr('id', 'cold').addClass("column is-three-fifths answers");
        answers.append(tooCold)
        adding_Questions(choices)
        
    } else if (temp <= sweaterOutputText && temp <= jacketOutputText) {
        var freezing = $('<div>').attr('id', 'freezing');
        answers.append(freezing)
        adding_Questions(choices)
        
    } else if (temp >= sweaterOutputText && temp <= 90){
        var nice = $('<div>').attr('id', 'nice');
        answers.append(nice)
        adding_Questions(choices)
    }else if (temp >= 91){
        var hot = $('<div>').attr('id', 'hot');
        answers.append(hot) 
        adding_Questions(choices)
    }else {
        $('#option').hide()
        clearPage()
        answers.removeClass('main')
        var modal = $('<div>').addClass('modal  is-active');
        var modalBackground = $('<div>').addClass('modal-background');
        var modalContent = $('<div>').addClass('modal-content');
        var modalText = $('<p>').text('didnt load values');
        var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
        answers.append(modal);
        modal.append(modalBackground, modalContent, modalClose);
        modalContent.append(modalText);
        $(modalClose).click(function(){
            modal.removeClass('is-active')
            $('#option').show()
        });
    }
}

// adds the data to the questions
function adding_Questions(data){
    $('#cold').text(data.Answers.cold)
    $('#freezing').text(data.Answers.freezing)
    $('#nice').text(data.Answers.nice)
    $('#hot').text(data.Answers.hot)
}

// saves options to local storage
function handleSave(jacketSlider, sweaterSlider){
    let jacketRequirement = jacketSlider.val()
    let sweaterRequirement = sweaterSlider.val()
    var optionsObject = {
        jacket: jacketRequirement,
        sweater: sweaterRequirement,
    }
    options=  optionsObject.jacket
    localStorage.setItem('options', JSON.stringify(optionsObject))
    
    
}
// loads options from local storage
function loadOptions(){
    var optionsObject = localStorage.getItem('options')
    if (!optionsObject) {
        options = {}
    } else {
        options = JSON.parse(optionsObject)
        setItems()
    }
}
// set or define relationships with objects like the sliders and whats in local storage
function setItems(){  
    jacketOutputText = options.jacket;
    sweaterOutputText = options.sweater;
}

// api call section
// gets a location key from accuweather based off the zip code
var gitZipLocationKey = function(postal_code) {
    var apiUrl = "https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=" + weatherApiKey + "&q=" + postal_code;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var locationKey = data[0].Key
                gitWeather(locationKey)
            });
        } else {
            var modal = $('<div>').addClass('modal is-active');
            var modalBackground = $('<div>').addClass('modal-background');
            var modalContent = $('<div>').addClass('modal-content');
            var modalText = $('<p>').text("couldn't get the zipcode location");
            var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
            answers.append(modal);
            modal.append(modalBackground, modalContent, modalClose);
            modalContent.append(modalText);
            $(modalClose).click(function(){
                modal.removeClass('is-active')
            });
            
        }
    })
    .catch(function(error) {
        var modal = $('<div>').addClass('modal is-active');
        var modalBackground = $('<div>').addClass('modal-background');
        var modalContent = $('<div>').addClass('modal-content');
        var modalText = $('<p>').text("Unable to connect to accuweather" + error);
        var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
        answers.append(modal);
        modal.append(modalBackground, modalContent, modalClose);
        modalContent.append(modalText);
        $(modalClose).click(function(){
            modal.removeClass('is-active')
        });
    });
};
// uses locationkey data from the api above and looks up the current conditions for that location
var gitWeather = function(locationKey) {
    var apiUrl = "https://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + weatherApiKey;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                 temp = data[0].Temperature.Imperial.Value;
                iterateTempStatement()
                
                
            });
        } else {
            var modal = $('<div>').addClass('modal is-active');
            var modalBackground = $('<div>').addClass('modal-background');
            var modalContent = $('<div>').addClass('modal-content');
            var modalText = $('<p>').text("Temperature not found in api");
            var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
            answers.append(modal);
            modal.append(modalBackground, modalContent, modalClose);
            modalContent.append(modalText);
            $(modalClose).click(function(){
                modal.removeClass('is-active')
            });
         }
    })
    .catch(function(error) {
        var modal = $('<div>').addClass('modal is-active');
        var modalBackground = $('<div>').addClass('modal-background');
        var modalContent = $('<div>').addClass('modal-content');
        var modalText = $('<p>').text("Unable to connect to accuweather locations key" + error);
        var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
        answers.append(modal);
        modal.append(modalBackground, modalContent, modalClose);
        modalContent.append(modalText);
        $(modalClose).click(function(){
            modal.removeClass('is-active')
        });
    });
};
// looks up the zip code based on the IP address of the computer you are using, if no zipcode is found, it will ask you for a zipcode
var gitIpAddress = function() {
    var apiUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + ipAddressApiKey;
    fetch(apiUrl)
    .then(function(response) {

        if (response.ok ) {
            response.json().then(function(data) {
                var postal_code = data.postal_code;
                // var postal_code = null;
                if (postal_code == null) {
                    zipcodeMenu();
                }
                gitZipLocationKey(postal_code)
            });
        } else {
            var modal = $('<div>').addClass('modal is-active');
            var modalBackground = $('<div>').addClass('modal-background');
            var modalContent = $('<div>').addClass('modal-content');
            var modalText = $('<p>').text("IP address not found with the api");
            var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
            answers.append(modal);
            modal.append(modalBackground, modalContent, modalClose);
            modalContent.append(modalText);
            $(modalClose).click(function(){
                modal.removeClass('is-active')
            });
        }
    })
    .catch(function(error) {
        var modal = $('<div>').addClass('modal is-active');
        var modalBackground = $('<div>').addClass('modal-background');
        var modalContent = $('<div>').addClass('modal-content');
        var modalText = $('<p>').text("Unable to connect to abstractapi" + error);
        var modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
        answers.append(modal);
        modal.append(modalBackground, modalContent, modalClose);
        modalContent.append(modalText);
        $(modalClose).click(function(){
            modal.removeClass('is-active')
        });
       
    });
};
// get started with calling the IP address function and slider function
gitIpAddress()
