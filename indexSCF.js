//const scf= require('./scf.js');
const scf= require('./betterScf.js');


(async () => {
    await scf.initialize('node');

    let results = await scf.getResults(150);

   debugger;

})();