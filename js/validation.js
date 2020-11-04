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

window.validator = $('#formComp').validate({
  rules: {
    'checkPrivacy':{
      required:true,
    },
    'nome-completo':{
      required:true,
      regName:true
    },
    'data-nascita':{
      required:true,
      birth:true
    },
    'sesso':{
      emptySel:'none'
    },
    'email':{
      required:true,
      regMail:true
    },
    'cellulare':{
      required:true,
      number:true,
      minlength:6
    },
    'nome': {
      required:true,
      regName:true
    },
    'cognome': {
      required:true,
      regName:true
    },
    'ragione_sociale':{
      required:true,
      minlength:4,
    },
    'pIva':{
      required:true,
      number:true,
      minlength: 11,
      maxlength: 11
    },
    'sede':{
      required: true,
      regAddress: true
    },
    'company_name_popup':{
      required:true,
      minlength:4,
    },
    'pIva_popup':{
      required:true,
      number:true,
      minlength: 11,
      maxlength: 11
    },
    'postal_code':{
      required:true,
      number:true,
      maxlength:5,
    },
    'locality':{
      required:true,
    },
    'street_number':{
      required:true,
    },
    'route':{
      required:true,
      regAddress:true
    },
    /* referent_name_registration:{
      required:true,
      regName:true,
    }, */
    'referent_mail_registration':{
      required:true,
      regMail:true,
    },
    'referent_tel_registration':{
      required:true,
      number:true,
      maxlength:11
    },
    'company_occupation':{
      emptySel:'none'
    },
    'referent_name_registration_popup':{
      required:true,
      regName:true,
    },
    'referent_mail_registration_popup':{
      required:true,
      regMail:true,
    },
    'referent_tel_registration_popup':{
      required:true,
      number:true,
      maxlength:11
    },
    // 'address_real_estate':{
    //   required:true,
    //   regAddress:true
    // },
    'tipologia':{
      required:true,
      emptySel:'none'
    },
    'province':{
      required:true,
    },
    'piani-condominio':{
      required:true
      ,
      min:1,
      max:99
    },
    'unità-condominio':{
      required:true,
      min:1,
      max:99
    },
    'superficie':{
      required:true,
      emptySel:'none'
    },
    'statoImmobile':{
      required:true,
      emptySel:'none'
    },
    'tipoGeneratore':{
      required: true,
    },
    'paretiEsterne': {
      required:true,
    },
    'telaio': {
      required:true,
    },
    'efficienza_energetica':{
      required:true,
      emptySel:'none'
    },
    'generation_heating':{
      required:true,
      emptySel:'none'
    },
    'generator_type':{
      required:true,
      emptySel:'none'
    },
    'terminal_type':{
      required:true,
      emptySel:'none'
    },
    'external_walls':{
      required:true,
      emptySel:'none'
    },
    'frame_walls':{
      required:true,
      emptySel:'none'
    },
    'frame_type':{
      required:true,
      emptySel:'none'
    },
    'glass_type':{
      required:true,
      emptySel:'none'
    },
    

    
  },
  messages:{
    'checkPrivacy':{
      required:'Devi accettare la privacy prima di continuare!',
    },
    'nome':{
      required:'Campo richiesto',
      regName:'Non sono ammessi caratteri speciali o numeri'
    },
    'data-nascita':{
      required:'Campo richiesto',
      birth:'Data di nascite non valida'
    },
    'sesso': {
      emptySel:'Scegli un opzione'
    },
    'email':{
      required:'Campo richiesto',
      regMail:'Formato Mail non valido'
    },
    'cellulare':{
      required:'Campo richiesto',
      number:'Numero di telefono non valido',
      minlength:'Il numerodi telefono deve avere almeno 6 cifre'
    },
    'name_popup':{
      required:'Campo richiesto',
      regName:'Non sono ammessi caratteri speciali o numeri'
    },
    'surname_popup': {
      required:'Campo richiesto',
      regName:'Non sono ammessi caratteri speciali o numeri'
    },
    'ragione_sociale':{
      required:'campo richiesto',
      minlength:'La ragione sociale deve contenere almeno 4 lettere'
    },
    'pIva':{
      required:'campo richiesto',
      number:'La partita iva deve essere composta solo da numeri',
      minlength: 'La partita iva deve contenere 11 cifre',
      maxlength: 'La partita iva deve contenere 11 cifre'
    },
    'sede':{
      required:'campo richiesto',
      regAddress:'Non sono ammessi caratteri speciali o numeri'
    },
    'company_name_popup':{
      required:'campo richiesto',
      minlength:'La ragione sociale deve contenere almeno 4 lettere'
    },
    'pIva_popup':{
      required:'campo richiesto',
      number:'La partita iva deve essere composta solo da numeri',
      minlength: 'La partita iva deve contenere 11 cifre',
      maxlength: 'La partita iva deve contenere 11 cifre'
    },
    'postal_code':{
      required:'campo richiesto',
      number:'La partita iva deve essere composta solo da numeri',
      minlength: 'Il codice postale può contenere al massimo 5 cifre',
    },
    'locality':{
      required:'campo richiesto',
    },
    'street_number':{
      required:'campo richiesto',
    },
    'route':{
      required:'campo richiesto',
      regAddress:"L'indirizzo non può contenere caratteri speciali"
    },
    'province':{
      required:'campo richiesto',
    },
    'comapny_occupation':{
      emptySel:'Scegli un opzione'
    },
    'referent_name_registration_popup':{
      required:'Campo richiesto',
      regName:'Non sono ammessi caratteri speciali o numeri'
    },
    'referent_mail_registration_popup':{
      required:'Campo richiesto',
      regMail:'Formato Mail non valido'
    },
    'referent_tel_registration_popup':{
      required:'Campo richiesto',
      number:'Il numero di telefono può contenere solo numeri',
      maxlenght:'Il numero di telefono può contenere al massimo 11 cifre'
    },
    'address_real_estate':{
      required:'Campo richiesto',
      regAddress:'Non sono ammessi caratteri speciali'
    },
    'tipologia':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'piani-condominio':{
      required:'Campo richiesto',
      min:'Inserire un numero valido',
      max:'Inserire un numero valido'
    },
    'unità-condominio':{
      required:'Campo richiesto',
      min:'Inserire un numero valido',
      max:'Inserire un numero valido'
    },
    'superficie':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'statoImmobile':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'tipoGenerazione':{
      required:'Campo richiesto',
    },
    'paretiEsterne': {
      required:'Campo richiesto',
    },
    'telaio': {
      required:'Campo richiesto',
    },
    'efficienza_energetica':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'generation_heating':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'generator_type':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'terminal_type':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'external_walls':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'frame_walls':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'frame_type':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
    'glass_type':{
      required:'Campo richiesto',
      emptySel:'Scegli un opzione'
    },
  },
  errorPlacement: function(error, element) {
    if(element.is('input')){
      element.hasClass('checkbox-control') ?
        error.insertAfter(element.closest('.switch-wrapper')) :
        error.insertAfter(element.parents('.row-input'));
    } else if(element.is('select')){
      error.insertAfter(element);
    }
  }
 })


