// defining inital variables
let options = {}
let jacketRequirementElement = $('#sliderWithValue')
let sweaterRequirementElement = $('#sliderWithValue2')
let answers = $('body')
var temp;
var choices;
var modal;
var modalBackground;
var modalContent;
var goBtnDiv;
var goBtn;
var modalClose;
var contentDiv;
var sweaterOutput = $('sweaterOutput');
var jacketOutput = $('jacketOutput');
var jacketOutputText = 50; // default value for what temp to put on a jacket
var sweaterOutputText = 65; // default value for what temp to put on a sweater
$.getJSON('data.json', function (data){
    choices = data
});
// api key for the weather https://developer.accuweather.com/
let weatherApiKey = 'QnoBmmKUFEVUywOBW0Xbu5EnxoX0Jyot' 
// api key for the IPaddress https://www.abstractapi.com/ip-geolocation-api
let ipAddressApiKey = '935f7d46cc714485a37a6995ea276daa'

// clear page function
function clearPage(){
    while (answers[0].hasChildNodes()) {
        answers[0].removeChild(answers[0].lastChild);
    }
}

// modal html insert
function modalModule(){
    clearPage()
    modal = $('<div>').addClass('modal is-active');
    modalBackground = $('<div>').addClass('modal-background');
    modalContent = $('<div>').addClass('modal-content answers has-text-white is-flex is-justify-content-center is-align-items-center is-align-content-center columns');
    contentDiv = $('<div>').addClass('column main is-12');
    answers.append(modal);
    modalContent.append(contentDiv)
    modalClose = $('<button>').addClass('modal-close').attr('aria-label', 'close');
    modal.append(modalBackground, modalContent, modalClose);
    goBtnDiv = $('<div>');
    goBtn = $('<button>').addClass('button is-rounded').attr('id', 'option').text('Options');
    goBtnDiv.append(goBtn)
    $(goBtn).click(function(){
        optionsMenu();
    });
    $(modalClose).click(function(){
        modal.removeClass('is-active')
    });
    
};

// options menu
function optionsMenu (){
    modalModule()
    $('.modal-close').hide()
    $('#option').hide()
    modalBackground.removeClass('modal-background');
    var optionsH3 = $('<h3>').text('Options');
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
    goBtn = $('<button>').addClass('button is-rounded').attr('id', 'question').text('Save')
    contentDiv.append(optionsH3, jacketDiv, sweaterDiv, goBtn);
    
    bulmaSlider.attach();
    $(goBtn).click(function(){
        handleSave(jacketSlider, sweaterSlider)
        loadOptions()
        iterateTempStatement()
        console.log(temp)
    });    
}

// zipcode prompt
function zipcodeMenu(){
    modalModule()
    $('.modal-close').hide()
    var zipcodeDiv = $('<div>')
    var zipCodeQuestionText = $('<h4>').text('Please enter your Zipcode').addClass('is-light')
    var postalInput = $('<input>').attr('id', 'postalcodeInput').attr('placeholder', 'please enter your zip code');
    var postalBtnDiv = $('<div>')
    var postalBtn = $('<button>').addClass('button is-small is-rounded').attr('id','zipCodeBtn').text('Submit');
    contentDiv.append(zipcodeDiv)
    zipcodeDiv.append(zipCodeQuestionText, postalInput, postalBtnDiv);
    postalBtnDiv.append(postalBtn)
    $('#zipCodeBtn').click(function(){
        var postal_code =  $('#postalcodeInput').val()
        gitZipLocationKey(postal_code)
        modal.removeClass('is-active')
    });
}

// call to load options
loadOptions()

// creates html based on temperatures and options
function iterateTempStatement(){
    clearPage()
    console.log(sweaterOutputText)
    if (temp <= sweaterOutputText && temp >= jacketOutputText) {
        modalModule()
        $('.modal-close').hide()
        var tooCold = $('<div>').attr('id', 'cold');
        contentDiv.append(tooCold, goBtnDiv);
        modalBackground.removeClass('modal-background');
        adding_Questions(choices)
        
    } else if (temp <= sweaterOutputText && temp <= jacketOutputText) {
        modalModule()
        $('.modal-close').hide()
        var freezing = $('<div>').attr('id', 'freezing');
        contentDiv.append(freezing, goBtnDiv);
        modalBackground.removeClass('modal-background');
        adding_Questions(choices)
        
    } else if (temp >= sweaterOutputText && temp <= 90){
        modalModule()
        $('.modal-close').hide()
        var nice = $('<div>').attr('id', 'nice');
        contentDiv.append(nice, goBtnDiv);
        modalBackground.removeClass('modal-background');
        adding_Questions(choices)

    }else if (temp >= 91){
        modalModule()
        $('.modal-close').hide()
        var hot = $('<div>').attr('id', 'hot');
        contentDiv.append(hot, goBtnDiv);
        modalBackground.removeClass('modal-background');
        adding_Questions(choices)
    }else {
        modalModule()
        var modalText = $('<p>').text('didnt load values');
        $('#option').hide
        contentDiv.append(modalText);
        
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
            modalModule()
            var modalText = $('<p>').text("couldn't get the zipcode location");
            $('#option').hide
            contentDiv.append(modalText);
            
        }
    })
    .catch(function(error) {
        modalModule()
        var modalText = $('<p>').text("Unable to connect to accuweather" + error);
        $('#option').hide
        contentDiv.append(modalText);
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
            modalModule()
            var modalText = $('<p>').text("Temperature not found in api");
            $('#option').hide
            contentDiv.append(modalText);
         }
    })
    .catch(function(error) {
        modalModule()
        var modalText = $('<p>').text("Unable to connect to accuweather locations key" + error);
        contentDiv.append(modalText);
        $('#option').hide
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
            modalModule()
            var modalText = $('<p>').text("IP address not found with the api");
            contentDiv.append(modalText);
            $('#option').hide
        }
    })
    .catch(function(error) {
        modalModule()
        var modalText = $('<p>').text("Unable to connect to abstractapi" + error);
        contentDiv.append(modalText);
        $('#option').hide
    });
};
// get started with calling the IP address function and slider function
gitIpAddress()
