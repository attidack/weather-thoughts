bulmaSlider.attach();
let options = {}

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
    }
    setItems()
}
loadOptions()
function setItems(){
    let zipcode = $('#zipcode').val()
    let name = $('#name').val()
    let jacketRequirement = $('#sliderWithValue').val()
    let sweaterRequirement = $('#sliderWithValue2').val()
    let jacketoutput = $('#jacketOutput').val()
    let sweaterOutput = $('#sweaterOutput').val()    
    
    name = optionsObject.name;
    zipcode = optionsObject.zip;
    // $('#sliderWithValue').attr('value', "100")
    // $('#sliderWithValue').attr('value', optionsObject.jacket)
    // sweaterOutput = optionsObject.sweater;
    console.log(sweaterOutput)  
    jacketoutput = optionsObject.jacket;
    jacketRequirement = optionsObject.jacket;
    sweaterRequirement = optionsObject.sweater;
}

var getUserRepos = function(user) {
    // format the githup api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        // Notic ethis '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub"); 
    });
};
