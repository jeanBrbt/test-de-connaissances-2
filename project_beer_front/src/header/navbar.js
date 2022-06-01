import React from "react";
import {RandomBeerButton} from "../BeerPage/randombeerbutton";
import {LoginOrDisconnect} from "../LogIn_SignIn/Account";

class Navbar extends  React.Component {

    render() {
        //                    <li><RandomBeerButton/></li>
        return (
            <div className="navbar">
                <ul>
                    <li><a href="http://localhost:3000">Accueil</a></li>
                    <li><a href="http://localhost:3000/beer">j'ai de la chance</a></li>
                    {!this.props.user_connected?<li><a href="http://localhost:3000/inscription">Inscription</a></li>:""}
                    <li className="login_li"><LoginOrDisconnect
                    user_pseudo={this.props.user_pseudo}
                    user_id={this.props.user_id}
                    user_connected={this.props.user_connected}
                    update_user_data={this.props.update_user_data}
                />
                </li>
                    {this.props.user_connected?<li className="login_li_user">{this.props.user_pseudo}</li>:""}


                </ul>
            </div>
        );
    }
}
export {Navbar}