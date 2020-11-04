$(document).ready(function(){

  const URLSELECT = "http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/";
  const SELECTS = ['tipologia', 'stato-immobile', 'tipo-generazione', 'tipo-generatore', 'radiatore', 'pareti-esterne','telaio', 'vetro']

  // !IMPORTANTE: implementare caricando il template direttamente da un file json
  var bonusTemplate = {
    "impresa" : {
      "ragioneSociale" : "string",
      "piva" : "string",
      "indirizzo" : "string",
      "citta" : "string",
      "cap" : "string",
      "provincia" : "string",
      "stato" : "string",
      "email" : "string",
      "cellulare" : "string",
      "marketingCheck" : false
     },
    "privato" : {
      "nome" : "Max",
      "cognome" : "Branca",
      "sesso" : "UOMO",
      "email" : "aaa@aa.it",
      "cellulare" : "212121",
      "marketingCheck" : false
    },
    "bonus110" : {
      "indirizzo" : "indirizzo",
      "citta" : "citta",
      "provincia" : "prov",
      "tipologia" : {
        "name" : "Villa plurifamiliare"
      },
      "superficie" : "123",
      "statoImmobile" : {
        "name" : "Nuovo/ In costruzione"
      },
      "climatizzazione" : {
        "tipoGenerazione" : {
          "name" : "Impianto centralizzato"
        },
        "tipoGeneratore" : {
          "name" : "Caldaie tradizionali"
        },
        "radiatore" : {
          "name" : "Ventilconvettore"
        }
      },
      "involucroOpaco" : {
        "paretiEsterne" : {
          "name" : "Parete a cassa vuota con mattoni forati"
        },
        "cappotto" : true
      },
      "involucroTrasp" : {
        "telaio" : {
          "name" : "Legno"
        },
        "vetro" : {
          "name" : "Vetro singolo"
        }
      },
      "efficienzaEnergetica" : "eff",
      "categoriaCatastale" : "cat",
      "questionario" : "\"d1\": \"check2\", \"d2\": \"check2\",\"d3\": \"Si\",\"d4\": \"check1, check2\",\"d5\": 4,\"d5bis\": \"Si\",\"d6\": \"No\"",
      "esito" : "OK"
    }
  }
  localStorage.setItem('bonusObj', JSON.stringify(bonusTemplate))

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
  

  
});





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





// select an user-type in fieldset 2 and save this reference in localStorage
function selectUserType(this_click) {
  let userType;

  if(this_click.attr('data-typeuser')) {
    switch (this_click.attr('data-typeuser')) {
      case 'business':
        $('fieldset').remove('.person')
        localStorage.setItem('user-type', 'business')
        break 

    
      case 'person':
        $('fieldset').remove('.business')
        localStorage.setItem('user-type', 'person')
        break
    }
  }
}





function saveAnswers() {
  let bonusObj = JSON.parse(localStorage.getItem('bonusObj'));
  let inputArray = $('.my_current_step input[data-acquire="true"]').get();
  let selectArray = $('.my_current_step select[data-acquire="true"]').get();
  let entriesArray = {'inputArray': inputArray, 'selectArray': selectArray};
  
  console.log(inputArray)
  console.log(selectArray)
  for (const elementArray in entriesArray) {

    entriesArray[elementArray].forEach(element => {

      let nameValue;
      let elementName = element.getAttribute('name');      
      console.log(elementName)
      // lo switch gestisce i casi che i dati provengano da input di tipo diverso:
      // testuali, checkbox, select
      switch (element.getAttribute('type')) {
        
        case 'checkbox':

          nameValue = element.checked ? true : false;
          for (const classe in bonusObj) {
            for (const option in bonusObj[classe]) {
              if(option == elementName) {
                // inserire if/else typeof option === 'object'
                bonusObj[classe][option] = nameValue
              }
              
            }
              
          }
          break;

        default:

          nameValue = $(element).val();
          for (const classe in bonusObj) {
            for (const option in bonusObj[classe]) {
              if(option == elementName) {
                // inserire if/else typeof option === 'object'
                bonusObj[classe][option] = nameValue
              }
              
            }

          }
          break;

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





function getModalData(this_click) {
  let this_fieldset_position = this_click.closest('fieldset').data('count-page');

  switch (this_fieldset_position) {
    case(3):

      let nameValue = $('input[name="nome"]').val()
      let lastnameValue = $('input[name="cognome"]').val()
      $('input[name="nome-completo"]').val(nameValue + ' ' + lastnameValue);
      $('.my_current_step .close').click();

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
      $('.my_current_step .close').click();
      break;

  }

}






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





function setStep(step) {
  let step_counter = step[0].getAttribute('data-count-page');

  switch (step_counter) {
    case 1:
      
      break;


    case 2:
    // verificare che tutti i fieldset siano settati
    // indipendentemente dall'user-type scelto in precedenza
    // se si giunge da previouStep()
      break;


    case 3:
  
      break;


    case 4:
    
      break;


    case 5:
  
      break;


    case 6:
    
      break;


    case 7:
    
      break;


    case 8:
  
      break;


    case 9:
    
      break;

      
    case 10:
  
      break;


    case 11:

      break;


    case 12:
    
      break;

      
    case 13:
  
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





 //? validazione select
//  $(".choose-category").on("change", function () {
//   // prende il valore della select
//   let selectedCategory = $(this).val();
  
//   // abilitiamo o disabilitiamo la subcategory (seconda select)
//   if (selectedCategory !== "none") {
//       $(".category-real-estate")
//           .siblings(".bottoni")
//           .find(".next")
//           .prop("disabled", false);
//   } else {
//       $(".category-real-estate")
//           .siblings(".bottoni")
//           .find(".next")
//           .prop("disabled", true);
//   }

//   // attributo standard per eliminare la seconda select
//   $(".sub-category").removeClass("active");
//   $(".sub-category select").removeClass("selected-category save-data-array group-save modal-single-check");
  
//   // mostra la select solo quando avviene il change su una scelta consona
//   $(".category-" + selectedCategory).addClass("active");
//   $(".category-" + selectedCategory + " select").addClass("selected-category save-data-array group-save modal-single-check");
// })