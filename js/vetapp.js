// Returns the version of Windows Internet Explorer or a -1
function getInternetExplorerVersion()
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

// Wait for page and JS libraries to load.
$(document).ready(function() {

    // Test for IE 6 or 7
    var browserName = navigator.appName;
    var browserVer = getInternetExplorerVersion();

    //console.log(browserVer);

    if (browserName == 'Microsoft Internet Explorer' &&
        (browserVer == '6' || browserVer == '7')
        ) {
            alert('Please upgrade your browser to use the Vet Provisions Dosage Calculator.');
    }

    // Load the Medicine data into a list of json objects.
    $.getJSON('data/medicines.json', function(medicines) {

        // MENU ----------------------------------------------

        function hideInitMenu(){
            $('#sizeWrapper').slideUp();
            $('#optionsWrapper').slideUp();
            $('#speciesWrapper').slideUp();
        }

        // Fill the Medicine name drop down menu.
        function fillMedicineMenu(medicines){
            var medicineNames = [];
            for(i in medicines){
                if($.inArray(medicines[i].ProductName, medicineNames) == -1){
                    medicineNames.push(medicines[i].ProductName);
                }
            }
            // Alphabetize
            medicineNames.sort();
            //Build menu options
            for(i in medicineNames){
                $("#medicine").append('<option value="'+medicineNames[i]+'">'+medicineNames[i]+'</option>');
            }
        }

        // Listen for selected medicine. Return list of all medicines with same name.
        function getSelectedMedicines(medicines){
            var medicine = $("#medicine").val();
            var selectedMedicines = [];
            for (i in medicines){
                if (medicine == medicines[i].ProductName){
                    selectedMedicines.push(medicines[i]);
                }
            }
            return selectedMedicines;
        }

        // Fill the Container Size drop down menu.
        function fillSizeMenu(selectedMedicines){
            var sizes =[];
            for(i in selectedMedicines){
                if ($.inArray(selectedMedicines[i].ProductSize, sizes) == -1){
                    sizes.push(selectedMedicines[i].ProductSize);
                }
            }
            $('#containerSize').empty();
            if (sizes.length > 0){
                $('#sizeWrapper').slideDown();
                for (i in sizes){
                    $('#containerSize').append('<option value="'+sizes[i]+'">'+sizes[i]+'</option>');
                }
                try{
                    $('#containerSize').val(sizes[0]);
                }
                catch(err){var ieDebug = 0;}
                $('#containerSize').selectmenu('refresh');
                $('#containerSize').selectmenu('enable');
            }
            else{
                $('#sizeWrapper').slideUp();
                $('#sizeWrapper').empty();
            }
        }

        // Fill Options drop down menu. Only show if there are any options to choose.
        function fillOptionsMenu(selectedMedicines){
            $('#options').empty();
            var options =[];
            for(i in selectedMedicines){
                if (selectedMedicines[i].Options.length > 0){
                    if ($.inArray(selectedMedicines[i].Options, options) == -1){
                        options.push(selectedMedicines[i].Options);
                    }
                }
            }
            if (options.length > 0){
                $('#optionsWrapper').slideDown();
                for (i in options){
                    $('#options').append('<option value="'+options[i]+'">'+options[i]+'</option>');
                }
                try{
                    $('#options').val(options[0]);
                }
                catch(err){ var ieDebug = 0;}
                $('#options').selectmenu('refresh');
                $('#options').selectmenu('enable');  
            }
            else{
                $('#optionsWrapper').slideUp();
            }
        }

        // Fill Species drop down menu. Only show if Species are available.
        function fillSpeciesMenu(selectedMedicines){
            $('#species').empty();
            var species_list = [];
            var species_split;
            for(i in selectedMedicines){
                if (selectedMedicines[i].Species.length > 0) {
                    species_split = selectedMedicines[i].Species.split(',');
                    for (x in species_split){
                        if ($.inArray(species_split[x], species_list) == -1){
                            species_list.push(species_split[x]);
                        }
                    }
                }
            }
            if (species_list.length > 0){
                $('#speciesWrapper').slideDown();
                for (i in species_list){
                    $('#species').append('<option value="'+species_list[i]+'">'+species_list[i]+'</option>');
                }
                try{
                    $('#species').val(species_list[0]);
                }
                catch(err){ var ieDebug = 0;}
                $('#species').selectmenu('refresh');
                $('#species').selectmenu('enable');
            }else{
                $('#speciesWrapper').slideUp();
            }
        }

        // Show email field if email is not stored in localStorage.
        function showEmailField(){
            if (window.localStorage.getItem("email")){
                $('#emailBox').css('display','none');
            }
        }

        // Special Cases for the Menu
        function menuSpecialCases(){
            
            $("#medicine").change(function(){
                var medicine = $("#medicine").val();
                // Special case for Draxxin
                if (medicine == 'Draxxin'){
                    try{
                        $('#days').val(1);
                    }
                    catch(err){ var ieDebug = 0;}
                    $('#days').slider('disable');
                    $('#daysWrapper').slideUp();
                }
                // Special Case for Sulfadimethoxine 12.5
                else if (medicine == 'Sulfadimethoxine 12.5'){
                    try{
                        $('#days').val(2);
                    }
                    catch(err){ var ieDebug = 0;}
                    $('#days').slider('disable');
                    $('#daysWrapper').slideUp();
                }
                else if (medicine == 'Ivermectin Pour On'){
                    try{
                        $('#days').val(1);
                    }
                    catch(err){ var ieDebug = 0;}
                    $('#days').slider('disable');
                    $('#daysWrapper').slideUp();
                }
                else if (medicine == 'Oxytet Inj 200'){
                    try{
                        $('#days').val(2);
                    }
                    catch(err){ var ieDebug = 0;}
                    $('#days').slider('disable');
                    $('#daysWrapper').slideUp();
                }
                else if (medicine == 'Oxytet Inj 300'){
                    try{
                        $('#days').val(3);
                    }
                    catch(err){ var ieDebug = 0;}
                    $('#days').slider('disable');
                    $('#daysWrapper').slideUp();
                }
                else{
                    $('#days').slider('enable');
                    $('#daysWrapper').slideDown();
                }
            });

            
            $('#options').change(function(){
                var medicine = $("#medicine").val();
                var option = $("#options").val();
                // Special case for Baytril
                if (medicine == 'Baytril'){
                    if (option == 'Single Injection'){
                        try{
                            $('#days').val(1);
                        }
                        catch(err){ var ieDebug = 0;}
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

            $('#species').change(function(){
                var medicine = $("#medicine").val();
                var species = $("#species").val();
                if (medicine == 'Baytril'){
                    if (species == 'Swine'){
                        $('#options').val('Single Injection');
                        $('#options').selectmenu('refresh');
                        try{
                            $('#days').val(1);
                        }
                        catch(err){ var ieDebug = 0;}
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

            

        } // menuspecialcases

        // MENU FUNCTION CALLS
        hideInitMenu();
        fillMedicineMenu(medicines);
        // The rest depend on which medicine is selected.
        $("#medicine").change(function(){
            var selectedMedicines = getSelectedMedicines(medicines);
            fillSizeMenu(selectedMedicines);
            fillOptionsMenu(selectedMedicines);
            fillSpeciesMenu(selectedMedicines);
        });
        menuSpecialCases();

        // INSTRUCTIONS -----------------------------------------------
        
        // Calculate Instructions on click
        $("#calculate").click(function() {

            // Get form values
            var medicine = $("#medicine").val();
            var containerSize = $('#containerSize').val();
            var days = $('#days').val();
            var species = $('#species').val();
            var numberOfAnimals = $("#numberOfAnimals").val();
            var avgWeight = $("#avgWeight").val();
            var selectedOption = $("#options").val();
            var email = $('#email').val();
            if (email == ''){
            email = window.localStorage.getItem("email");
            }
            else{
                window.localStorage.setItem("email", email);
            }
            var totalWeight = numberOfAnimals * avgWeight;
            
            // Form values displayed
            $(".medicineName").append(medicine);
            $('.containerSize').append(containerSize);
            if (selectedOption){
                $('.option').append('Options: '+selectedOption);
            }
            if (species == null){
                $('.species').append('Consult your veterinarian.');
            }
            else{
                $('.species').append(species);
            }
            $('.days').append(days);
            $('.numberOfAnimals').append(numberOfAnimals);
            $('.avgWeight').append(avgWeight);
            
            var selectedMedicines = getSelectedMedicines(medicines);
            for (i in selectedMedicines){
                if (containerSize == selectedMedicines[i].ProductSize){
                    if (selectedOption == selectedMedicines[i].Options || selectedOption == null){
                        var selectedMedicineName = selectedMedicines[i].ProductName;
                        var selectedContainerSize = selectedMedicines[i].ProductSize
                        var container = selectedMedicines[i].Container;
                        var dose = selectedMedicines[i].Dose;
                        var doseUnit = selectedMedicines[i].DoseUnit;
                        var specialCase = selectedMedicines[i].SpecialCase;
                        var containerAmount = selectedMedicines[i].ContainerAmount;
                        var containerUnit = selectedMedicines[i].ContainerUnit;
                        var amountUse = selectedMedicines[i].AmountUse;

                        // Rx
                        var rx = '';
                        if (selectedMedicines[i].Script.length > 0){
                            $('.rx').append('Prescription needed, consult your veterinarian.')
                            rx = 'Prescription needed, consult your veterinarian.';
                        }

                        var application = selectedMedicines[i].Application;
                        // Oral Water
                        if (application == 'Oral Water'){
                            var totalWaterNeeded = totalWeight / 100; // A gallon of water per 100 pounds.
                            var stock = totalWaterNeeded / 128; // A gallon of stock for every 128 gallons of water.
                            var containersPerGallonOfStock = amountUse;
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
                            var poundsTreatedPerContainer = selectedMedicines[i].AmountUse;
                            var containerUnit = selectedMedicines[i].ContainerUnit;
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
                                        containersPerGallonOfStock = selectedMedicines[i].AmountUse2;
                                        containersPerDay = stock / containersPerGallonOfStock;
                                        totalContainers = Math.ceil(containersPerDay * days);
                                    }
                                }
                            }
                            if (medicine == 'Ivermectin Injection'){
                                if (species == 'Swine'){
                                    poundsTreatedPerContainer = selectedMedicines[i].AmountUse2;
                                    containersPerDay = totalWeight / poundsTreatedPerContainer;
                                    containersPerAnimal = containersPerDay / numberOfAnimals;
                                    amountPerAnimal = containersPerAnimal * containerAmount; // In ml
                                }
                            }
                            if (medicine == 'Baytril'){
                                if (species == 'Swine'){
                                    poundsTreatedPerContainer = selectedMedicines[i].AmountUse2;
                                    containersPerDay = totalWeight / poundsTreatedPerContainer;
                                    totalContainers = Math.ceil(containersPerDay * days);
                                    containersPerAnimal = containersPerDay / numberOfAnimals;
                                    amountPerAnimal = containersPerAnimal * containerAmount; // In ml
                                }
                            }
                        }
                        // Display amounts
                        // Round display amounts
                        var amountPerDay = containersPerDay * containerAmount;

                        containersPerDay = Math.round(containersPerDay * 100) / 100;
                        // amountPerDay = Math.round(amountPerDay * 100) / 100;
                        amountPerAnimal = Math.round(amountPerAnimal * 100) / 100;

                        if (totalContainers == 1){
                            container = container.slice(0,-1);
                            $('.total').append(totalContainers + ' ' + container);
                        }
                        else {
                            $('.total').append(totalContainers + ' ' + container);
                        }

                        if (containersPerDay >= 1){
                            $('.containers').append('Your herd needs '+containersPerDay+' '+container);
                        }
                        else if (containerUnit == 'Gallons'){ // If less than a gallon, give the amount in ounces
                            amountPerDay = Math.round(amountPerDay * 128);
                            $('.containers').append('Your herd needs '+amountPerDay+' oz');
                        }
                        else if (containerUnit == 'Pints'){ // If less than a gallon, give the amount in ounces
                            amountPerDay = Math.round(amountPerDay * 16);
                            $('.containers').append('Your herd needs '+amountPerDay+' oz');
                        }
                        else { // If less than one container, give amount in smaller units
                            amountPerDay = Math.round(amountPerDay * 100) / 100;
                            $('.containers').append('Your herd needs '+amountPerDay+' '+containerUnit);
                        }
                        if (days > 1){
                            $('.containers').append(' of '+medicine+' per day for '+days+' days.');
                        }
                        else{
                            $('.containers').append(' of '+medicine+' for '+days+' day.');
                        }
                        // Topical
                        if (application == 'Pour On'){
                            $('.stock').append('Apply '+amountPerAnimal+' '+containerUnit+' per animal topically as directed.');
                        }
                        // Injection
                        if (application == 'Injection'){
                            $('.stock').append('Inject '+amountPerAnimal+' '+containerUnit+' per animal per day.');
                        }
                        if (application == 'Oral On Feed'){
                            $('.stock').append('Add '+amountPerAnimal+' '+containerUnit+' into the feed of each animal.');
                        }
                        // Special Case
                        if (specialCase == 1){
                            if (medicine == 'Sulfadimethoxine 12.5'){
                                // Day One
                                containersPerGallonOfStock = selectedMedicines[i].AmountUse;
                                containersDayOne = stock / containersPerGallonOfStock;
                                // Day two
                                containersPerGallonOfStock = selectedMedicines[i].AmountUse2;
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
                                if (totalContainers == 1){
                                    $('.total').append('Total Needed: '+totalContainers+ ' Gallon');
                                }
                                else {
                                    $('.total').append('Total Needed: '+totalContainers+ ' Gallons');
                                }
                                $('.containers').empty();
                                $('.containers').append('Your herd needs '+containersPerDay+' '+container);
                                if (days > 1){
                                    $('.containers').append(' of '+medicine+' per day for '+days+' days.');
                                }
                                else{
                                    $('.containers').append(' of '+medicine+' for '+days+' day.');
                                }
                            }
                            if (medicine == 'Gen-Guard Bucket'){
                                $('.total').empty();
                                totalContainers = Math.ceil((containersPerDay * days) / 19); // Give total in gallons
                                $('.total').append('Total Needed: '+totalContainers+ ' buckets'); 
                            }
                            if (medicine == 'Ivermectin Pour On' || medicine == 'Cydectin'){
                                $('.total').empty();
                                if (totalContainers == 1){
                                    $('.total').append('Total Needed: ' + totalContainers + ' Five Liter bottle');
                                }
                                else{
                                    $('.total').append('Total Needed: ' + totalContainers + ' Five Liter bottles');
                                }
                            }
                        }
                    }
                }
            }

            //DEBUG
            // console.log('Form Choices');
            // console.log('Medicine: ' + medicine);
            // console.log('Container Size: ' + containerSize);
            // console.log('Selected option: ' + selectedOption);
            // console.log('Species: ' + species);
            // console.log('Days: ' + days);
            // console.log('Number of animals: ' + numberOfAnimals);
            // console.log('Average weight: ' + avgWeight);
            // console.log('');
            // console.log('Medicine Info')
            // console.log('Selected Medicine Name: ' + selectedMedicineName);
            // if (medicine != selectedMedicineName){
            //     alert('Medicine names don\'t match!');
            // }
            // console.log('Container size: ' + selectedContainerSize);
            // console.log('Application: ' + application);
            // console.log('Pounds treated per container: ' + poundsTreatedPerContainer);
            // console.log('Container amount: ' + containerAmount);
            // console.log('Containers per day: ' + containersPerDay);

            // console.log('ORAL WATER');
            // console.log('Total Water Needed: ' + totalWaterNeeded);
            // console.log('Total Stock Needed: ' + stock);
            // console.log('Containers per animal: ' + amountPerAnimal);
            // console.log('Containers per gal of stock: ' + containersPerGallonOfStock);
            //  .log('Containers per day: ' + containersPerDay);
            // console.log('Total containers: ' + totalContainers);
            
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

            Parse.initialize("EdGILd3A1o6QtEWVOGsVkGdCZ30mGyu0fAdLpJgD", "YFQnZQtz54YTDtau556EetWhVINaN6IdWPIfVYAx"); 
            //Report usage back to Parse.
            var user = new Parse.User();
            user.set({
                "username": email
                , "password": 'genericPassword'
            });
            
            try{
                user.signUp(null, {
                    success: function(user) {
                    },
                    error: function(user, error) {
                    }
                });
            }
            catch(err){var ieDebug = 0;}
            
            var UsageObject = Parse.Object.extend("UsageObject");
            var usageObject = new UsageObject();
            
            usageObject.set({
                "email":email
                , "medicine":medicine
                // , "selectedOption":selectedOption
                , "containerSize":containerSize
                // , "days":days
                , "species":species
                , "numberOfAnimals":numberOfAnimals
                , "avgWeight":avgWeight
                // , "container":container
                // , "dose":dose
                // , "doseUnit":doseUnit
                // , "specialCase":specialCase
                // , "containerAmount":containerAmount
                // , "containerUnit":containerUnit
                , "totalContainers":totalContainers
                // , "stock":null
                // , "amountPerAnimal":null
            });

            // if (application == 'Oral Water'){
            //     usageObject.set({"stock":stock});
            // }
            // else{
            //     usageObject.set({"amountPerAnimal":amountPerAnimal});
            // }

            try{
                usageObject.save(null, {
                  success: function(usageObject) {
                    // The object was saved successfully.
                  },
                  error: function(usageObject, error) {
                    // The save failed.
                    // error is a Parse.Error with an error code and description.
                  }
                });
            }
            catch(err){var ieDebug = 0;}            
            
            $("#clear").click(function() {
                location.reload();
            });

            // Hide Form, Show Instructions
            function showInstructions(){
                $('#form').hide();
                $('#instructions').css('display','block');
            }

            showInstructions();
    
        }); // /calculate
    }); // /getJson
 }); // /doc.ready

// If we switch to Parse to dl medicines.
    // function downloadMedicines(){
    //     Parse.initialize("EdGILd3A1o6QtEWVOGsVkGdCZ30mGyu0fAdLpJgD", "YFQnZQtz54YTDtau556EetWhVINaN6IdWPIfVYAx"); 

    //     var Medicine = Parse.Object.extend("Medicine");
    //     var query = new Parse.Query(Medicine);
    //     query.find({
    //         success: function(results) {
    //             newList = [];
    //             for (i in results){
    //                 medicines.append(results[i].attributes);
    //             }
    //         },
    //         error: function(error) {
    //         }
    //     });

    // }

    // downloadMedicines();
