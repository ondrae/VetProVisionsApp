$(document).ready(function() {
    // Global variables
    var jsonData;
    var num_of_packets;

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
        //$("#form").slideUp();
        // Clear any existing instructions.
        $('#instr_text').empty();
        //$('#instr_box').add('.full-height');
        //$('#startOver').show();
        if($('#instr_box').css('display')=='block'){
            $('#instr_box').hide();
        }
        $('#instr_box').slideDown('slow');

        //Calculate amount of water needed in gallons.
        var numAnimals = $("#numAnimals").val();
        // console.log("numAnimals: " + numAnimals);
        var avgWeight = $("#weight").val();
        // console.log("avgWeight: " + avgWeight);
        var totalWeight = numAnimals * avgWeight;
        // console.log("totalWeight:" + totalWeight);
        var water = totalWeight / 100;
        $('#instr_text').append('Your herd needs '+water+' gallons of water a day.<br/>');

        // Calculate amount of medicine needed.
        var medicine = $("#medicine").val();
        // console.log("Medicine: " + medicine);

        for (i in jsonData){
            // console.log(jsonData[i]);
            if(medicine == jsonData[i].product){
                // If product is sold in grams.
                if(jsonData[i].amount_unit == 'gm'){
                    var dose_gm = (totalWeight * jsonData[i].dose) / 1000;
                    //console.log("dose_gm: " + dose_gm);
                    $('#instr_text').append('Your herd needs '+dose_gm+' grams of '+medicine+' a day.<br/>');
                    $('#instr_text').append(medicine+' is sold in '+jsonData[i].amount+' gram packets.<br/>');
                    num_of_packets = dose_gm / jsonData[i].amount;
                    //console.log("num_of_packets: " + Math.ceil(num_of_packets));
                    $('#instr_text').append('You\'ll need '+Math.ceil(num_of_packets)+' packets per day.<br/>');
                    //Figure out amount of stock solution.
                    var solution = water / 128;
                    $('#instr_text').append('Mix the packets into '+solution+' gallons of stock solution.<br/>');

                }
                // If product is sold in milligrams.
                if(jsonData[i].amount_unit == 'mg'){
                    var dose_mg = totalWeight * jsonData[i].dose;
                    //console.log("dose_mg: " + dose_mg);
                    $('#instr_text').append('Your herd needs '+dose_mg+' milligrams of '+medicine+' a day.<br/>');
                    num_of_packets = dose_mg / jsonData[i].amount;
                    //console.log("amount: " + jsonData[i].amount);
                    //console.log("num_of_packets: " + num_of_packets);
                    $('#instr_text').append(Math.ceil(num_of_packets));
                }
            }
        }

    })
    $("#startOver").click(function() {
        $("#form").slideDown();
    })
 });
