$(document).ready(function(){

  const URLSELECT = "http://ectm-env.eba-wmhap9wv.eu-south-1.elasticbeanstalk.com/";
  const SELECTS = ['tipologia', 'stato-immobile','tipo-generazione','tipo-generatore','radiatore','pareti-esterne','telaio', 'vetro']

  /* validation init */
  $.getScript( "js/validation.js", function( data ) {});

  /* set options in empty selects */
  populateSelect(URLSELECT, SELECTS)

  /* check permission to nexStep */
  $('input:not(.next)').on('click', function() {
    checkAccess()
  })
  
  /* 
  save data in local
  and set next page view
  */
  $(document).on('click', '.next[data-access="allowed"]', function(){
    let this_fieldset = $(this).closest('fieldset');

    nextStep(this_fieldset);
    this_fieldset.hide().removeClass('my_current_step');
    this_fieldset.next().show().addClass('my_current_step')
    

  })
  

  
});




function checkAccess() {
  /* 
  se i campi obbligatori sono tutti compilati
  aggiungi attributo data-access="allowed" al pulsante .next 
  */

  let inputArray = $('fieldset[class="my_current_step"] .input-control').get();
  let checkboxArray = $('fieldset[class="my_current_step"] .checkbox-control').get();
  let selectArray = $('fieldset[class="my_current_step"] .select-control').get();

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






  
function nextStep(this_fieldset) {

  if(this_fieldset.attr('data-typeuser')) {
    console.log($(this))
    switch ($(this)) {
      case 'business':
        $('fieldset').remove('.person')
        break;
    
      case 'person':
        $('fieldset').remove('.business')
        break;
    }
  }

  let next_fieldset = this_fieldset.next();
  
  //1: save user answers
  /* saveAnswers(this_fieldset) */

  //2: set next step
  setStep(next_fieldset)

}






 
/* saveAnswers(this_fieldset) {

} */






function setStep(step) {
  let step_counter = step[0].getAttribute('data-count-page');

  switch (step_counter) {
    case 1:
      
      break;


    case 2:

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

