// defining inital variables
let options = {}
$('#welcomeScreen').hide()
let jacketRequirementElement = $('#sliderWithValue')
let sweaterRequirementElement = $('#sliderWithValue2')
let answers = $('#answers')
var temp;
var choices;
$.getJSON('data.json', function (data){
    choices = data
});
// api key for the weather https://developer.accuweather.com/
let weatherApiKey = 'QnoBmmKUFEVUywOBW0Xbu5EnxoX0Jyot' 
// api key for the IPaddress https://www.abstractapi.com/ip-geolocation-api
let ipAddressApiKey = '935f7d46cc714485a37a6995ea276daa'

// on click functions for the buttons
$('#question').click(function(){
    $('#welcomeScreen').hide()
    $('#answers').show()
    $('#option').show()
    handleSave()
});

$('#option').click(function(){
    $('#welcomeScreen').show()
    $('#answers').hide()
    $('#option').hide()
});

// call to load options
loadOptions()

// creates html based on temperatures and options
function iterateTempStatement(){
   while (answers[0].hasChildNodes()) {
        answers[0].removeChild(answers[0].lastChild);
    }
    if (temp < sweaterRequirementElement.val() && temp > jacketRequirementElement.val()) {
        var tooCold = $('<div>').attr('id', 'cold').addClass("column is-three-fifths answers");
        answers.append(tooCold)
        adding_Questions(choices)
        
    } else if (temp < sweaterRequirementElement.val() && temp < jacketRequirementElement.val()) {
        var freezing = $('<div>').attr('id', 'freezing');
        answers.append(freezing)
        adding_Questions(choices)
        
    } else if (temp > sweaterRequirementElement.val() && temp < 90){
        var nice = $('<div>').attr('id', 'nice');
        answers.append(nice)
        adding_Questions(choices)
    }else if (temp > 91){
        var hot = $('<div>').attr('id', 'hot');
        answers.append(hot) 
        adding_Questions(choices)
    }else {
        console.log(choices)
        alert('didnt load values')
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
function handleSave(){
    let jacketRequirement = $('#sliderWithValue').val()
    let sweaterRequirement = $('#sliderWithValue2').val()
    var optionsObject = {
        jacket: jacketRequirement,
        sweater: sweaterRequirement,
    }
    options = optionsObject
    options[optionsObject.zip] =  optionsObject.jacket
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
    let jacketRequirement = $('#sliderWithValue');
    let sweaterRequirement = $('#sliderWithValue2');
    let jacketOutput = $('#jacketOutput');
    let sweaterOutput = $('#sweaterOutput');  
    jacketRequirement.attr('value',options.jacket);
    jacketOutput.val(options.jacket);
    sweaterRequirement.attr('value',options.sweater);
    sweaterOutput.val(options.sweater);
}

// api call section
// gets a location key from accuweather based off the zip code
var gitZipLocationKey = function(postal_code) {
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=" + weatherApiKey + "&q=" + postal_code;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var locationKey = data[0].Key
                gitWeather(locationKey)
            });
        } else {
            alert("couldn't get the zipcode location");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to accuweather"); 
    });
};
// uses locationkey data from the api above and looks up the current conditions for that location
var gitWeather = function(locationKey) {
    var apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + weatherApiKey;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                 temp = data[0].Temperature.Imperial.Value
                 console.log(temp)
                iterateTempStatement()
                
                
            });
        } else {
             alert("Temp not found");
         }
    })
    .catch(function(error) {
        alert("Unable to connect to accuweather locations key"); 
    });
};

// looks up the zip code based on the IP address of the computer you are using, if no zipcode is found, it will ask you for a zipcode
var gitIpAddress = function() {
    var apiUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + ipAddressApiKey;
    fetch(apiUrl)
    .then(function(response) {

        if (response.ok ) {
            response.json().then(function(data) {
                var postal_code = data.postal_code
                // var postal_code = null;
                if (postal_code == null) {
                    alert("please enter a postal code");
                    $('#option').hide()
                    $('#welcomeScreen').show()
                    $('#answers').hide()
                    var zipCodeQuestionText = $('<h4>').text('Zipcode').addClass('is-light')
                    var postalInput = $('<input>').attr('id', 'postalcodeInput').attr('placeholder', 'please enter your zip code');
                    var zipcodeInput = $('#zipcodeInput')
                    zipcodeInput.append(zipCodeQuestionText, postalInput)
                    // add more fuctionality to the click
                    $('#question').click(function(){
                        console.log($('#postalcodeInput').val())
                        var postal_code =  $('#postalcodeInput').val()
                        gitZipLocationKey(postal_code)
                    });
                }
                gitZipLocationKey(postal_code)
            });
        } else {
            alert("Ip not found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to abstractapi"); 
    });
};
// get started with calling the IP address function and slider function
gitIpAddress()
bulmaSlider.attach();