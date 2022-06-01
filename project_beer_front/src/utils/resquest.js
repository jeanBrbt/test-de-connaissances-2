async function getRate(id_user,id_beer) {
    let url="http://localhost:3002/getrate";
    let init = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        //make sure to serialize your JSON body
        body: JSON.stringify({
            user_id: id_user,
            beer_id: id_beer
        })
    };
    let res = await fetch(url, init);
    let data = await res.json();
    return data;
}
//----------------------

async function removeRate(id_user,id_beer,rate) {
    let url="http://localhost:3002/removerate";
    let init = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            beer_id: id_beer,
            user_id:id_user,
            rate:rate,

        })
    }
    let res = await fetch(url, init);
    let data = await res.json();
    return data;
}
//-------------------------------
async function setRate(id_user,id_beer,rate) {
    let url="http://localhost:3002/setrate";
    let init = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            beer_id: id_beer,
            user_id:id_user,
            rate:rate,

        })
    }
    let res = await fetch(url, init);
    let data = await res.json();
    return data;
}
//===============================
async function getBeersWithRate(id_user,rate) {
    let url="http://localhost:3002/getbeerswithrate";
    let init = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        //make sure to serialize your JSON body
        body: JSON.stringify({
            user_id: id_user,
            rate: rate
        })
    };

    let res = await fetch(url, init);
    let data = await res.json();
    return data;
}

async function fetchrequest(url,init) {
    let res=await fetch(url,init);
    let data= await res.json();
    return data;
}
async function getFormatedBeerList(url,connected,user_id) {
    let res = await fetch(url);
    let data = await res.json();
    let FormatedData = [];
    for (let i in data) {
        FormatedData.push(
            {
                id: data[i].id,
                name: data[i].name,
                ingredients: {
                    malt: [],
                    hops: [],
                    yeast: data[i].ingredients.yeast,
                },
                user_rate:"",
                ibu: data[i].ibu
            }
        );
        data[i].ingredients.hops.forEach(n => {
            if (FormatedData[i].ingredients.hops.indexOf(n.name) === -1) {
                FormatedData[i].ingredients.hops.push(n.name);
            }
        });
        data[i].ingredients.malt.forEach(n => {
            if (FormatedData[i].ingredients.malt.indexOf(n.name) === -1) {
                FormatedData[i].ingredients.malt.push(n.name);
            }
        });
        if (connected) {
            let tmp=await getRate(user_id,data[i].id);
            FormatedData[i].user_rate= await tmp.rate;
        }
    }
    //sort name of ingredient
    FormatedData.forEach(beer=>{
        beer.ingredients.malt.sort(function (a, b) {
            return a.localeCompare(b);
        });
    })
    FormatedData.forEach(beer=>{
        beer.ingredients.hops.sort(function (a, b) {
            return a.localeCompare(b);
        });
    })
    return FormatedData;
}

async function getFormatedBeerInfo(url) {
    let res = await fetch(url);
    let data = await res.json();
    let FormatedData = [];
    for (let i in data) {
        FormatedData.push(
            {
                id: data[i].id,
                name: data[i].name,
                ingredients: {
                    malt: [],
                    hops: [],
                    yeast: data[i].ingredients.yeast,
                },
                user_rate:"",
                ibu: data[i].ibu,
                abv:data[i].abv,
                image_url:data[i].image_url,
                first_brewed:data[i].first_brewed,
                description:data[i].description,
            }
        );
        data[i].ingredients.hops.forEach(n => {
            if (FormatedData[i].ingredients.hops.indexOf(n.name) === -1) {
                FormatedData[i].ingredients.hops.push(n.name);
            }
        });
        data[i].ingredients.malt.forEach(n => {
            if (FormatedData[i].ingredients.malt.indexOf(n.name) === -1) {
                FormatedData[i].ingredients.malt.push(n.name);
            }
        });
    }
    //sort name of ingredient
    FormatedData.forEach(beer=>{
        beer.ingredients.malt.sort(function (a, b) {
            return a.localeCompare(b);
        });
    })
    FormatedData.forEach(beer=>{
        beer.ingredients.hops.sort(function (a, b) {
            return a.localeCompare(b);
        });
    })
    return FormatedData;
}

export {removeRate,setRate,getRate,getBeersWithRate,fetchrequest,getFormatedBeerList,getFormatedBeerInfo}