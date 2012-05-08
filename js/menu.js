$(document).ready(function() {
    // Global variables
    var jsonData;

    $.getJSON('data/medicines.json', function(data) {
        jsonData = data;
        var products = [];
        for(i in data){
            products.push(data[i].Product);
        }
        // Alphabetize
        products.sort();
        for(i in products){
            $("#medicine").append('<option value="'+products[i]+'">'+products[i]+'</option>');
        }
    });

    $("#medicine").change(function(){
        var selectedMed = $(this).find(":selected").val();
        var medicine = $("#medicine").val();
        for(i in jsonData){
            if(medicine == jsonData[i].Product){
                if (jsonData[i].Species.length > 0) {
                    $('#species').empty();
                    var species_list = jsonData[i].Species.split(',');
                    //console.log(species_list);
                    for(x in species_list){
                        $('#species').append('<option value="'+species_list[x]+'">'+species_list[x]+'</option>');
                        //console.log(species_list[x]);
                    }
                    $('#species').val(species_list[0]);
                    $('#species').selectmenu('refresh');
                    $('#species').selectmenu('enable');
                }
            }
        }
    });

    $("#calculate").click(function() {
        var medicine = $("#medicine").val();
        $('#form').hide();

        //Calculate amount of water needed in gallons.
        var numAnimals = $("#numAnimals").val();
        //console.log("numAnimals: " + numAnimals);
        var avgWeight = $("#weight").val();
        // console.log("avgWeight: " + avgWeight);
        var totalWeight = numAnimals * avgWeight;
        // console.log("totalWeight:" + totalWeight);
        var water = totalWeight / 100;
        //$('.water').append('Your herd needs '+water+' gallons of water a day.<br/>');
        var stock = water / 128;

        // Calculate amount of medicine needed.
        for (i in jsonData){
            if(medicine == jsonData[i].Product){
                // Oral
                if (jsonData[i].Use == 'Oral'){
                    var packets = stock / jsonData[i].AmountUse;
                    $('.packets').append('Your herd needs '+Math.ceil(packets)+' packets of '+medicine+' per day ');
                    $('.stock').append('to make '+Math.round(stock * 10) / 10+' gallons of stock solution.');
                }
                if (jsonData[i].Use == 'Topical'){
                    var topical = totalWeight / jsonData[i].AmountUse;
                    $('.packets').append('Your herd needs '+Math.round(topical * 10) / 10+' containers of '+medicine+' per day.');
                }
                if (jsonData[i].Use == 'Injection'){
                    var bottles = totalWeight / jsonData[i].AmountUse;
                    $('.packets').append('Your herd needs '+Math.round(bottles * 10) / 10+' bottles of '+medicine+' per day.');
                }
                if (jsonData[i].Use == 'Feed'){
                    var containers = totalWeight / jsonData[i].AmountUse;
                    $('.packets').append('Your herd needs '+Math.round(containers * 10) / 10+' containers of '+medicine+' per day.');
                }

                //Special cases
                if (medicine == 'Neomycin 325'){
                    if ($('#species').val() == 'Swine'){
                        $('.packets').empty();
                        $('.stock').empty();
                        if (avgWeight >= 100){
                            var packets = stock / 0.5;
                            $('.packets').append('Your herd needs '+Math.ceil(packets)+' packets of '+medicine+' per day ');
                            $('.stock').append('to make '+Math.round(stock * 10) / 10+' gallons of stock solution.');
                        }
                        else {
                            var packets = stock / jsonData[i].AmountUse;
                            $('.packets').append('Your herd needs '+Math.ceil(packets)+' packets of '+medicine+' per day ');
                            $('.stock').append('to make '+Math.round(stock * 10) / 10+' gallons of stock solution.');
                        }
                    }
                }
                if (medicine =='Sulfadimethoxine 12.5') {
                    $('.packets').empty();
                    $('.stock').empty();
                    var pktDayOne = stock / jsonData[i].AmountUse;
                    var pktDayTwo = stock / 24;
                    $('.packets').append('Your herd needs '+Math.ceil(pktDayOne)+' packets of '+medicine+' the first day and '+Math.ceil(pktDayTwo)+' the second day');
                    $('.stock').append('to make '+Math.round(stock * 10) / 10+' gallons of stock solution per day.');
                }

                // Rx
                if (jsonData[i].Rx.length > 0){
                    $('.rx').append('Script needed, consult your Veterinarian.')
                }
            }
        }
        $('#instructions').css('visibility','visible');

        $("#clear").click(function() {
            location.reload();
        });

    });

 });
