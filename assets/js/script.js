
let options = {}
let zipcodeElement = $('#zipcode');

fetch('data.json')
.then(function (response){
    return response.json();
})

let saveBtn = $('button').on("click", handleSave )

function handleSave(){
    let zipcode = $('#zipcode').val()
    let name = $('#name').val()
    let jacketRequirement = $('#sliderWithValue').val()
    let sweaterRequirement = $('#sliderWithValue2').val()
    var optionsObject = {
        name,
        zip: zipcode,
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
    zipcodeElement.val(optionsObject.zip);
    
    jacketRequirement.attr('value',optionsObject.jacket);
    jacketOutput.val(optionsObject.jacket);

}

var gitZipLocationKey = function() {
    // format the githup api url
    var zipcode = zipcodeElement.val()
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=qAJl4fqptTuBALsqBF3AUC4OcOz3IQSZ&q=" + zipcode;

    //make a request to the url
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
        // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to accuweather"); 
    });
};
var gitWeather = function(locationKey) {
    // format the githup api url
    var apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=qAJl4fqptTuBALsqBF3AUC4OcOz3IQSZ";

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var temp = data[0].Temperature.Imperial.Value
                
            });
        } else {
            alert("Temp not found");
        }
    })
    .catch(function(error) {
        // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to accuweather"); 
    });
};
var gitIpAddress = function(locationKey) {
    // format the githup api url
    var apiUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=935f7d46cc714485a37a6995ea276daa";

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data[0].Temperature.Imperial.Value)
                var temp = data[0].Temperature.Imperial.Value
                
            });
        } else {
            alert("Ip not found");
        }
    })
    .catch(function(error) {
        // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to accuweather"); 
    });
};
 bulmaSlider.attach();
 gitZipLocationKey()