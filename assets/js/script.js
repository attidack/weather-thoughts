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

loadOptions()

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

function adding_Questions(data){
    $('#cold').text(data.Answers.cold)
    $('#freezing').text(data.Answers.freezing)
    $('#nice').text(data.Answers.nice)
    $('#hot').text(data.Answers.hot)
}

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
function loadOptions(){
    var optionsObject = localStorage.getItem('options')
    if (!optionsObject) {
        options = {
            jacket: 50,
            sweater: 65,
        }
    } else {
        options = JSON.parse(optionsObject)
    setItems()
    }
}
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
var gitZipLocationKey = function(postal_code) {
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=qAJl4fqptTuBALsqBF3AUC4OcOz3IQSZ&q=" + postal_code;
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
var gitWeather = function(locationKey) {
    var apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=qAJl4fqptTuBALsqBF3AUC4OcOz3IQSZ";
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
        alert("Unable to connect to accuweather"); 
    });
};
var gitIpAddress = function() {
    var apiUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=935f7d46cc714485a37a6995ea276daa";
    fetch(apiUrl)
    .then(function(response) {

        if (response.ok ) {
            response.json().then(function(data) {
                var postal_code = data.postal_code
                if (postal_code == null) {
                    alert("please enter a postal code");
                    $('#option').hide()
                    $('#welcomeScreen').show()
                    $('#answers').hide()
                    var zipCodeQuestionText = $('h5').text('Zipcode')
                    var postalInput = $('<input>').attr('id', 'postalcodeInput').attr('placeholder', 'please enter your zip code');
                    var zipcodeInput = $('#zipcodeInput')
                    zipcodeInput.append(zipCodeQuestionText, postalInput)
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

gitIpAddress()
bulmaSlider.attach();