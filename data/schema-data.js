const BONUSTEMPLATE = {
  "impresa" : {
    "referente": "string",
    "ragioneSociale" : "string",
    "piva" : "string",
    "indirizzoImp" : "string",
    "cittaImp" : "string",
    "capImp" : "string",
    "provinciaImp" : "string",
    "statoImp" : "string",
    "email" : "string",
    "cellulare" : "string",
    "mercato": "string",
    "marketingCheck" : false
   },
  "privato" : {
    "nome" : "string",
    "cognome" : "string",
    "sesso" : "string",
    "email" : "string",
    "cellulare" : "string",
    "marketingCheck" : false
  },
  "bonus110" : {
    "indirizzo" : "string",
    "citta" : "string",
    "provincia" : "string",
    "tipologiaAbitativa" : {
      "tipologia": {
        "value" : "string",
      },        
      "pianiCondominio": {
        "value": 0
      },
      "unitaCondominio": {
        "value": 0
      }
    },
    "superficie" : "string",
    "statoImmobile" : {
      "value" : "string"
    },
    "climatizzazione" : {
      "tipoGenerazione" : {
        "value" : "string"
      },
      "tipoGeneratore" : {
        "value" : "string"
      },
      "radiatore" : {
        "value" : "string"
      }
    },
    "involucroOpaco" : {
      "paretiEsterne" : {
        "value" : "string"
      },
      "cappotto" : {
        'value': false
      }
    },
    "involucroTrasp" : {
      "telaio" : {
        "value" : "string"
      },
      "vetro" : {
        "value" : "string"
      }
    },
    "efficienzaEnergetica" : "string",
    "categoriaCatastale" : "string",
    "questionario" : '"d1": "value", "d2": "value", "d3": "value", "d4": "value", "d5": "value", "d6": "value", "d7": "value", "d8": "value"',
    "esito" : "string"
  }
}


  