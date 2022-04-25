let options = {}
$('#answers').hide()
let jacketRequirementElement = $('#sliderWithValue')
let sweaterRequirementElement = $('#sliderWithValue2')
let answers = $('#answers')
var temp;
var choices;
 $.getJSON('data.json', function (data){
    console.log(data.Answers.cold)
    choices = data
});

$('button').click(function(){
    $('#welcomeScreen').hide()
    $('#answers').show()
    handleSave()
    iterateTempStatement()
});

function iterateTempStatement(){
    if (temp < sweaterRequirementElement.val() && temp > jacketRequirementElement.val()) {
        var tooCold = $('<div>')
        .attr('id', 'cold');
        answers.append(tooCold)
        adding_Questions(choices)
        
    } else if (temp < sweaterRequirementElement.val() && temp < jacketRequirementElement.val()) {
        var freezing = $('<div>')
        .attr('id', 'freezing');
        answers.append(freezing)
        adding_Questions(choices)
        
    } else if (temp > sweaterRequirementElement.val() && temp < 90){
        var nice = $('<div>')
        .attr('id', 'nice');
        answers.append(nice)
        adding_Questions(choices)
    }else {
        var hot = $('<div>')
        .attr('id', 'hot');
        answers.append(hot)
        adding_Questions(choices)
    }
}

// Create Question Function
function adding_Questions(data){
    $('#cold').text(data.Answers.cold)
    $('#freezing').text(data.Answers.nice)
    $('#nice').text(data.Answers.hot)
    $('#hot').text(data.Answers.hot)
}

function handleSave(){
    let name = $('#name').val()
    let jacketRequirement = $('#sliderWithValue').val()
    let sweaterRequirement = $('#sliderWithValue2').val()
    var optionsObject = {
        name,
        jacket: jacketRequirement,
        sweater: sweaterRequirement,
    }
    options[optionsObject.name] = optionsObject.zip, optionsObject.jacket
    localStorage.setItem('options', JSON.stringify(optionsObject))
}
function loadOptions(){
    optionsObject = JSON.parse(localStorage.getItem('options'))
    if (!options) {
        options = {}
    } else {
    setItems()
    }
}

loadOptions()

function setItems(){
    let name = $('#name');
    let jacketRequirement = $('#sliderWithValue');
    let sweaterRequirement = $('#sliderWithValue2');
    let jacketOutput = $('#jacketOutput');
    let sweaterOutput = $('#sweaterOutput');  
    name.val(optionsObject.name);
    jacketRequirement.attr('value',optionsObject.jacket);
    jacketOutput.val(optionsObject.jacket);
    sweaterRequirement.attr('value',optionsObject.sweater);
    sweaterOutput.val(optionsObject.sweater);
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
                console.log(temp)
                
                
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
            alert("Ip not found");
        }
    })
    // .catch(function(error) {
    //     // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
    //     alert("Unable to connect to abstractapi"); 
    // });
};
gitIpAddress()
bulmaSlider.attach();