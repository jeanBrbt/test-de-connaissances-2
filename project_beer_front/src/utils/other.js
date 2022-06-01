function convertNumbertoRate(rateInNumber){
    switch (rateInNumber){
        case -1:
            return "Inconue";
            break;
        case 0:
            return "à tester";
            break;
        case 1:
            return "Berk";
            break;
        case 2:
            return "Ok";
            break;
        case 3:
            return "J’aime";
            break;
        case 4:
            return "J’adore";
        default:
            return "err";
            break;

    }
}
function makeingredientlist(ingredient){
    let liste =[]
    ingredient.forEach((i)=>{
        liste.push(i.name);
    });
    return Array.from(new Set (liste)).toString();
}

export {convertNumbertoRate,makeingredientlist}