$(document).ready(function() {

    // Global variables
    var jsonData;
    // Open json file and make array
    $.getJSON('data/medicines.json', function(data) {
        jsonData = data;
        // Make list of product names. No duplicates.
        var products = [];
        for(i in jsonData){
            if(products.indexOf(jsonData[i].ProductName) == -1){
                products.push(jsonData[i].ProductName);
            }
        }
        // Alphabetize
        products.sort();

        //Build menu options
        for(i in products){
            $("#medicine").append('<option value="'+products[i]+'">'+products[i]+'</option>');
        }
    });

    // Get available product sizes
    $("#medicine").change(function(){
        var medicine = $("#medicine").val();
        var sizes =[];
        for(i in jsonData){
            if(medicine == jsonData[i].ProductName){
                if (sizes.indexOf(jsonData[i].ProductSize) == -1){
                    sizes.push(jsonData[i].ProductSize);
                }
            }
        }
        $('#containerSize').empty();
        for (i in sizes){
            $('#containerSize').append('<option value="'+sizes[i]+'">'+sizes[i]+'</option>');
        }
        $('#containerSize').val(sizes[0]);
        $('#containerSize').selectmenu('refresh');
        $('#containerSize').selectmenu('enable');
    });

    // Get options
    $('#optionsWrapper').hide();
    $("#medicine").change(function(){
        var medicine = $("#medicine").val();
        var options =[];
        for(i in jsonData){
            if(medicine == jsonData[i].ProductName){
                if (jsonData[i].Options.length > 0){
                    if (options.indexOf(jsonData[i].Options) == -1){
                        options.push(jsonData[i].Options);
                    }
                }
            }
        }
        $('#options').empty();
        if (options.length > 1){
            $('#optionsWrapper').slideDown();
            for (i in options){
                $('#options').append('<option value="'+options[i]+'">'+options[i]+'</option>');
            }
            $('#options').val(options[0]);
            $('#options').selectmenu('refresh');
            $('#options').selectmenu('enable');  
        }
        else{
            $('#optionsWrapper').slideUp();
        }
    });

    // Get species list
    $('#speciesWrapper').hide();
    $("#medicine").change(function(){
        var selectedMed = $(this).find(":selected").val();
        var medicine = $("#medicine").val();
        for(i in jsonData){
            if(medicine == jsonData[i].ProductName){
                if (jsonData[i].Species.length > 0) {
                    $('#speciesWrapper').slideDown();
                    $('#species').empty();
                    var species_list = jsonData[i].Species.split(',');
                    for(x in species_list){
                        $('#species').append('<option value="'+species_list[x]+'">'+species_list[x]+'</option>');
                    }
                    $('#species').val(species_list[0]);
                    $('#species').selectmenu('refresh');
                    $('#species').selectmenu('enable');
                }
                else{
                    $('#speciesWrapper').slideUp();
                }
                break;
            }
        }
    });

    // Special Case for Sulfadimethoxine 12.5
    $("#medicine").change(function(){
        var selectedMed = $(this).find(":selected").val();
        var medicine = $("#medicine").val();
        if (medicine == 'Sulfadimethoxine 12.5'){
            $('#days').val(2);
            $('#days').slider('disable');
            $('#daysWrapper').slideUp();
        }
        else{
            $('#days').slider('enable');
            $('#daysWrapper').slideDown();
        }
    });

    // Special case for Baytril
    $('#options').change(function(){
        var selectedOption = $(this).find(":selected").val();
        var selectedMed = $('#medicine').find(":selected").val();
        if (selectedMed == 'Baytril'){
            if (selectedOption == 'High Dose'){
                $('#days').val(1);
            $('#days').slider('disable');
            $('#daysWrapper').slideUp();
            }
            else{
                $('#days').slider('enable');
                $('#daysWrapper').slideDown();
            }
        }
        else{
            $('#days').slider('enable');
            $('#daysWrapper').slideDown();
        }
    });
    

    // Calculate medicine instructions on click
    $("#calculate").click(function() {
        $('#form').hide();

        // Rx
        if (jsonData[i].Script.length > 0){
            $('.rx').append('Prescription needed, consult your veterinarian.')
        }

        // Form values
        var medicine = $("#medicine").val();
        var containerSize = $('#containerSize').val();
        var days = $('#days').val();
        var species = $('#species').val();
        var numberOfAnimals = $("#numberOfAnimals").val();
        var avgWeight = $("#avgWeight").val();
        var selectedOption = $("#options").val();
        if (selectedOption == null){ // Convert null to empty string
            selectedOption = '';
        }
        var totalWeight = numberOfAnimals * avgWeight;

        // Medicine values
        var container = jsonData[i].Container;
        var dose = jsonData[i].Dose;
        var doseUnit = jsonData[i].DoseUnit;
        var specialCase = jsonData[i].SpecialCase;
        var containerAmount = jsonData[i].ContainerAmount;
        var containerUnit = jsonData[i].ContainerUnit;

        // Form values displayed
        $(".medicineName").append(medicine);
        if (selectedOption != ''){
            $('.option').append('Options: '+selectedOption);
        }
        $('.containerSize').append(containerSize);
        if (species == null){
            $('.species').append('Consult your veterinarian.');
        }
        else{
            $('.species').append(species);
        }
        $('.days').append(days);
        $('.numberOfAnimals').append(numberOfAnimals);
        $('.avgWeight').append(avgWeight);

        // Calculate amount of medicine needed.
        for (i in jsonData){
            if(medicine == jsonData[i].ProductName){
                if(containerSize == jsonData[i].ProductSize){
                    if (selectedOption == jsonData[i].Options){
                        // Oral Water
                        if (jsonData[i].Application == 'Oral Water'){
                            var totalWaterNeeded = totalWeight / 100; // A gallon of water per 100 pounds.
                            var stock = totalWaterNeeded / 128; // A gallon of stock for every 128 gallons of water.
                            var containersPerGallonOfStock = jsonData[i].AmountUse;
                            var containersPerDay = stock / containersPerGallonOfStock;
                            var totalContainers = Math.ceil(containersPerDay * days);
                            
                            // Round reported numbers
                            if (stock > 0.1){
                                stock = Math.round(stock * 100) / 100;
                                $('.stock').append('Mix into '+stock+' gallons of stock solution each day.');
                            }
                            else{ // If less than point one gallon, give amount in smaller units
                                stock = stock * 3785.41178;
                                stock = Math.round(stock * 100) / 100;
                                $('.stock').append('Mix into '+stock+' ml of stock solution each day.');
                            }
                        }
                        else{ // Topical, Injection, or Oral Feed
                            var poundsTreatedPerContainer = jsonData[i].AmountUse;
                            var containerUnit = jsonData[i].ContainerUnit;
                            // Give instructions in ml
                            if (containerUnit == 'Liter'){
                                containerUnit = 'ml';
                                containerAmount = containerAmount * 1000;
                            }
                            if (containerUnit == 'Quarts'){
                                containerUnit = 'ml';
                                containerAmount = containerAmount * 946.35;
                            }
                            var containersPerDay = totalWeight / poundsTreatedPerContainer;
                            var totalContainers = Math.ceil(containersPerDay * days);
                            var containersPerAnimal = containersPerDay / numberOfAnimals;
                            var amountPerAnimal = containersPerAnimal * containerAmount; // In ml
                        }
                        // Special Case
                        if (specialCase == 1){
                            if (medicine == 'Neomycin 325'){
                                if (species == 'Swine'){
                                    if (avgWeight > 100){
                                        containersPerGallonOfStock = jsonData[i].AmountUse2;
                                        containersPerDay = stock / containersPerGallonOfStock;
                                        totalContainers = Math.ceil(containersPerDay * days);
                                    }
                                }
                            }
                            if (medicine == 'Ivermectin'){
                                if (species == 'Swine'){
                                    poundsTreatedPerContainer = jsonData[i].AmountUse2;
                                    containersPerDay = totalWeight / poundsTreatedPerContainer;
                                    containersPerAnimal = containersPerDay / numberOfAnimals;
                                    amountPerAnimal = containersPerAnimal * containerAmount; // In ml
                                }
                            }
                        }
                        // Display amounts
                        // Round display amounts
                        var amountPerDay = containersPerDay * containerAmount;
                        containersPerDay = Math.round(containersPerDay * 100) / 100;
                        amountPerDay = Math.round(amountPerDay * 100) / 100;
                        amountPerAnimal = Math.round(amountPerAnimal * 100) / 100;

                        $('.total').append(totalContainers + ' ' + container);

                        if (containersPerDay > 1){
                            $('.containers').append('Your herd needs '+containersPerDay+' '+container);
                        }
                        else{ // If less than one container, give amount in smaller units
                            $('.containers').append('Your herd needs '+amountPerDay+' '+containerUnit);
                        }
                        if (days > 1){
                            $('.containers').append(' of '+medicine+' per day for '+days+' days.');
                        }
                        else{
                            $('.containers').append(' of '+medicine+' for '+days+' day.');
                        }
                        // Topical
                        if (jsonData[i].Application == 'Pour On'){
                            $('.stock').append('Apply '+amountPerAnimal+' '+containerUnit+' per animal topically as directed.');
                        }
                        // Injection
                        if (jsonData[i].Application == 'Injection'){
                            $('.stock').append('Inject '+amountPerAnimal+' '+containerUnit+' per animal.');
                        }
                        if (jsonData[i].Application == 'Oral On Feed'){
                            $('.stock').append('Add '+amountPerAnimal+' '+containerUnit+' into the feed of each animal.');
                        }
                        // Special Case
                        if (specialCase == 1){
                            if (medicine == 'Sulfadimethoxine 12.5'){
                                // Day One
                                containersPerGallonOfStock = jsonData[i].AmountUse;
                                containersDayOne = stock / containersPerGallonOfStock;
                                // Day two
                                containersPerGallonOfStock = jsonData[i].AmountUse2;
                                containersDayTwo = stock / containersPerGallonOfStock;
                                // Round display amounts
                                containersDayOne = Math.round(containersDayOne * 100) / 100;
                                containersDayTwo = Math.round(containersDayTwo * 100) / 100;
                                // Total
                                totalContainers = Math.ceil(containersDayOne + containersDayTwo);
                                // Display Amounts
                                $('.containers').empty();
                                $('.containers').append('Your herd needs '+containersDayOne+' '+container+' for the first day and '+containersDayTwo+' '+container+' the second day.');
                            }
                            if (medicine == 'Ibuprofen 15.80%'){
                                $('.total').empty();
                                totalContainers = Math.ceil((containersPerDay * days) / 8); // Give total in gallons
                                $('.total').append('Total Needed: '+totalContainers+ ' gallon containers'); 
                            }
                            if (medicine == 'Gen-Guard Bucket'){
                                $('.total').empty();
                                totalContainers = Math.ceil((containersPerDay * days) / 19); // Give total in gallons
                                $('.total').append('Total Needed: '+totalContainers+ ' buckets'); 
                            }
                        }
                    }
                }
            }
        }
        $('#instructions').css('display','block');

        // Did they fill out the form right?
        if (medicine == 'nope'){
            $(".instructions").empty();
            $(".instructions").append('<h3><li>Please choose a medicine!</li></h1>');
        }
        if (numberOfAnimals == ''){
            $(".instructions").empty();
            $(".instructions").append('<h3><li>Please enter the number of animals in your herd.</li></h1>');
        }
        if (avgWeight == ''){
            $(".instructions").empty();
            $(".instructions").append('<h3><li>Please enter the average weight of your animals.</li></h1>');
        }
        // Make sure they entered integers
        if ((typeof numberOfAnimals != "number") && Math.floor(numberOfAnimals) != numberOfAnimals){
            $(".instructions").empty();
            $(".instructions").append('<h3><li>Please only enter numbers in the Number of Animals field.</li></h1>');
        }
        if ((typeof avgWeight != "number") && Math.floor(avgWeight) != avgWeight){
            $(".instructions").empty();
            $(".instructions").append('<h3><li>Please only enter numbers in the Average Weight field.</li></h1>');
        }

        $("#clear").click(function() {
            location.reload();
        });

    });

 });
