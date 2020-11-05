$(document).ready(function(){

  const URLSELECT = "http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/";
  const SELECTS = ['tipologia', 'stato-immobile', 'tipo-generazione', 'tipo-generatore', 'radiatore', 'pareti-esterne','telaio', 'vetro']

  // get bonustemplate and store it into the localstorage
  localStorage.setItem('bonusObj', JSON.stringify(BONUSTEMPLATE))

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
  $('#type-real-estate').on('click', function() {
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

  
  /* 
  save data in local
  and set next page view
  */
  $(document).on('click', '.next[data-access="allowed"]', function(){
    let this_click = $(this);
    let this_fieldset = this_click.closest('fieldset');
    

    nextStep(this_fieldset, this_click);
    this_fieldset.hide().removeClass('my_current_step');
    this_fieldset.next().show().addClass('my_current_step')

  })

  // set previous page view
  $(document).on('click', 'input[name="previous"]', function(){
    let this_click = $(this);
    let this_fieldset = this_click.closest('fieldset');
    this_fieldset.hide().removeClass('my_current_step');
    this_fieldset.prev().show().addClass('my_current_step')
  })
  
  // get the report
  $(document).on('click', 'input[data-elaborate="allowed"]', function(){
    getReport();
  })


});


//  let required =  $('#check-d1-1').closest('div[data-required="true"]')
//  required.siblings(".bottoni").find(".next").prop("disabled", false);

function checkAccess() {
  /* 
  se i campi obbligatori sono tutti compilati
  aggiungi attributo data-access="allowed" al pulsante .next 
  */

  let inputArray = $('.my_current_step .input-control').get();
  let checkboxArray = $('.my_current_step .checkbox-control').get();
  let selectArray = $('.my_current_step .select-control').get();

  let access = true;



  inputArray.forEach(input => {

    let inputId = input.getAttribute('id');
    let validate = validator.element(`#${inputId}`);

    if(!validate) {
      access = false
    }

  });

  checkboxArray.forEach(checkbox => {

    let checkboxId = checkbox.getAttribute('id');
    let validate = validator.element(`#${checkboxId}`);

    if(!validate) {
      access = false
    }

  });

  selectArray.forEach(select => {

    let selectId = select.getAttribute('id');
    let validate = validator.element(`#${selectId}`);
 
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





function nextStep(this_fieldset, this_click) {

  // select an user-type in fieldset 2
  selectUserType(this_click);
  

  let next_fieldset = this_fieldset.next();
  
  //1: save user answers
  saveAnswers()

  //2: set next step
  // setStep(next_fieldset)

}





// select an user-type in fieldset 2: 
// save this reference in localStorage;
// delete unmatched reference in bonusObj
function selectUserType(this_click) {
  let bonusObj = JSON.parse(localStorage.getItem('bonusObj'));
  let userType;

  if(this_click.attr('data-typeuser')) {
    switch (this_click.attr('data-typeuser')) {
      case 'business':
        $('fieldset').remove('.person')
        localStorage.setItem('user-type', 'business')
        delete bonusObj.privato
        localStorage.setItem('bonusObj', JSON.stringify(bonusObj))
        break 

    
      case 'person':
        $('fieldset').remove('.business')
        localStorage.setItem('user-type', 'person')
        delete bonusObj.impresa
        localStorage.setItem('bonusObj', JSON.stringify(bonusObj))
        break
    }
  }
}





function saveAnswers() {
  let bonusObj = JSON.parse(localStorage.getItem('bonusObj'));
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

      // console.log('nameValue: ' + nameValue)
          for (const classe in bonusObj) {
            // console.log('classe: ' + classe + ' - valore: ' + bonusObj[classe])
            for (const option in bonusObj[classe]) {
              // console.log('option: ' + option + ' - valore: ' + bonusObj[classe][option])
              if(typeof(bonusObj[classe][option]) == 'object') {
                if(option == elementName){
                  if(bonusObj[classe][option]['name'] != 'undefined') {
                    // console.log('bonusObj[classe][option]["name"]: ' + bonusObj[classe][option]['name'])
                    bonusObj[classe][option]['name'] = nameValue
                  }else if (bonusObj[classe][option]['cappotto'] != 'undefined') {
                    // console.log('bonusObj[classe][option]["cappotto"]: ' + bonusObj[classe][option]['cappotto'])
                  }
                  
                }else {
                  for (const sub in bonusObj[classe][option]) {
                    // console.log('sub: ' + sub + ' - valore: ' + bonusObj[classe][option][sub])
                    if (sub == elementName) {
                      // console.log('bonusObj[classe][option][sub]["name"]: ' + bonusObj[classe][option][sub]['name'])
                      bonusObj[classe][option][sub]['name'] = nameValue                      
                    }
                  }
                }
              } else if(typeof(bonusObj[classe][option]) != 'object') {
                // console.log('option: ' + option + ' - valore: ' + bonusObj[classe][option])
                if(option == elementName){
                  bonusObj[classe][option] = nameValue
                }
              }
              
            }

          }
      
    });
    
  }
  localStorage.setItem('bonusObj', JSON.stringify(bonusObj))
  console.log(JSON.parse(localStorage.getItem('bonusObj')))
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
      if ($('select[name="paretiEsterne"]').val() != 'none') {
        let paretiEsterneValue = $('select[name="paretiEsterne"]').val()
        $('input[name="external-walls"]').val(paretiEsterneValue)
      }
      if ($('select[name="telaio"]').val() != 'none') {
        let telaioValue = $('select[name="paretiEsterne"]').val()
        $('input[name="frame-type"]').val(telaioValue)
      }
      $('.my_current_step .modal.opened.in .close').click();
      break;

  }

}




// !IMPORTANTE aggiungere lo switch della penultima pagina
function switchSelection(this_click) {
  this_click.on('change',function() {
    if ($(this).val() === 'Stabile condominiale') {
      $('.condominium').show();
      $('.condominium-hide').hide()
      $('.toggle-reverse').removeClass('select-control save-data-array')
      $('.toggle-control').addClass('input-control save-data-array');
    } else {
      $('.condominium').hide();
      $('.condominium-hide').show()
      $('.toggle-reverse').addClass('select-control save-data-array')
      $('.toggle-control').removeClass('input-control save-data-array');
    }
  })
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





function saveButtonValues() {

  // quando vengono premuti bottoni con data-report il valore viene riportato nell'iput hissen della current_page


}





function getReport() {
  // posso ottenere 5 risultati: 
  // esito OK
  // esito KO
  // esito TRAIN
  // esito RIQ
  // esito NOSISM

  // crea stringa "questionario" e la aggiunge al bonusObject

  // popola le variabili
  // leggo oggetto e salvo variabili di interesse

  // sismeicRisk = 
  // checkboxNegative KO a prescindere
  // estraneitàImp se No esito negativo
  // interventisismici

  // esito restituito tramite if/else, 5 casi
  if(x || y){          //negativo
    // se una checkbox negativa
    // OPPURE
    // estraneitaImprenditoria negativa
  }
  else if(x && y && z) {    //esito 2

  }
  else if(x && y && z) {    //esito 1

  }
  else if(x && y && z) {    //train

  }
  else {                    //positivo

  }
} 



