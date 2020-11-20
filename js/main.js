$(document).ready(function(){

  const URLSELECT = "http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/";
  const SELECTS = ['tipologia', 'stato-immobile', 'tipo-generazione', 'tipo-generatore', 'radiatore', 'pareti-esterne','telaio', 'vetro']

  // copia il template del bonustemplate
  window.bonusOgg = Object.assign({}, BONUSTEMPLATE);
  window.index = []

  // genera l'index dei fieldset
  fieldsetArray = $('fieldset').get()
  getIndex(fieldsetArray)

  // inizializza ed assegna oggetto 
  // dedicato alla tabella di valutazione sismica
  window.seismicValObj;
  getSeismicValObj()

  // inizializza libreria di validazione degli input obbligatori
  $.getScript( "js/validation.js", function( data ) {});

  //popola le select attraverso una chiamata ajax
  populateSelect(URLSELECT, SELECTS)

  // open a modal
  $('.open-modal').on('click', function(){ 
    let this_click = $(this);
    showModal(this_click)
  })

  // copia i dati dai modal agli input target
  $('.modal-dialog .save-modal').on('click', function() {
    let this_click = $(this);
    let parentContainer = '.modal.opened.in .modal-dialog';
    getModalData(this_click, parentContainer)
    saveAnswers()
  })

  // chiudi il modal
  $('.close-modal').on('click', function(){
    $('.close').click();
  })

  // gestire i pop-over
  $('.label-info-cursor').on('click', function(){

    if($(window).length < 480){
      $(this).attr('data-placement', 'bottom');
    } else {
      $(this).attr('data-placement', 'right');
    }

    $(this).popover('toggle');
  })

  // mostra/nascondi select alternative
  //basate sulle scelte degli utenti
  $('[data-switch="true"]').on('click', function() {
    let this_click = $(this);
    switchSelection(this_click)
  })

  // gestisci il numero minimo di risposte
  // per checkbox a scelta multipla
  $('div[data-required="true"] input').on("click", function () {
    let this_click = $(this)
    manageMinimumSelections(this_click)
  })

  // verifica i permessi per procedere al fieldset successivo
  $('.next').on('click', function() {
    let parentContainer = '.my_current_step'
    let access = checkAccess(parentContainer)

    if(access) {
      $('.my_current_step .next').attr('data-access', 'allowed')
    } else {
      $('.my_current_step .next').attr('data-access', 'denied')
    }

  })

  // ottieni la valutazione sismica
  $('[data-function="getValutation"]').on('click', function() {
    getSeismicValutation()
  })

  //imposta l'autocomplete per la ricerca dei luoghi
  $('[data-function="goSearch"]').on('click', function(){

    window.autocomplete = $(this).data('autocomplete')
    window.selector = $(this).data('selector')
    
    window.componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_2: "short_name",
      country: "long_name",
      postal_code: "short_name",
    };


    initAutocomplete()

  })

  // imposta la visulizzazione della mappa
  $('[data-function="goMap"]').on('click', function(){
    let input = $(this).data('autocomplete')
    let inputQuery = $('#' + input).val()

    let mapId = $(this).data('map')

    showMap(inputQuery, mapId)
  })
  
  //salva i dati e passa alla view successiva
  $(document).on('click', '.next[data-access="allowed"]', function(){
    let this_click = $(this);
    let this_fieldset_count = this_click.closest('fieldset').data('count-page');    

    nextStep(this_click, this_fieldset_count);
    console.log(bonusOgg)
  })

  //fai un passo indietro (torna alla view precedente)
  $(document).on('click', 'input[name="previous"]', function(){
    let this_click = $(this);
    let this_fieldset_count = this_click.closest('fieldset').data('count-page');
    
    let prev_fieldset_count = index.filter(item => item < this_fieldset_count)
    $('[data-count-page="' + this_fieldset_count + '"]').hide().removeClass('my_current_step')
    $('[data-count-page="' + prev_fieldset_count[prev_fieldset_count.length - 1] + '"]').show().addClass('my_current_step')
    
    setDynamicContents(prev_fieldset_count)
    setProgressBar(prev_fieldset_count[prev_fieldset_count.length - 1])
  })
  
  // ottieni la valutazione di accesso al bonus
  $(document).on('click', 'input[data-elaborate="allowed"]', function(){
    getReport();
  })

  //imposta i dati dei modal obbligatori, sulla base delle scelte dell'utente
  $(document).on('click', '[name="change-address"]', function() {
    let rifModal = $(this).data('modal')
    setAcquireOnTrue(rifModal)
  })


  $(document).on("keydown", function(e) {
    if(e.which==13 && $('body').hasClass('modal-open')){
      e.preventDefault();
    }
  })
});





function getSeismicValObj() {
  $.ajax({
    type: "GET",
    url: "./data/classificazione-sismica-2020.csv",
    
    success: function (response) {
      seismicValObj = $.csv.toObjects(response);      
    }
  }); 
}





function getIndex(fieldsetArray) {
  index = []
  fieldsetArray.forEach(indexNode => {
    index.push($(indexNode).data('count-page'))
  });
}





function checkAccess(parentContainer) {
  let inputArray = $(parentContainer + ' .input-control').get();
  let checkboxArray = $(parentContainer + ' .checkbox-control').get();
  let selectArray = $(parentContainer + ' .select-control').get();
  let access = true;


  inputArray.forEach(input => {

    let inputName = input.getAttribute('name');
    let validate = validator.element(`[name="${inputName}"]`);

    if(!validate) {
      access = false
    }

  });

  checkboxArray.forEach(checkbox => {
    let checkboxName = checkbox.getAttribute('name');
    let validate = validator.element(`[name="${checkboxName}"]`);

    if(!validate) {
      access = false
    }

  });

  selectArray.forEach(select => {
    let selectName = select.getAttribute('name');
    let validate = validator.element(`[name="${selectName}"]`);

    if(!validate) {
      access = false
    }

  });

  return access

}





function nextStep(this_click, this_fieldset_count) {

  // select an user-type in fieldset 2
  selectUserType(this_click);
  
  // funzione per compilare gli hidden input utili al questionario
  compileHiddenInput(this_click)

  //1: save user answers
  saveAnswers()
  
  let next_fieldset_count = index.filter(item => item > this_fieldset_count)
  $('[data-count-page="' + this_fieldset_count + '"]').hide().removeClass('my_current_step')
  $('[data-count-page="' + next_fieldset_count[0] + '"]').show().addClass('my_current_step')

  setDynamicContents(next_fieldset_count[0])
  setProgressBar(next_fieldset_count[0])

}





function setDynamicContents(fieldset_count){

  let fieldText = $('.dynamic-text');
  let fieldSmallText = $('.head-small-text');
  let userName = bonusOgg.impresa === undefined ? bonusOgg.privato.nome : bonusOgg.impresa.ragioneSociale
  
  switch (fieldset_count) {
    case 2 :
      fieldText.text('Iniziamo!!');
      fieldSmallText.text('(Per la registrazione impiegheremo circa 5 minuti')
      break

    case 3 :
      fieldText.text('Piacere!');
      fieldSmallText.text('(Proseguiamo, impiegheremo circa 5 minuti)');
      break

    case 4 : 
      fieldText.text('Piacere!');
      showMap("Piazza del Quirinale, Rome, Metropolitan City of Rome, Italy", 'map-registered-office', 5)
      break

    case 5 :
      fieldSmallText.text('(Entriamo nel vivo della richiesta, impiegeheremo circa 5 minuti.)');
      fieldText.text('Ciao '+ userName +"!");
      showMap("Piazza del Quirinale, Rome, Metropolitan City of Rome, Italy", 'map-estate', 5)
      break

    case 10 :
      fieldSmallText.text('(Passiamo agli ultimi requisiti, impiegheremo 5 minuti)')
      fieldText.text('Ciao '+ userName +"!");
      let completeAddress = bonusOgg.bonus110.indirizzo + ', ' + bonusOgg.bonus110.citta + ' (' + bonusOgg.bonus110.provincia + ')'
      $('#address_estate_valutation').val(completeAddress)
      $('#city_estate_valutation').val(bonusOgg.bonus110.citta)
      showMap("Piazza del Quirinale, Rome, Metropolitan City of Rome, Italy", 'map-valutation', 5)
      break

    default:
      fieldSmallText.text('(Passiamo agli ultimi requisiti, impiegheremo 5 minuti)')
      fieldText.text('Ciao '+ userName +"!");
      break  
  }
}





function setProgressBar(currentStep) {
  steps = $("fieldset").length; 
  var percentuale = parseFloat(100 / steps) * currentStep;
  percentuale = percentuale.toFixed();
  $(".progress-bar").css("width",percentuale+"%");    
}






function selectUserType(this_click) {
  let bonusObj = window.bonusOgg
  let fieldsetArray = [];
  

  if(this_click.attr('data-typeuser')) {
    switch (this_click.attr('data-typeuser')) {
      case 'business':
        
        fieldsetArray = $('fieldset:not(.person)').get()
        getIndex(fieldsetArray)

        if(window.bonusOgg.impresa === undefined) {window.bonusOgg.impresa = BONUSTEMPLATE.impresa}
        delete window.bonusOgg.privato
        break 

    
      case 'person':
        
        fieldsetArray = $('fieldset:not(.business)').get()
        getIndex(fieldsetArray)

        if(window.bonusOgg.privato === undefined) {window.bonusOgg.privato = BONUSTEMPLATE.privato}
        delete window.bonusOgg.impresa
        break
    }
  }
}





function compileHiddenInput(this_click) {
  if(this_click.attr('name') == 'questionario') {
    $('.my_current_step input[name="questionario"]').attr('data-acquire', false)
    $(this_click).attr('data-acquire', true)
  } else {
    let divParent = this_click.parents('fieldset');
    let inputGroup = divParent.find('div[data-required="true"]');
    let checkedInputArray = $(inputGroup).find('input:checked').get();
    let inputValue = '';
    let valueConcat = '';
    let checkedValueArray = [];
    checkedInputArray.forEach(checked => {
      inputValue = checked.getAttribute('name')
      checkedValueArray.push(inputValue)

    });

    valueConcat = checkedValueArray.join(', ');
    divParent.find('[type="hidden"]').val(valueConcat)
    
  }
}





function saveAnswers() {
  let bonusObj = window.bonusOgg;
  let inputArray = $('.my_current_step input[data-acquire="true"]').get();
  let selectArray = $('.my_current_step select[data-acquire="true"]').get();
  let entriesArray = {'inputArray': inputArray, 'selectArray': selectArray};
  
  for (const elementArray in entriesArray) {

    entriesArray[elementArray].forEach(element => {
      let nameValue;
      let elementName = element.getAttribute('name');      

      // lo switch gestisce i casi in cui i dati provengano da input di tipo diverso:
      // testuali, checkbox, select
      switch (element.getAttribute('type')) { 
        case 'checkbox':

          nameValue = element.checked ? true : false;
          break;

        case 'number':

          nameValue = parseInt($(element).val());
          break;

        default:

          nameValue = $(element).val();
          break;
      }

      for (const classe in bonusObj) {
        for (const option in bonusObj[classe]) {
          if(typeof(bonusObj[classe][option]) == 'object') {
            if(option == elementName ) {                          
                bonusObj[classe][option]['value'] = nameValue              
            } else {
              for (const sub in bonusObj[classe][option]) {
                if (sub == elementName) {
                  bonusObj[classe][option][sub]['value'] = nameValue                      
                }
              }
            }
          } else if(typeof(bonusObj[classe][option]) != 'object') {
            if(option == elementName){
              if (elementName == 'questionario') {
                let question = '"' + $(element).data('question') + '"';
                let answer = question + ': "' + nameValue + '"'; 
                let string = bonusObj[classe][option];
                bonusObj[classe][option] = compileString(question, answer, string)
              } else {
                bonusObj[classe][option] = nameValue
              }
            }
          }
          
        }

      }
      
    });
  }
  
}





function compileString(question, answer, string) {
  let ruleEx = '(' + question + ':\\s"\\w+(,\\s\\w+)*")';
  let rexegg = new RegExp(ruleEx)

  let replacedString = string.replace(rexegg, answer)
  return replacedString
}





function showModal(this_click) {

  let modalName = this_click.data('modal');
  $(`#${modalName}`).modal('show');
  $(`#${modalName}`).addClass('opened')

}





function getModalData(this_click, parentContainer) {
  let this_fieldset_position = this_click.closest('fieldset').data('count-page');
  let access = '';
  switch (this_fieldset_position) {
    case(3):

      let nameValue = $('input[name="nome"]').val()
      let lastnameValue = $('input[name="cognome"]').val()
      
      access = checkAccess(parentContainer)
      if(access) {
        $('input[name="nome-completo"]').val(nameValue + ' ' + lastnameValue);
        $('.my_current_step .modal.opened.in .close').click();
      }      

      break;


    case(4):

      access = checkAccess(parentContainer)

      if(access) {
        let ragioneSociale = $('input[name="ragione-sociale"]').val();
        let piva = $('input[name="p-iva"]').val();
        let sedeLegale = $('input[name="sede-legale"]').val();
        let nomeReferente = $('input[name="nomeReferente"]').val();
        let cognomeReferente = $('input[name="cognomeReferente"]').val();
        let referente = nomeReferente + ' ' + cognomeReferente;
        let email = $('input[name="email-popup"]').val();
        let cellulare = $('input[name="cellulare-popup"]').val();

        if(ragioneSociale != 'none') { $('input[name="ragioneSociale"]').val(ragioneSociale) }
        if(piva != 'none') { $('input[name="piva"]').val(piva) }      
        if(sedeLegale != 'none') { $('input[name="sedeLegale"]').val(sedeLegale) }
        if(nomeReferente != 'none' & cognomeReferente != 'none') { $('input[name="referente"]').val(referente) }
        if(email != 'none') { $('input[name="email"]').val(email) }      
        if(cellulare != 'none') { $('input[name="cellulare"]').val(cellulare) }

        $('.my_current_step .modal.opened.in .close').click();
      }
      
      
      break;

    
    case(5):

      access = checkAccess(parentContainer)

      if (access) {
        let indirizzo = $('input[name="address_real_estate"]').val()
        let tipoGenerazioneValue = $('select[name="tipoGenerazione"]').val()
        let paretiEsterneValue = $('select[name="paretiEsterne"]').val()
        let telaioValue = $('select[name="telaio"]').val()

        if(indirizzo != 'none') { $('input[name="address-real-estate"]').val(indirizzo) }
        if(tipoGenerazioneValue != 'none') { $('input[name="air-conditioner"]').val(tipoGenerazioneValue) }
        if(paretiEsterneValue != 'none') { $('input[name="external-walls"]').val(paretiEsterneValue) }      
        if(telaioValue != 'none') { $('input[name="frame-type"]').val(telaioValue) }

        $('.my_current_step .modal.opened.in .close').click();
      }
      
      break;

    case (10):
      access = checkAccess(parentContainer)

      if (access) {
        let indirizzo = $('input[name="address-estate-valutation"]').val()

        if(indirizzo != 'none') { 
          $('input[name="address_estate_valutation"]').val(indirizzo) 
          $('#city_estate_valutation').val($('#locality_estate_valutation').val())
        }

        $('.my_current_step .modal.opened.in .close').click();
      }
      break

  }

}





function setAcquireOnTrue(rifModal) {
  let acquireFalseArray = $('[name="' + rifModal + '"] [data-acquire="false"]' ).get()
  console.log(acquireFalseArray)
  acquireFalseArray.forEach(acquireFalse => {
    console.log($(acquireFalse))
    $(acquireFalse).attr('data-acquire', true)
  });
}





function switchSelection(this_click) {
  let name = this_click.attr('name');

  switch (name) {
    case 'tipologia':
      this_click.on('change', function() {
        if ($(this).val() === 'Stabile condominiale') {
          $('.condominium').show();
          $('.condominium-hide').hide()
          $('.toggle-reverse').removeClass('select-control')
          $('.toggle-control').addClass('input-control');
        } else {
          $('.condominium').hide();
          $('.condominium-hide').show()
          $('.toggle-reverse').addClass('select-control')
          $('.toggle-control').removeClass('input-control');
        }
      })
      break;
  
    case 'categoria':
      this_click.on('change', function() { 
        let categoria = $(this).val()
        $('select[data-category]').hide()
        $('select[data-category]').parent().hide()
        $('select[data-category]').attr('data-acquire', false)
        $('select[data-category="' + categoria + '"]').parent().show()
        $('select[data-category="' + categoria + '"]').show()
        $('select[data-category="' + categoria + '"]').attr('data-acquire', true)
      })

      break;
  }


  
}





function populateSelect(url, endpoints ){
  endpoints.forEach((endpoint) => {

    $.ajax({

      type: "GET",

      url: url + endpoint,

      success: function (data) {


        for (let element in data._embedded) {

          let selectKey = element;
          let optionsArray = data._embedded[selectKey];

          optionsArray.forEach(option => {
            let thisOption = $("<option></option>");
            thisOption.text(option.name).attr('value', option.name)
            $(`[data-select=${endpoint}]`).append(thisOption)
          });

          break

        };

      },

      error: function(err){
        console.log(err);
      }
    });
  })
}





function manageMinimumSelections(this_click) {
  let divParent = this_click.closest('div[data-required="true"]');     
  divParent.find("input[data-selection='one']").prop("checked", false); 
  
  if(this_click.data('selection') == 'one') {
    divParent.find("input").prop("checked", false);
  }

  this_click.prop("checked", true);
  divParent.siblings(".bottoni").find(".next").prop("disabled", false);
}





function getSeismicValutation() {
  let risk = $('#city_estate_valutation').val()
  let input = $('#result-valutation-input')
  console.log(risk)
  for (let el of seismicValObj){

    if($.trim(el.Denominazione.toLowerCase()) === risk.toLowerCase()){
      input.val(el["Classificazione 2020"])
      break
    } else {
      input.val("Non abbiamo trovato nessun risultato")
      
    }

  }
}





function getReport() {
  // popola le variabili
  // leggo oggetto e salvo variabili di interesse
  bonusObj = window.bonusOgg
  let answersStr = bonusObj.bonus110.questionario;
  var failed = false;
  let tutela = '';
  let intAntisismici = '';
  let intRiqualificazione = '';
  let intTrainati = '';
  let rischioSismico = '';
  let efficientamento = ''
  let catCatastale = '';
  let esito = 'ko'  

  for (let index = 1; index <= 8; index++) {
    const question = "d" + index;
    let rexegg = '';
    
    switch (question) {
      case 'd1':
        ruleEx = '("'+ question +'":\\s"check5")'
        rexegg = new RegExp(ruleEx)
        if(answersStr.match(rexegg) != null) { failed = true }
        break
      
      case 'd2':
        ruleEx = '("'+ question +'":\\s"check8")'
        rexegg = new RegExp(ruleEx)
        if(answersStr.match(rexegg) != null) { failed = true }
        break

      case 'd3':
        ruleEx = '("+ question +":\\s"No")'
        rexegg = new RegExp(ruleEx)
        if(answersStr.match(rexegg) != null) { failed = true }
        break

      case 'd4':
        ruleEx = '("'+ question +'":\\s"check4")'
        rexegg = new RegExp(ruleEx)
        if(answersStr.match(rexegg) != null) { failed = true }
        ruleEx = '("'+ question +'":\\s"check1"?)'
        rexegg = new RegExp(ruleEx)
        intAntisismici = answersStr.match(rexegg) ? true: false;
        ruleEx = '("'+ question +'":\\s"(\\w+,\\s)*check2"?)'
        rexegg = new RegExp(ruleEx)
        intRiqualificazione = answersStr.match(rexegg) ? true: false;
        ruleEx = '("'+ question +'":\\s"(\\w+,\\s)*check3")'
        rexegg = new RegExp(ruleEx)
        intTrainati = answersStr.match(rexegg) ? true: false;
        break

      case 'd5':
        ruleEx = '("'+ question +'":\\s"4")'
        rexegg = new RegExp(ruleEx)
        if(answersStr.match(rexegg) != null) { rischioSismico = true }
        break

      case 'd6':
        ruleEx = '("'+ question +'":\\s"No")'
        rexegg = new RegExp(ruleEx)
        console.log(answersStr.match(rexegg))
        tutela = answersStr.match(rexegg) ? false : true
        break

      case 'd7':
        ruleEx = '("'+ question +'":\\s"No")'
        rexegg = new RegExp(ruleEx)
        console.log(answersStr.match(rexegg))
        efficientamento = answersStr.match(rexegg) ? false : true
        break

      case 'd8':
        ruleEx = '("'+ question +'":\\s"a\\d{1,2}")'
        rexegg = new RegExp(ruleEx)
        console.log(answersStr.match(rexegg))
        catCatastale = answersStr.match(rexegg) ? false : true
        break
    }
  }

  if(intAntisismici && (intRiqualificazione || intTrainati) && rischiosismico) {
    esito = 'nosism'
  } 
  if (intTrainati && !tutela) {
    esito = 'train'
  }
  if (intTrainati && !efficientamento) {
    esito = 'riq'
  } 
  if(!tutela && !efficientamento) {
    esito = 'ok'
  } 
  if (failed) {
    esito = 'ko'
  } 
} 





// Google MAps
function initAutocomplete(mapId){
  //setta l'input per l'autocomplete
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(autocomplete),
      { types: ["geocode"] }
    );

  // riduce i dati in output
  autocomplete.setFields(["address_component"]);

  // aggiunge un listener per i cambiamenti nell'input
  autocomplete.addListener("place_changed", formFiller);

}





function formFiller() {

  const place = autocomplete.getPlace();

  // reset degli input
  for (const component in componentForm) {
    if(document.getElementById(component + selector) != null) {
      document.getElementById(component + selector).value = "";
      document.getElementById(component + selector).disabled = false;
    }      
  }

  for (const component of place.address_components) {
    const addressType = component.types[0];
    if (componentForm[addressType]) {
      const val = component[componentForm[addressType]];
      if(document.getElementById(addressType + selector) != null) {
        document.getElementById(addressType + selector).value = val;
      }
    }
  }
}





function showMap(inputQuery, mapId, zoomlvl = 15){
  map = new google.maps.Map(document.getElementById(mapId), {
    center:  {lat: 	0, lng: 0},
    zoom: zoomlvl,
  });

  const request = {
    query: inputQuery,
    fields: ["name", "geometry"],
  };

  const marker = new google.maps.Marker({
    map: map,
    visible: true,
    anchorPoint: new google.maps.Point(0, -29),
  });

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      marker.setPosition(results[0].geometry.location)
      map.setCenter(results[0].geometry.location);
    }
  });
}
