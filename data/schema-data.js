const BONUSTEMPLATE = {
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
        "name" : "string",
      },        
      "pianiCondominio": {
        "name": "string"
      },
      "unitaCondominio": {
        "name": "string"
      }
    },
    "superficie" : "123",
    "statoImmobile" : {
      "name" : "string"
    },
    "climatizzazione" : {
      "tipoGenerazione" : {
        "name" : "string"
      },
      "tipoGeneratore" : {
        "name" : "string"
      },
      "radiatore" : {
        "name" : "string"
      }
    },
    "involucroOpaco" : {
      "paretiEsterne" : {
        "name" : "string"
      },
      "cappotto" : {
        'name': "string"
      }
    },
    "involucroTrasp" : {
      "telaio" : {
        "name" : "string"
      },
      "vetro" : {
        "name" : "string"
      }
    },
    "efficienzaEnergetica" : "string",
    "categoriaCatastale" : "string",
    "questionario" : '"d1": "value", "d2": "value", "d3": "value", "d4": "value", "d5": "value", "d6": "value", "d7": "value", "d8": "value"',
    "esito" : "string"
  }
}


  