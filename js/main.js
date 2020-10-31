$(document).ready(function(){

  /* validation initialization */
  $.getScript( "js/validation.js", function( data ) {});

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
  let next_fieldset = this_fieldset.next();
  
  //1: save user answers
  saveAnswers(this_fieldset)

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