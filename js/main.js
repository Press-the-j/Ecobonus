$(document).ready(function(){

  const URLSELECT = "http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/";
  const SELECTS = ['tipologia', 'stato-immobile', 'tipo-generazione', 'tipo-generatore', 'radiatore', 'pareti-esterne','telaio', 'vetro']

  // get bonustemplate
  window.bonusOgg = Object.assign({}, BONUSTEMPLATE);

  /* validation init */
  $.getScript( "js/validation.js", function( data ) {});

  /* set options in empty selects */
  populateSelect(URLSELECT, SELECTS)

  // open a modal
  $('.open-modal').on('click', function(){ 
    let this_click = $(this);
    showModal(this_click)
  })

  // get values from modal
  $('.modal-dialog .save-pop-up').on('click', function() {
    let this_click = $(this);
    getModalData(this_click)
  })

  // close a modal
  $('.close-modal').on('click', function(){
    $('.close').click();
  })

  // switchSelection() on click
  $('[data-switch="true"]').on('click', function() {
    let this_click = $(this);
    switchSelection(this_click)
  })

  // manage minimum number of selections
  $('div[data-required="true"] input').on("click", function () {
    let this_click = $(this)
    manageMinimumSelections(this_click)
  })

  /* check permission to nexStep */
  $('.next').on('click', function() {
    checkAccess()
  })

  //save data in local
  //and set next page view
  $(document).on('click', '.next[data-access="allowed"]', function(){
    let this_click = $(this);
    let this_fieldset = this_click.closest('fieldset');    
    let next_fieldset_count = this_click.parents('fieldset').data('count-page') + 1;

    nextStep(this_click, next_fieldset_count);
    this_fieldset.hide().removeClass('my_current_step');
    this_fieldset.next().show().addClass('my_current_step')
  })

  // set previous page view
  $(document).on('click', 'input[name="previous"]', function(){
    let this_click = $(this);
    let this_fieldset = this_click.closest('fieldset');
    let prev_fieldset_count = this_click.parents('fieldset').data('count-page') - 1;
    setDynamicText(prev_fieldset_count)
    this_fieldset.hide().removeClass('my_current_step');
    this_fieldset.prev().show().addClass('my_current_step')
  })
  
  // get the report
  $(document).on('click', 'input[data-elaborate="allowed"]', function(){
    getReport();
  })

});





function checkAccess() {
  /* 
  se i campi obbligatori sono tutti compilati
  aggiungi attributo data-access="allowed" al pulsante .next 
  */

  let inputArray = $('.my_current_step .input-control').get();
  let checkboxArray = $('.my_current_step .checkbox-control').get();
  let selectArray = $('.my_current_step .select-control').get();
  // console.log(checkboxArray)
  // console.log(inputArray)
  // console.log(selectArray)
  let access = true;



  inputArray.forEach(input => {

    let inputId = input.getAttribute('name');
    let validate = validator.element(`[name="${inputId}"]`);
    // console.log(validate)
    if(!validate) {
      access = false
    }

  });

  checkboxArray.forEach(checkbox => {
    let checkboxId = checkbox.getAttribute('id');
    let validate = validator.element(`#${checkboxId}`);
    // console.log(validate)
    if(!validate) {
      access = false
    }

  });

  selectArray.forEach(select => {
    let selectId = select.getAttribute('id');
    let validate = validator.element(`#${selectId}`);
    // console.log(validate)
    if(!validate) {
      access = false
    }

  });



  if(access) {
    $('.next').attr('data-access', 'allowed')
  } else {
    $('.next').attr('data-access', 'denied')
  }

}





function nextStep(this_click, next_fieldset_count) {

  // select an user-type in fieldset 2
  selectUserType(this_click);
  
  // funzione per compilare gli hidden input utili al questionario
  compileHiddenInput(this_click)

  //1: save user answers
  saveAnswers()

  setDynamicText(next_fieldset_count)

}





function setDynamicText(fieldset_count){

  let fieldText = $('.dynamic-text');
  let fieldSmallText = $('.head-small-text');
  let userName = window.bonusOgg.impresa === undefined ? window.bonusOgg.privato.nome : window.bonusOgg.impresa.ragioneSociale
  
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
      break

    case 5 :
      fieldSmallText.text('(Entriamo nel vivo della richiesta. impiegeheremo circa 5 minuti)');
      fieldText.text('Ciao '+ userName +"!");
      break

    default:
      fieldSmallText.text('(Passiamo agli ultimi requisiti, impiegheremo 5 minuti)')
      fieldText.text('Ciao '+ userName +"!");
      break  
  }
}





// select an user-type in fieldset 2: 
// save this reference in localStorage;
// delete unmatched reference in bonusObj
function selectUserType(this_click) {
  let bonusObj = window.bonusOgg

  if(this_click.attr('data-typeuser')) {
    switch (this_click.attr('data-typeuser')) {
      case 'business':
        $('fieldset').remove('.person')
        if(window.bonusOgg.impresa === undefined) {window.bonusOgg.impresa = BONUSTEMPLATE.impresa}
        delete window.bonusOgg.privato
        break 

    
      case 'person':
        $('fieldset').remove('.business')
        if(window.bonusOgg.privato === undefined) {window.bonusOgg.privato = BONUSTEMPLATE.privato}
        delete window.bonusOgg.impresa
        break
    }
  }
}





function compileHiddenInput(this_click) {
  if(this_click.attr('name') == 'questionario') {
    $('input[name="questionario"]').attr('data-acquire', false)
    $(this_click).attr('data-acquire', 'true')
  } else {
    let divParent = this_click.parent();
    let inputGroup = divParent.siblings('div[data-required="true"]');
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

        default:

          nameValue = $(element).val();
          break;
      }

      for (const classe in bonusObj) {
        for (const option in bonusObj[classe]) {
          if(typeof(bonusObj[classe][option]) == 'object') {
            if(option == elementName ) {                            // && bonusObj[classe][option]['value'] != 'undefined'
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
                let question = '"' + $(element).data('question') + '"'; //element.data('question')
                let answer = question + ': "' + nameValue + '"'; //uguale al valore dell'input
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




// !IMPORTANTE aggiungere i modali 's'
function getModalData(this_click) {
  let this_fieldset_position = this_click.closest('fieldset').data('count-page');

  switch (this_fieldset_position) {
    case(3):

      let nameValue = $('input[name="nome"]').val()
      let lastnameValue = $('input[name="cognome"]').val()
      $('input[name="nome-completo"]').val(nameValue + ' ' + lastnameValue);
      $('.my_current_step .modal.opened.in .close').click();

      break;
    
    case(5):

      if ($('select[name="tipoGenerazione"]').val() != 'none') {
        let tipoGenerazioneValue = $('select[name="tipoGenerazione"]').val()
        $('input[name="air-conditioner"]').val(tipoGenerazioneValue);
      }
      if ($('select[name="paretiEsterne"]').val() != 'none') {
        let paretiEsterneValue = $('select[name="paretiEsterne"]').val()
        $('input[name="external-walls"]').val(paretiEsterneValue)
      }
      if ($('select[name="telaio"]').val() != 'none') {
        let telaioValue = $('select[name="telaio"]').val()
        $('input[name="frame-type"]').val(telaioValue)
      }
      $('.my_current_step .modal.opened.in .close').click();
      break;

  }

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


        /* this loop is due because of the API syntax inconsistency*/
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
  let divParent = this_click.closest('div[data-required="true"]');      // assign data-required="true" to div parent
  divParent.find("input[data-selection='one']").prop("checked", false); // assign data-selection="one" for "onlyone" selections 
  this_click.prop("checked", true);
  divParent.siblings(".bottoni").find(".next").prop("disabled", false);
}





function getReport() {
  // popola le variabili
  // leggo oggetto e salvo variabili di interesse
  bonusObj = window.bonusOgg
  let answersStr = bonusObj.bonus110.questionario;
  let failed = '';
  let tutela = '';
  let intAntisismici = '';
  let intRiqualificazione = '';
  let intTrainati = '';
  let rischioSismico = '';
  let efficientamento = ''
  let catCatastale = '';
  

  for (let index = 1; index <= 8; index++) {
    const question = "d" + index;
    let rexegg = '';
    
    

    switch (question) {
      case 'd1':
        ruleEx = '("'+ question +'":\\s"check5")'
        rexegg = new RegExp(ruleEx)
        failed = answersStr.match(rexegg) === null ? 'ok' : 'ko';
        break;
      
      case 'd2':
        ruleEx = '("'+ question +'":\\s"check8")'
        rexegg = new RegExp(ruleEx)
        failed = answersStr.match(rexegg) === null ? 'ok' : 'ko';
        break

      case 'd3':
        ruleEx = '("+ question +":\\s"ko")'
        rexegg = new RegExp(ruleEx)
        failed = answersStr.match(rexegg) === null ? 'ok' : 'ko';
        break

      case 'd4':
        ruleEx = '("'+ question +'":\\s"check4")'
        rexegg = new RegExp(ruleEx)
        failed = answersStr.match(rexegg)
        ruleEx = '("'+ question +'":\\s"check1"?)'
        rexegg = new RegExp(ruleEx)
        intAntisismici = answersStr.match(rexegg) ? 'si': 'no';
        ruleEx = '("'+ question +'":\\s"(\\w+,\\s)*check2"?)'
        rexegg = new RegExp(ruleEx)
        intRiqualificazione = answersStr.match(rexegg) ? 'si': 'no';
        ruleEx = '("'+ question +'":\\s"(\\w+,\\s)*check3")'
        rexegg = new RegExp(ruleEx)
        intTrainati = answersStr.match(rexegg) ? 'si': 'no';
        break

      case 'd5':
        ruleEx = '("'+ question +'":\\s"4")'
        rexegg = new RegExp(ruleEx)
        rischioSismico = answersStr.match(rexegg) ? '4': 'altro';
        break

      case 'd6':
        ruleEx = '("'+ question +'":\\s"no")'
        rexegg = new RegExp(ruleEx)
        tutela = answersStr.match(rexegg) ? 'no' : 'si'
        break

      case 'd7':
        ruleEx = '("'+ question +'":\s"no")'
        rexegg = new RegExp(ruleEx)
        efficientamento = answersStr.match(rexegg) ? 'no' : 'si'
        break

      case 'd8':
        ruleEx = '("'+ question +'":\\s"a\\d{1,2}")'
        rexegg = new RegExp(ruleEx)
        catCatastale = answersStr.match(rexegg) ? 'no' : 'si'
        break
    }
  }
  // 
  // catCatastale

  // esito restituito tramite if/else, 5 casi
  // if(x || y){          //negativo
    // se una checkbox negativa
    // OPPURE
    // estraneitaImprenditoria negativa
  // }
  // else if(x && y && z) {    //esito 2

  // }
  // else if(x && y && z) {    //esito 1

  // }
  // else if(x && y && z) {    //train

  // }
  // else {                    //positivo

  // }
} 

// !IMPORTANT correggere bug userType: al previous() non viene rigenerato l'oggetto mancante



// Google Maps

$('#address_registered_office').on('click', function(){
  let map;
  let mapId ='map-registered-office';
  let searchBox='address-registered-office';

  initMap(mapId);
  initAutocomplete('_registered_office', componentForm, searchBox);
})