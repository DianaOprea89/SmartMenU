
const mongoose = require('mongoose');

const allergenSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});
// const allergenSchema = new mongoose.Schema({
//     type: String,
//     enum: [
//         '1. Cereale care conțin gluten (grâu, secară, orz, ovăz, grâu spelt, grâu mare, sau hibrizi ai acestora) și produse derivate',
//         '2. Crustacee și produse derivate',
//         '3. Ouă și produse derivate',
//         '4. Pește și produse derivate',
//         '5. Arahide și produse derivate',
//         '6. Soia și produse derivate',
//         '7. Lapte și produse derivate (inclusiv lactoză)',
//         '8. Fructe cu coajă - migdale, alune de pădure, nuci, fistic, nuci macadamia și produse derivate',
//         '9. Țelină și produse derivate',
//         '10. Muștar și produse derivate',
//         '11. Semințe de susan și produse derivate',
//         '12. Dioxid de sulf și sulfiți în concentrații de peste 10 mg/kg sau 10 mg/litru, exprimate în SO2',
//         '13. Lupin și produse derivate',
//         '14. Moluște și produse derivate']
//
// });

const Allergen = mongoose.model('Allergen', allergenSchema);

module.exports = Allergen;
