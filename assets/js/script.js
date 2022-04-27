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
    iterateTempStatement()
});
$('#option').click(function(){
    $('#welcomeScreen').show()
    $('#answers').hide()
    $('#option').hide()
});
loadOptions()

function iterateTempStatement(){
    console.log(temp)
   while (answers[0].hasChildNodes()) {
        answers[0].removeChild(answers[0].lastChild);
    }
    if (temp < sweaterRequirementElement.val() && temp > jacketRequirementElement.val()) {
        var tooCold = $('<div>').attr('id', 'cold');
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
        alert('didnt load values')
    }
}

// Create Question Function
function adding_Questions(data){
    $('#cold').text(data.Answers.cold)
    $('#freezing').text(data.Answers.freezing)
    $('#nice').text(data.Answers.nice)
    $('#hot').text(data.Answers.hot)
}

function handleSave(){
    // let name = $('#name').val()
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
    // let name = $('#name');
    let jacketRequirement = $('#sliderWithValue');
    let sweaterRequirement = $('#sliderWithValue2');
    let jacketOutput = $('#jacketOutput');
    let sweaterOutput = $('#sweaterOutput');  
    // name.val(optionsObject.name);
    jacketRequirement.attr('value',options.jacket);
    jacketOutput.val(options.jacket);
    sweaterRequirement.attr('value',options.sweater);
    sweaterOutput.val(options.sweater);
}

var gitZipLocationKey = function(postal_code) {
    // format the githup api url
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=qAJl4fqptTuBALsqBF3AUC4OcOz3IQSZ&q=" + postal_code;

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var locationKey = data[0].Key
                gitWeather(locationKey)
            });
        } //else {
        //     alert("couldn't get the zipcode location");
        // }
    })
    // .catch(function(error) {
    //     // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
    //     alert("Unable to connect to accuweather"); 
    // });
};
var gitWeather = function(locationKey) {
    // format the githup api url
    var apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=qAJl4fqptTuBALsqBF3AUC4OcOz3IQSZ";

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                 temp = data[0].Temperature.Imperial.Value
                iterateTempStatement()
                
                
            });
        } //else {
        //     alert("Temp not found");
        // }
    })
    // .catch(function(error) {
    //     // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
    //     alert("Unable to connect to accuweather"); 
    // });
};
var gitIpAddress = function() {
    // format the githup api url
    var apiUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=935f7d46cc714485a37a6995ea276daa";

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data.postal_code)
                var postal_code = data.postal_code
                gitZipLocationKey(postal_code)
                
            });
        } else {
            $.getJSON('https://ipinfo.io/json', function(data) {
                console.log(JSON.stringify(data, null, 2));
            });
            alert("Ip not found");
        }
    })
    // .catch(function(error) {
    //     // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
    //     alert("Unable to connect to abstractapi"); 
    // });
};

// $.getJSON('https://ipinfo.io/json', function(data) {
//   console.log(JSON.stringify(data, null, 2));
// });

gitIpAddress()
bulmaSlider.attach();