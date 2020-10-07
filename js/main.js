

$(document).ready(function(){
  
  var next_step;
  var current_step;

  //! variabile a cui assegnare il tipo di utente
  var type_user; 

  //! timer della pagina a cui assegno un setInterval
  var myTimer;

  //! variabile in cui salvo le pagine clonate
  var clone_step;
  var sismicIntervention={};

  //! variabili delle progress bar
  var steps
  var current = 1;
  

  $('input').attr('autocomplete', 'off');
  
  $.validator.addMethod('regName' , function(value, element){

    return value == '' || /^[a-zA-Z'-. ]+$/.test(value)
  
   }, "Non sono ammessi caratteri speciali o numeri");
  
   $.validator.addMethod("birth", function (value, element) {
    var dateArr = value.split('-');
    let date = new Date();
    
    let thisYear = date.getFullYear();
    console.log(thisYear);
    console.log(dateArr[0]);
    if (dateArr[0] < 1900 || dateArr[0] > thisYear )
        return false;
    else
        return true;
  });
  
  $.validator.addMethod('regMail' , function(value, element){

    return value == '' || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
  
   }, "Formato mail non valido");

  $.validator.addMethod('regAddress' , function(value, element){

  return value == '' ||/^[a-zA-Z0-9\s,'-.]*$/.test(value)

  }, "Formato mail non valido");
  
  $.validator.addMethod('emptySel' , function(value, element, arg){

    return arg !== value
  
  }, "Scegli un opzione");

  let validator = $('#formComp').validate({
    rules: {
      name:{
        required:true,
        regName:true
      },
      date:{
        required:true,
        birth:true
      },
      genre:{
        emptySel:'none'
      },
      email:{
        required:true,
        regMail:true
      },
      tel_number:{
        required:true,
        number:true,
        minlength:6
      },
      name_popup: {
        required:true,
        regName:true
      },
      surname_popup: {
        required:true,
        regName:true
      },
      company_name:{
        required:true,
        minlength:4,
      },
      pIva:{
        required:true,
        number:true,
        minlength: 11,
        maxlength: 11
      },
      company_name_popup:{
        required:true,
        minlength:4,
      },
      pIva_popup:{
        required:true,
        number:true,
        minlength: 11,
        maxlength: 11
      },
      referent_name_registration:{
        required:true,
        regName:true,
      },
      referent_mail_registration:{
        required:true,
        regMail:true,
      },
      referent_tel_registration:{
        required:true,
        number:true,
        maxlength:11
      },
      company_occupation:{
        emptySel:'none'
      },
      referent_name_registration_popup:{
        required:true,
        regName:true,
      },
      referent_mail_registration_popup:{
        required:true,
        regMail:true,
      },
      referent_tel_registration_popup:{
        required:true,
        number:true,
        maxlength:11
      },
      address_real_estate:{
        required:true,
        regAddress:true
      },
      type_real_estate:{
        required:true,
        emptySel:'none'
      },
      condominium_floors:{
        required:true,
        min:1,
        max:99
      },
      residential_units:{
        required:true,
        min:1,
        max:99
      },
      square_meters:{
        required:true,
        emptySel:'none'
      },
      state_real_estate:{
        required:true,
        emptySel:'none'
      },
      winter_air_conditioning:{
        required: true,
      },
      opaque_casing: {
        required:true,
      },
      transparent_casing: {
        required:true,
      },
      energy_efficiency:{
        required:true,
        emptySel:'none'
      },
      generation_heating:{
        required:true,
        emptySel:'none'
      },
      generator_type:{
        required:true,
        emptySel:'none'
      },
      terminal_type:{
        required:true,
        emptySel:'none'
      },
      external_walls:{
        required:true,
        emptySel:'none'
      },
      frame_walls:{
        required:true,
        emptySel:'none'
      },
      frame_type:{
        required:true,
        emptySel:'none'
      },
      glass_type:{
        required:true,
        emptySel:'none'
      },
      

      
     },
     messages:{
       name:{
         required:'Campo richiesto',
         regName:'Non sono ammessi caratteri speciali o numeri'
       },
       date:{
        required:'Campo richiesto',
        birth:'Data di nascite non valida'
       },
       genre: {
         emptySel:'Scegli un opzione'
       },
       email:{
        required:'Campo richiesto',
        regMail:'Formato Mail non valido'
       },
       tel_number:{
        required:'Campo richiesto',
        number:'Numero di telefono non valido',
        minlength:'Il numerodi telefono deve avere almeno 6 cifre'
       },
       name_popup:{
         required:'Campo richiesto',
         regName:'Non sono ammessi caratteri speciali o numeri'
       },
       surname_popup: {
        required:'Campo richiesto',
        regName:'Non sono ammessi caratteri speciali o numeri'
       },
       company_name:{
         required:'campo richiesto',
         minlength:'La ragione sociale deve contenere almeno 4 lettere'
       },
       pIva:{
        required:'campo richiesto',
        number:'La partita iva deve essere composta solo da numeri',
        minlength: 'La partita iva deve contenere 11 cifre',
        maxlength: 'La partita iva deve contenere 11 cifre'
      },
      company_name_popup:{
        required:'campo richiesto',
        minlength:'La ragione sociale deve contenere almeno 4 lettere'
      },
      pIva_popup:{
        required:'campo richiesto',
        number:'La partita iva deve essere composta solo da numeri',
        minlength: 'La partita iva deve contenere 11 cifre',
        maxlength: 'La partita iva deve contenere 11 cifre'
      },
      referent_name_registration:{
        required:'Campo richiesto',
        regName:'Non sono ammessi caratteri speciali o numeri'
      },
      referent_mail_registration:{
        required:'Campo richiesto',
        regMail:'Formato Mail non valido'
      },
      referent_tel_registration:{
        required:'Campo richiesto',
        number:'Il numero di telefono può contenere al massimo 11 cifre'
      },
      comapny_occupation:{
        emptySel:'Scegli un opzione'
      },
      referent_name_registration_popup:{
        required:'Campo richiesto',
        regName:'Non sono ammessi caratteri speciali o numeri'
      },
      referent_mail_registration_popup:{
        required:'Campo richiesto',
        regMail:'Formato Mail non valido'
      },
      referent_tel_registration_popup:{
        required:'Campo richiesto',
        number:'Il numero di telefono può contenere solo numeri',
        maxlenght:'Il numero di telefono può contenere al massimo 11 cifre'
      },
      address_real_estate:{
        required:'Campo richiesto',
        regAddress:'Non sono ammessi caratteri speciali'
      },
      type_real_estate:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      condominium_floors:{
        required:'Campo richiesto',
        min:'Inserire un numero valido',
        max:'Inserire un numero valido'
      },
      residential_units:{
        required:'Campo richiesto',
        min:'Inserire un numero valido',
        max:'Inserire un numero valido'
      },
      square_meters:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      tate_real_estate:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      winter_air_conditioning:{
        required:'Campo richiesto',
      },
      opaque_casing: {
        required:'Campo richiesto',
      },
      transparent_casing: {
        required:'Campo richiesto',
      },
      energy_efficiency:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      generation_heating:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      generator_type:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      terminal_type:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      external_walls:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      frame_walls:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      frame_type:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
      glass_type:{
        required:'Campo richiesto',
        emptySel:'Scegli un opzione'
      },
     },
     errorPlacement: function(error, element) {
       if(element.is('input')){
         error.insertAfter(element.parents('.row-input'));
       } else if(element.is('select')){
         error.insertAfter(element)
       }
     }
   })
   


    
  //todo bisogna assegnare un errore nel caso l'utente prova ad andare avanti senza accettare la privacy
  $("#privacy").on("change", function () {
    if ($(this).is(":checked")) {
        let btn_next = $(this)
            .closest(".form-group")
            .siblings(".bottoni")
            .children(".next");
        btn_next.prop("disabled", false);
    } else if ($(this).not(":checked")) {
        let btn_next = $(this)
            .closest(".form-group")
            .siblings(".bottoni")
            .children(".next");
        btn_next.prop("disabled", true);
    }
});

    
    
  
    $(".next").on('click',function(e){
      current_step = $(this).closest('fieldset');
      let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
      let control=controlInput(fieldset_count_page);
      console.log(control);
      if(control){
        
        
        if(fieldset_count_page==10){
          checkSismic(fieldset_count_page)
          //let map = 'mapSismic'
          //renderMap(placesAutocompleteSismic, map)
          $('#sismic-intervention-search').val(sismicIntervention.address)
        } else if(fieldset_count_page==5){
          sismicIntervention["address"]=$("#dove").val()
        } /* else if(fieldset_count_page==13 ) {
          console.log('ciao');
          $('.clock').css('display' , 'none');
          clearInterval(myTimer);
        } */

            next_step = $(this).closest("fieldset").next();
            current_step.hide();
            next_step.show();
            setProgressBar(++current);
            $(".progress").css("display", "block");
            //setClock();
            $(".error").text("");
        }
    });

    $(".previous").on("click", function () {
        current_step = $(this).closest("fieldset");
        next_step = $(this).closest("fieldset").prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
    });

    $(".previous-reg").on("click", function () {
        current_step = $(this).closest("fieldset");
        next_step = $(this).closest("fieldset").prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
        console.log(next_step);
        clone_step.forEach((element) => {
            let el_page = element.getAttribute("data-count-page") - 1;
            $("fieldset[data-count-page='" + el_page + "']").after(element);
        });
        
        clone_step = "";
    });
    
    
    
  
    function setProgressBar(curStep){
      steps=$("fieldset").length; 
      var percentuale = parseFloat(100 / steps) * curStep;
      percentuale = percentuale.toFixed();
      $(".progress-bar")
        .css("width",percentuale+"%")
        // .html(percentuale+"%");   
    }

    //! funzione che setta timer
    function setClock(){
      clearInterval(myTimer)
      $(".clock").css("display", "block")
      let timer = 30;
      let clock=$(".clock_second");
      clock.text(timer);

      myTimer=setInterval(function(event){
        timer--;
        if(timer<=9){
          timer = "0" + timer;
        } 
        clock.text(timer)    
        if(timer==0){
          clearInterval(myTimer);
          location.reload();
        }
        
      }, 1000)
    }

    // da richiamare quando metteremo il timer
    function setClock() {
        clearInterval(myTimer);
        $(".clock").css("display", "block");
        let timer = 30;
        let clock = $(".clock_second");
        clock.text(timer);

        myTimer = setInterval(function (event) {
            timer--;
            if (timer <= 9) {
                timer = "0" + timer;
            }
            clock.text(timer);

            if (timer == 0) {
                clearInterval(myTimer);
                location.reload();
            }
        }, 1000);
    }

    //! siamo nel fieldset 2 al momento di scegliere se l'utente è un'impresa o una persona fisica.
    //todo dare la classe type-user ai bottoni che devono essere cliccati dall'utente durante la scelta

    //todo in caso si volesse poi reinserire le pagine rimosse dalla funzione, alla pagina successiva, al bottone per tornare indietro sostituire la classe previous con previous-reg

    $(".type-user").on("click", function () {
        let type = $(this).attr("data-typeUser");
        let current_step = $(this).closest("fieldset");
        //? setta la variabile globale type-user in base alla scelta dell'utente
        type_user = type;

        //? se l'utente è una persona salvo in una variabile i fieldset per i dati dell'impresa e viceversa
        if (type_user === "person") {
            var remove_step = current_step.siblings(".business");
        } else if (type_user === "business") {
            var remove_step = current_step.siblings(".person");
        }
        //? prima li clona con tutti gli handler, trasformando il risultato in un array di elementi, poi li rimuovo dalla pagina
        //*nel caso l'utente torni indietro queste pagine verrano reinserite nel DOM, vedere l'handler legato al click sull'elemento con classe previous-reg
        clone_step = remove_step.clone(true).get();
        remove_step.remove();

        //? applica la stessa logica del next, andando alla pagina successiva, settando il timer, aumentando la barra di progresso
        current_step.hide();
        current_step.next().show();
        //setClock();
        setProgressBar(++current);
    });

    //! questa è una funzione provvisoria per nascondere o mostrare il fieldset 10 in base alla scelta dell'utente nella precedente checkbox
      //* se l'utente checca l'input con classe sismic- intervention-check, la pagina si deve vedere

       function checkSismic(currentStep){
        if($('.sismic-intervention-check').is(':checked')) {
         if(sismicIntervention["removed"]){
          let clone_step=sismicIntervention["clone"]
          console.log(currentStep);
          
          $(`fieldset[data-count-page=${currentStep}]`).after(clone_step);
         }
         
        } else {
          sismicIntervention["removed"]=true
          let remove_step=$('.sismic-intervention').clone(true).get()
          sismicIntervention["clone"]=remove_step[0];
          console.log(sismicIntervention.clone)
          $('.sismic-intervention').remove()         
        }
      }

    function checkSismic(currentStep) {
        if ($(".sismic-intervention-check").is(":checked")) {
            if (sismicIntervention["removed"]) {
                let clone_step = sismicIntervention["clone"];
                console.log(currentStep);

                $(`fieldset[data-count-page=${currentStep}]`).after(clone_step);
            }
        } else {
            sismicIntervention["removed"] = true;
            let remove_step = $(".sismic-intervention").clone(true).get();
            sismicIntervention["clone"] = remove_step[0];
            console.log(sismicIntervention.clone);
            $(".sismic-intervention").remove();
        }
    }

    //!validazione select
    $(".choose-category").on("change", function () {
        let selectedCategory = $(this).val();
        if (selectedCategory !== "none") {
            $(".category-real-estate")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", false);
        } else {
            $(".category-real-estate")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", true);
        }
        $(".sub-category").removeClass("active");
        $(".category-" + selectedCategory).addClass("active");
        $(".category-real-estate-btn").addClass("active");
    });

    //! validazioni checkbox*/
    $(".owner-title input").on("click", function () {
        $(".owner-title input").prop("checked", false);
        $(this).prop("checked", true);
        $(".owner-title")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    });

    $(".category-user input").on("click", function () {
        $(".category-user input").prop("checked", false);
        $(this).prop("checked", true);
        $(".category-user")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    });

    $(".intervention-trainant input").on("click", function () {
        if ($(".none-check").is(":checked") && $(this).hasClass("none-check")) {
            $(".intervention-trainant input").prop("checked", false);
            $(".none-check").prop("checked", true);
        } else if (
            $(".none-check").is(":checked") &&
            !$(this).hasClass("none-check")
        ) {
            $(".none-check").prop("checked", false);
        }
        if ($(".intervention-trainant input:checked").length) {
            $(".intervention-trainant")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", false);
        } else {
            $(".intervention-trainant")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", true);
        }
    });

    //! funzione di controllo per validare gli input e le select in pagina
      //todo dare classe input-control agli input che devono essere controllati, e classe select-control alle select che devono essere controllate

      //todo l'errorBox deve essere fratello di row-input, il label figlio diretto di row-input

      //todo per dirgli che c'è un errore impostare la variabile emptyInput a true
              //!! la funzione ritorna falso, se c'è qualcosa che non va con gli input, e true se è tutto apposto
      function controlInput(countPage){
        //? seleziono il fieldset padre tramite il countPage passato 
        let inputs = $(`fieldset[data-count-page=${countPage}] .input-control`).get()
        let select=$(`fieldset[data-count-page=${countPage}] .select-control`).get()
        let emptyInput=false
        //? controllo gli input all'interno del fieldset 
        inputs.forEach(element => {
          let inputId=element.getAttribute('id')
          let validate=validator.element(`#${inputId}`)
          
          if (!validate){
            
            emptyInput=true
          }
        })
        select.forEach(element => {
          let selectId=element.getAttribute('id')
          console.log(selectId);
          let validate = validator.element(`#${selectId}`)
          
          if(!validate){
            emptyInput=true
          }
         
        });
        if (emptyInput) {
            return false;
        }
        return true;
    }

    
     //! funzione di controllo dei pop-up, che blocca il salvataggio dei dati negli input se non viene selezionato tutto
        //? dare classe popup-control agli input che devono essere controllati all'interno del popup
      
   /*  function controlPopup(popupId){
      let inputs=$(`#${popupId} .popup-control`).get();
      let emptyInput=false;
      inputs.forEach(element => {
        if(element.value.length==0){
          if(element.classList.contains('input-popup-control')){
            var dataError=element.getAttribute('id')
          } else {
            var dataError=element.getAttribute('data-error');
          }
          emptyInput=true
          let errorBox=$(`#${dataError}`).siblings('.error')
          let label=$(`#${dataError}`).siblings('label').text()
          errorBox.text(`${label} deve essere compilato `);
        } 
        })
      if(emptyInput){
        return false
      }
      return true
    } */

    //!funzione per inserire automaticamente i dati dei pop up negli input
      //? dare classe save-pop-up al bottone salva
      //? settare negli input in pagina il data-receive-from uguale all'id dell'input nel pop up di cui salvare i dati
    $(".save-pop-up").on('click', function(e){
      let pop_up=$(this).closest('.modal').attr('id');
      let inputs=$(this).closest('.modal').find('.popup-control').get()
      let selects=$(this).closest('.modal').find('.select-control').get()
      let emptyInput=false
      inputs.forEach(element => {
        let inputId=element.getAttribute('id')
        let validate=validator.element(`#${inputId}`)
        console.log(element);
        if(!validate){
          console.log(element + 'flase');
          emptyInput=true
        }
      })
      selects.forEach(element=>{
        let selectId=element.getAttribute('id')
        console.log(selectId);
        let validate = validator.element(`#${selectId}`)
        console.log(validate);
        if(!validate){
          console.log($(`#${selectId}`).val());
          emptyInput=true
        }
      })

      if(!emptyInput){
        $(this).closest('.modal').find('.close').click()
        let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
        let pop_up_input =$(this).closest('.modal').find('input').get();
        for(let i=0; i<pop_up_input.length; i++){
          let id_pop_up_input=pop_up_input[i].getAttribute('id');
          
          if($(`fieldset[data-count-page=${fieldset_count_page}] input[data-receive-from=${id_pop_up_input}]`).length){
            
            let inputText=pop_up_input[i].value;
            
            $(`input[data-receive-from=${id_pop_up_input}`).val(inputText)
            //? pulissco l'errorBox al riempimento dei dati da popup
           
          }
        }
      }
      /* 
        e.preventDefault()
      //} else {
        $(this).closest('.modal').find('.close').click()
        let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
        let pop_up_input =$(this).closest('.modal').find('input').get();
        console.log(pop_up_input);
        
        
        for(let i=0; i<pop_up_input.length; i++){
          let id_pop_up_input=pop_up_input[i].getAttribute('id');
          
          if($(`fieldset[data-count-page=${fieldset_count_page}] input[data-receive-from=${id_pop_up_input}]`).length){
            
            let inputText=pop_up_input[i].value;
            
            $(`input[data-receive-from=${id_pop_up_input}`).val(inputText)
            //? pulissco l'errorBox al riempimento dei dati da popup
            $(`input[data-receive-from=${id_pop_up_input}`).closest('.row-input').siblings('.error').text('')
          }
        } */
      //}
    });

    //! funzione che scrive il valore della option selezionata all'interno dei pop-up, in input nascosti su cui poi fare i dovuti controlli
    //?dare classe send-val alla select
    //? dare lo stesso id delle select all'input, aggiungendo "-input"
    $(".send-val").on("change", function () {
        $(this).siblings(".error").text("");
        let valSelect = $(this).find("option:selected").text();
        let idSelect = $(this).attr("id");
        let hiddenInput = $(`#${idSelect}-input`).get();
        hiddenInput[0].value = valSelect;
        console.log(hiddenInput[0].value);
        //hiddenInput.val(valSelect)
    });

    //! funzione per inserire e pulire input del nome
    $(".send-val-name").on("keyup", function () {
        let valName = $("#name-popup").val();
        let valSurname = $("#surname-popup").val();
        //let valNameArr=valName.split(' ');
        //let valSurnameArr=valSurname.split(' ');
        let name = valName
            .split(" ")
            .filter((i) => i)
            .join(" ");
        console.log(name);
        let surname = valSurname
            .split(" ")
            .filter((i) => i)
            .join(" ");
        $("#complete-name").val(name + " " + surname);
        console.log($("#complete-name").val());
    });
    //! pulisco gli errorBox quando i campi vengono compilati
    //? quando la select cambia pulisco lo span di errore
    $(".select-control").on("change", function () {
        let errorBox = $(this).siblings(".error");
        if (errorBox.length != 0) {
            errorBox.text("");
        }
    });

   

      //? al change delle input che non si riempiono tramite popup, vadoa cancellare il messaggio di errore
    $('.input-control').not('[type="date"]').on('change', function(){
      var errorBox=$(this).siblings('.error')
      if (errorBox.text().length !=0){
        errorBox.text('')
      }
    })

    //! validazione dell'input di tipo date
    $('#date').on('change', function(){
    let date = new Date();
    let thisYear = date.getFullYear();
    let errorBox = $(this).siblings('.error');
    let dateArr=$('#date').val().split('-');
    if(dateArr[0]<1900 || dateArr[0]>thisYear){
      errorBox.text('Data di nascita non valida')
    } else {
      errorBox.text('')
    }
  })

  /*   //! chiamata ad Algolia per la mappa della sede legale
      //? autocompletamento dell'input di ricerca
      var placesAutocomplete = places({
        appId: 'pl7QEUHBIWGV',
        apiKey: 'bc57f2fb92b40eb8a458abd86c2b3402',
        container: document.querySelector('#address-registered-office ')
      });

      var placesAutocompleteSismic = places({
        appId: 'pl7QEUHBIWGV',
        apiKey: 'bc57f2fb92b40eb8a458abd86c2b3402',
        container: document.querySelector('#address-real-estate')
      });

      

      var placesAutocompleteSismic = places({
        appId: 'pl7QEUHBIWGV',
        apiKey: 'bc57f2fb92b40eb8a458abd86c2b3402',
        container: document.querySelector('#sismic-intervention-search')
      });

      //? autocompleto input della citta e del CAP
      placesAutocomplete.on('change', function resultSelected(e) {
        document.querySelector('#city-registered-office').value = e.suggestion.city || '';
        document.querySelector('#postal-code-registered-office').value = e.suggestion.postcode || '';
      })


    var placesAutocompleteSismic = places({
        appId: "pl7QEUHBIWGV",
        apiKey: "bc57f2fb92b40eb8a458abd86c2b3402",
        container: document.querySelector("#address-real-estate"),
    });

    var placesAutocompleteSismic = places({
        appId: "pl7QEUHBIWGV",
        apiKey: "bc57f2fb92b40eb8a458abd86c2b3402",
        container: document.querySelector("#sismic-intervention-search"),
    });
    //? autocompleto input della citta e del CAP
    placesAutocomplete.on("change", function resultSelected(e) {
        document.querySelector("#city-registered-office").value =
            e.suggestion.city || "";
        document.querySelector("#postal-code-registered-office").value =
            e.suggestion.postcode || "";
    });

    //? all'apertura del pop up della sede legale renderizzo la mappa
    $("#sede").on("click", function () {
        let map = "map-registered-office";
        renderMap(placesAutocomplete, map);
    });

    
    function renderMap(autocomplete, mapToSet){
      //!timeout settato per fixare il caricamento della mappa
      setTimeout(function(){
        
        //?renderizzo la mappa
      var map = L.map(mapToSet, {
        scrollWheelZoom:false,
        zoomControl: false
      });

            function handleOnChange(e) {
                markers.forEach(function (marker, markerIndex) {
                    if (markerIndex === e.suggestionIndex) {
                        markers = [marker];
                        marker.setOpacity(1);
                        findBestZoom();
                    } else {
                        removeMarker(marker);
                    }
                });
            }

            function handleOnClear() {
                map.setView(new L.LatLng(0, 0), 1);
                markers.forEach(removeMarker);
            }

            function handleOnCursorchanged(e) {
                markers.forEach(function (marker, markerIndex) {
                    if (markerIndex === e.suggestionIndex) {
                        marker.setOpacity(1);
                        marker.setZIndexOffset(1000);
                    } else {
                        marker.setZIndexOffset(0);
                        marker.setOpacity(0.5);
                    }
                });
            }

            function addMarker(suggestion) {
                var marker = L.marker(suggestion.latlng, { opacity: 0.4 });
                marker.addTo(map);
                markers.push(marker);
            }

            function removeMarker(marker) {
                map.removeLayer(marker);
            }

            function findBestZoom() {
                var featureGroup = L.featureGroup(markers);
                map.fitBounds(featureGroup.getBounds().pad(0.5), {
                    animate: false,
                });
            }
        }, 1000);
    } */
  
    


    // mostra scelta condominio
    $('#type-real-estate').change(function() {
      console.log($('option').val())
        if ($(this).val() == 'condo') {
          $('.condominium').show();
          $('.toggle-control').addClass('input-control');
          
        } else {
          $('.condominium').hide();
          $('.toggle-control').addClass('input-control');
        }
      });


  });
