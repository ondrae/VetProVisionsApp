$(document).ready(function() {
    // Global variables
    var jsonData;

    $.getJSON('data/medicines.json', function(data) {
        jsonData = data;
        var products = [];
        for(i in data){
            products.push(data[i].product);
        }
        // Alphabetize
        products.sort();
        for(i in products){
            $("#medicine").append('<option value="'+products[i]+'">'+products[i]+'</option>');
        }

    });

    $("#calculate").click(function() {
        var medicine = $("#medicine").val();
        $('#form').hide(1000);

        //Calculate amount of water needed in gallons.
        var numAnimals = $("#numAnimals").val();
        // console.log("numAnimals: " + numAnimals);
        var avgWeight = $("#weight").val();
        // console.log("avgWeight: " + avgWeight);
        var totalWeight = numAnimals * avgWeight;
        // console.log("totalWeight:" + totalWeight);
        var water = totalWeight / 100;
        $('.water').append('Your herd needs '+water+' gallons of water a day.<br/>');

        // Calculate amount of medicine needed.
        
        // console.log("Medicine: " + medicine);

        for (i in jsonData){
            // console.log(jsonData[i]);
            if(medicine == jsonData[i].product){
                // If product is sold in grams.
                if(jsonData[i].amount_unit == 'gm'){
                    var dose = (totalWeight * jsonData[i].dose) / 1000;
                    //console.log("dose_gm: " + dose_gm);
                    $('.dose').append('Your herd needs '+dose+' grams of '+medicine+' a day.<br/>');
                }
                if(jsonData[i].amount_unit == 'mg'){
                    var dose_mg = totalWeight * jsonData[i].dose;
                    $('.dose').append('Your herd needs '+dose+' milligrams of '+medicine+' a day.<br/>');
                }
                    $('.pkt_size').append(medicine+' is sold in '+jsonData[i].amount+' gram packets.<br/>');
                    num_of_packets = dose / jsonData[i].amount;
                    //console.log("num_of_packets: " + Math.ceil(num_of_packets));
                    $('.pkt_per_day').append('You\'ll need '+Math.ceil(num_of_packets)+' packets per day.<br/>');
                    //Figure out amount of stock solution.
                    var solution = water / 128;
                    $('.solution').append('Mix the packets into '+Math.round(solution)+' gallons of stock solution.<br/>');
            }
        }
        $('#instructions').css('visibility','visible');
    })
 });
