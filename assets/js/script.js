bulmaSlider.attach();

fetch('data.json')
.then(function (response){
    return response.json();
})