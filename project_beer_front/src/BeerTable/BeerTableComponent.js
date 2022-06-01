import React,{ useState, useEffect,Component } from "react";
import {getRate,getBeersWithRate,getFormatedBeerList} from "../utils/resquest"
import {convertNumbertoRate} from "../utils/other";


 async function getBeerList(url) {
    let res=await fetch(url);
    let data= await res.json();
    return data;
}

class FilterableBeerTable_V2 extends React.Component {
    constructor() {
        super();
        this.state={
            request:'https://api.punkapi.com/v2/beers?',
            Beerlist:[],
        };
        this.handleresquestchange=this.handleresquestchange.bind(this);
        this.sortby=this.sortby.bind(this);

    }
    componentDidMount() {
        console.log("utilisateur did mount",this.props.user_id)
        getFormatedBeerList(this.state.request,this.props.user_connected,this.props.user_id).then(beers=>{
            this.setState({Beerlist:beers});

        });
    }
    componentDidUpdate(prevProps) {
        console.log("prev",prevProps);
        if(prevProps.user_id!==this.props.user_id){
            console.log("update",this.props.user_id);
           getFormatedBeerList(this.state.request,this.props.user_connected,this.props.user_id).then(beers=>{
                this.setState({Beerlist:beers});

            });
       }
    }

    handleresquestchange(param){
        console.log("param after test", param);
        getFormatedBeerList(this.state.request+param,this.props.user_connected,this.props.user_id).then(beers=>{
            this.setState({Beerlist:beers});
            console.log("requete",this.state.request+param);
            console.log("aprés nouvelle requette",this.state.Beerlist);
        });

    }
    sortby(type){
        let Objecttosort=this.state.Beerlist;
        console.log("objecttosort",Objecttosort);
        console.log("trier par :",type);
        switch (type){

            case "Beer_name":
                Objecttosort.sort((a, b) => a.name.localeCompare(b.name));
                break;

            case "hops_name":
                    Objecttosort.sort(function (a, b) {
                        return a.ingredients.hops.toString().localeCompare(b.ingredients.hops.toString());
                    });
                break;

            case "malt_name":
                Objecttosort.sort(function (a, b) {
                        return a.ingredients.malt.toString().localeCompare(b.ingredients.malt.toString());
                });
                break;

            case "yeast_name":
                Objecttosort.sort(function (a, b) {
                    return a.ingredients.yeast.localeCompare(b.ingredients.yeast);
                });
                break;
            case "ibu":
                Objecttosort.sort(function(a, b){return a.ibu - b.ibu})
                break;
            case "rate":
                console.log("ratee");
                Objecttosort.sort(function(b,a){return a.user_rate - b.user_rate})
                break;
            default:
                break;
        }
        console.log("objet trié",Objecttosort);
        this.setState({Beerlist:Objecttosort});

    }
    render() {
        return (

            <div>
                <SearchBar_V2
                    request={this.state.request}
                    newrequest={this.handleresquestchange}
                    sortby={this.sortby}
                    user_connected={this.props.user_connected}
                />
                <BeerTable_V2
                    beers={this.state.Beerlist}
                    user_connected={this.props.user_connected}/>

            </div>
        );

    }

}



class SearchBar_V2 extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            name_form:"",
            hops_form:"",
            yeast_form:"",
            malt_form:"",
            rate_form:"",
            ibu_form:"",
            ibu_grtOrlwr_form:">"
        }
      //  this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSortChange=this.handleSortChange.bind(this);
        this.handleSubmitWithButton=this.handleSubmitWithButton.bind(this);
        this.inputform=this.inputform.bind(this);

    }
    inputform(event){
        switch (event.target.name){
            case "name":
                this.setState({"name_form":event.target.value});
                break;
            case "hops":
                this.setState({"hops_form":event.target.value});
                break;
            case "yeast":
                this.setState({"yeast_form":event.target.value});
                break;
            case "malt":
                this.setState({"malt_form":event.target.value});
                break;
            case "grtOrlwr":
                this.setState({ibu_grtOrlwr_form:event.target.value});
                break;
            case "ibu":
                this.setState({ibu_form:event.target.value});
                break;
            default:
                break;
        }
        if (this.props.user_connected){
            if(event.target.name==="rate")this.setState({"rate_form":event.target.value});
        }
        console.log(this.state);
        event.preventDefault();
    }

    async handleSubmitWithButton(event) {
        let param = "";
        let nb_param = 0;
        if (this.state.name_form !== "") {
            if (nb_param) param += "&";
            nb_param++;
            param += "beer_name=" + this.state.name_form;
        }
        if (this.state.yeast_form !== "") {
            if (nb_param) param += "&";
            nb_param++;
            param += "yeast=" + this.state.yeast_form;
        }
        if (this.state.hops_form !== "") {
            if (nb_param) param += "&";
            nb_param++;
            param += "hops=" + this.state.hops_form;
        }
        if (this.state.malt_form!== "") {
            if (nb_param) param += "&";
            nb_param++;
            param += "malt=" + this.state.malt_form;
        }
        if (this.state.ibu_form!== "") {
            if (nb_param) param += "&";
            nb_param++;
            param+="ibu_";
            if(this.state.ibu_grtOrlwr_form===">"){
                param += "gt=";
            }else{
                param+="lt=";
            }
            param+=this.state.ibu_form;
        }

        if(this.state.rate_form){
            if (nb_param) param += "&";
            nb_param++;
            param += "ids=";
            let res = await getBeersWithRate(1,this.state.rate_form);
            if (res.beersId.length) {

                for (let i in res.beersId) {
                    if (i > 0) param += '|';
                    param += await res.beersId[i].beer_id;
                }
            }
        }

        this.props.newrequest(param);
        event.preventDefault();

    }

    handleSortChange(event){
        this.props.sortby(event.target.value);
        console.log("trie moi par ",event.target.value);
        event.preventDefault()
    }
    render() {
        const connected_form=<select name="rate" >
            <option value="null">évaluation</option>
            <option value="0">à tester</option>
            <option value="1">Berk</option>
            <option value="2">Ok</option>
            <option value="3">J’aime</option>
            <option value="4">J’adore</option>
        </select>;

            return (
                <div className="SearchBar">
                    <form  onChange={this.inputform}>
                        <p className="title">Barre de recherche</p>
                        <p className="subtitle"> utliser les champ ci dessous pour faire une recherche (ils peuvent rester vide)</p>
                        <input type="text" name="name" placeholder="nom d'une biére"/>
                        <input type="text" name="yeast" placeholder="levure"/>
                        <input type="text" name="hops" placeholder="houblon"/>
                        <input type="text" name="malt" placeholder="malt"/>
                        <select name="grtOrlwr">
                            <option value=">">ibu supérieur à: </option>
                            <option value="<">ibu inférieur à: </option>
                        </select>
                        <input type="text" name="ibu" placeholder="ibu"/>
                        {this.props.user_connected?connected_form:""}
                    </form>
                    <button onClick={this.handleSubmitWithButton}>lancer la recherche</button>
                    <div className="sort">
                    <p>et trier par: </p>
                    <select name="sort" onChange={this.handleSortChange}>
                        <option value="Beer_name">nom de biére</option>
                        <option value="hops_name">nom du Houblon</option>
                        <option value="yeast_name">nom de la levure</option>
                        <option value="malt_name">nom du malt</option>
                        <option value="ibu">IBU</option>
                        {this.props.user_connected?<option value="rate">avis</option>:""}
                    </select>
                    </div>
                </div>

            );
    }
}
class BeerTable_V2 extends React.Component {
    render() {
        console.log("Beer Table",this.props.beers);
        const rate= this.props.user_connected? <th rowSpan="2">évaluation</th>:"";

        const rows = [];
        this.props.beers.forEach((beer) => {
            rows.push(
                <BeerRow_V2
                    Beer={beer}
                    key={beer.name}
                    user_connected={this.props.user_connected}/>
            );
        });
        return (
            <table className="BeerTable">
                <thead>
                <tr>
                    <th rowSpan="2">Nom</th>
                    <th colSpan="3">Ingrédient</th>
                    <th rowSpan="2">IBU</th>
                    {rate}
                </tr>
                <tr>
                    <th>houblon</th><th>malt</th><th>levure</th>
                </tr>
                </thead>

                <tbody>{rows}</tbody>
            </table>
        );
    }
}
class BeerRow_V2 extends React.Component {
    render() {
        const beer = this.props.Beer;
        const beerate=(this.props.user_connected)?<td>{convertNumbertoRate(beer.user_rate)}</td>:"";
         return (
                <tr>
                    <td><a href={"http://localhost:3000/beer"+beer.id}>{beer.name}</a></td>
                    <td>{beer.ingredients.hops.toString()}</td>
                    <td>{beer.ingredients.malt.toString()}</td>
                    <td>{beer.ingredients.yeast}</td>
                    <td>{beer.ibu}</td>
                    {beerate}
                </tr>

            );

    }
}


export {FilterableBeerTable_V2,getBeerList}