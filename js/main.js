$(document).ready(function(){

  const URLSELECT = "http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/";
  const SELECTS = ['tipologia', 'stato-immobile', 'tipo-generazione', 'tipo-generatore', 'radiatore', 'pareti-esterne','telaio', 'vetro']

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
  $('input:not(.next)').on('click', function() {
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
  saveAnswers(this_fieldset)

  //2: set next step
  setStep(next_fieldset)

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






 
function saveAnswers(this_fieldset) {
  let this_fieldset_position = this_fieldset.data('count-page')
  console.log(this_fieldset_position)
  // loop e prendi i dati
  let inputArray = $('.my_current_step .save-data').get();
  let selectArray = $('.my_current_step select .save-data').get();
  let entriesArray = {'inputArray': inputArray, 'selectArray': selectArray}

  console.log(inputArray)
  console.log(selectArray)

  switch(this_fieldset_position) {

    case(1): 
      // setto il nome da ottenere
      let marketingName = "marketing-check";
      // avvio la funzione di loop
      let nameValue = getValueByName(entriesArray, marketingName);
      // passo il valore al local storage
      localStorage.setItem('marketingCheck', nameValue)
      console.log(localStorage.getItem('marketingCheck'))
      break
    
    case(3):


      break
  }



} 

function getValueByName(entriesArray, name) {
  let value;

  for (const elementArray in entriesArray) {
    entriesArray[elementArray].forEach(element => {

      let elementId = element.getAttribute('name')
      switch (element.getAttribute('type')) {
        case 'text':
          if (elementId == name) {
            let nameValue = element.val()
            console.log(nameValue)
            value = nameValue
          }
          break;

        case 'checkbox':

          if (elementId == name) {
            let nameValue = element.checked ? true : false;
            value = nameValue
          }

          break;
      }
      

    });
  }

  return value
}



function showModal(this_click) {

  let modalName = this_click.data('modal');
  $(`#${modalName}`).modal('show');
  $(`#${modalName}`).addClass('opened')

}

function getModalData(this_click) {
  let this_fieldset_position = this_click.closest('fieldset').data('count-page');
  let inputArray = $('.my_current_step .modal-content .save-data').get();
  let selectArray = $('.my_current_step .modal-content select .save-data').get();
  let entriesArray = {'inputArray': inputArray, 'selectArray': selectArray}

  switch (this_fieldset_position) {
    case(3):
      let inputName = 'name_popup'
      let inputLastname = 'surname_popup'
      let nameValue = getValueByName(entriesArray, inputName)
      let lastnameValue = getValueByName(entriesArray, inputLastname)

      $('input[name="nome"]').val(nameValue);
      $('input[name="cognome"]').val(lastnameValue);
      break;
  
    default:
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