import React from "react";
import {useParams} from "react-router-dom";
import {convertNumbertoRate} from "../utils/other";
import { getFormatedBeerInfo, getRate, removeRate, setRate} from "../utils/resquest";

function BeerSelector(props){
    let { id } = useParams();

    if (id === undefined) {
        return <BeerPage
            beer_id={"random"}
            user_id={props.user_id}
            user_connected={props.user_connected}
        />;
    } else {
        return <BeerPage
            beer_id={id}
            user_id={props.user_id}
            user_connected={props.user_connected}
        />
    }
}

class BeerPage extends React.Component {
    constructor() {
        super();
        this.state = {
            beer: {},
            user_id: -1,
            beer_id:-1
        };
    }
    componentDidUpdate(prevProps) {
        if(this.props.user_id!==prevProps.user_id) {
            this.setState({user_id: this.props.user_id});
        }
        if(this.props.beer_id!==prevProps.beer_id) {

            if (this.props.beer_id === "random") {

                getFormatedBeerInfo('https://api.punkapi.com/v2/beers/random').then(b => {
                    this.setState({beer: b[0]});
                    this.setState({beer_id: b[0].id});
                });
            } else {
                getFormatedBeerInfo('https://api.punkapi.com/v2/beers/' + this.props.beer_id).then(b => {
                    this.setState({beer: b[0]});
                    this.setState({beer_id: b[0].id});
                });

            }
        }

    }
    componentDidMount() {
        if (this.props.beer_id === "random") {
            getFormatedBeerInfo('https://api.punkapi.com/v2/beers/random').then(b => {
                this.setState({beer: b[0]});
                this.setState({beer_id: b[0].id});
            });
        } else {
            getFormatedBeerInfo('https://api.punkapi.com/v2/beers/' + this.props.beer_id).then(b => {
                this.setState({beer: b[0]});
                this.setState({beer_id: b[0].id});
            });
        }
    }
    render() {
        return (
            <div>
                <BeerPageInfo beer={this.state.beer}/>
                <BeerRating
                    beer_id={this.state.beer_id}
                    user_id={this.state.user_id}
                    user_connected={this.props.user_connected}
                />
            </div>
        );

    }
}

class BeerPageInfo extends React.Component {
    constructor() {
        super();
        this.state={
            beer:{},
            ingredients:{}
        }
    }
    componentDidUpdate(prevProps) {
        if(this.props.beer!==prevProps.beer){
            this.setState({beer:this.props.beer,ingredients:this.props.beer.ingredients});
                  }
    }

    render() {
        return (
            <div className="BeerPageInfo">

                <h1>{this.state.beer.name}</h1>
                <div>
                    <h3>Ingrédients</h3>
                    <p>{this.state.ingredients.yeast +this.state.ingredients.hops+this.state.ingredients.malt}</p>


                    <h3>ibu:</h3><p>{this.state.beer.ibu}</p>
                    <h3>description:</h3>
                    <p>{this.state.beer.description}</p>
                    <h5>premier brassage {this.state.beer.first_brewed}</h5>
                    <h5>quantité d’alcool {this.state.beer.abv}</h5>
                    <img src={this.state.beer.image_url} width="100 px" height="300 px"/>

                </div>
            </div>
        );
    }


}
class BeerRating extends React.Component {
    constructor() {
        super();
        this.state = {
            rate: -1,
            user_id: -1,
            beer_id: -1
        }
        this.ratingController = this.ratingController.bind(this);

    }

    componentDidUpdate(prevProp) {
        if (prevProp.user_id !== this.props.user_id) {
            this.setState({user_id: this.props.user_id});
        }
        if (prevProp.beer_id !== this.props.beer_id) {
            this.setState({beer_id:this.props.beer_id});
        }
        if (this.state.user_id!==-1 && this.state.beer_id!==-1){
            getRate(this.props.user_id,this.props.beer_id).then(res=> {
                if (res.success)this.setState({rate:res.rate});
                    }
            );
        }
    }

    ratingController(event) {
        if (event.target.value==-1){
            removeRate(this.props.user_id, this.state.beer_id, event.target.value).then(message => {
                if (message.success) {
                    this.setState({rate: event.target.value});
                    console.log("done");
                }
            });
        }
        else {
            setRate(this.props.user_id, this.state.beer_id, event.target.value).then(message => {
                if (message.success) {
                    this.setState({rate: event.target.value});
                    console.log("done");
                }
            });
        }


    }
    render() {
        if (this.props.user_connected) {
            return (<div className="BeerRating">
                <p>votre évaluation actuelle :<span> {convertNumbertoRate( this.state.rate)} </span> </p>
                changer votre évaluation pour :
                <select name="rateform"  onChange={this.ratingController} >
                <option value="-1">{convertNumbertoRate(-1)}</option>
                <option value="0">{convertNumbertoRate(0)}</option>
                <option value="1">{convertNumbertoRate(1)}</option>
                <option value="2">{convertNumbertoRate(2)}</option>
                <option value="3">{convertNumbertoRate(3)}</option>
                <option value="4">{convertNumbertoRate(4)}</option>
            </select>
            </div>);
        }
    }
}
export {BeerSelector}