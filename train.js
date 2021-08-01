var BayesClassifier = require('bayes-classifier')
var classifier = new BayesClassifier()
 
var positiveDocuments = [
`It doesn't matter.`,
   `Ykhhykhykhhyhykhy`,
   `pleasant .`,
   `you will understand .`,
   `I don’t know.`,
   `uh huh.`,
   `and`,
   `aha.`,
   `heh.`
]
 
var negativeDocuments = [
`I have 1.6GHz percent on my laptop and 2666MHz RAM`,
  `No. I do not want to select the same dice, so I just replace mine for 2 gigs with a new one for 4, and there will be no sense from 8 gigs of RAM because a 32-bit system sees only 4 gigs. You can of course take stock, but I don’t know.`,
  `The telepathy challenge can be used 3 times for each loss of your planet: spravebidlo:`,
  `imba, you have no idea what, or you bomb their planets, and they have shields there, anti ship systems, etc.`,
  `Incidentally, I'm telling a story about how I could not make friends with a python:
I tried to work with python like a toad
Tried to feed python NPM packages
As a result, the python fed me to itself: spravebidlo:
Since then I haven’t gone to the python in the vallière: pressF1: `,
``
]
 
classifier.addDocuments(positiveDocuments, `positive`)
classifier.addDocuments(negativeDocuments, `negative`)
 
classifier.train()
 
console.log(classifier.classify(`Мне бы хотелось заключить ... мой народ в рабство :xexexe:`)) // "positive"
console.log(classifier.classify(`I don't want to eat there again.`)) // "negative"
console.log(classifier.classify(`The torta is epicly bad.`)) // "negative"
console.log(classifier.classify(`The torta is tasty.`)) // "positive"
 
console.log(classifier.getClassifications(`Мне бы хотелось заключить ... мой народ в рабство :xexexe:`))
/*
 [ { label: 'positive', value: 0.22222222222222224 },
   { label: 'negative', value: 0.11111111111111112 } ]
*/