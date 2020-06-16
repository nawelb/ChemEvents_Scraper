const scf= require('./scf.js');

(async () => {
    await scf.initialize('node');

    let results = await scf.getResults(150);

   debugger;

})();