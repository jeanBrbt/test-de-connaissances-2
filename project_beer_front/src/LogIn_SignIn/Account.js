import React from "react";
import {fetchrequest} from "../utils/resquest";
import {getCookie,eraseCookie,setCookie} from "../utils/cookie";
import {RandomBeerButton}from '../BeerPage/randombeerbutton'

class SignUp extends  React.Component{
    constructor() {
        super();
        this.state= {
            password: "",
            pseudo:"",
            confirmPassword:""
        }

        this.signupFormController=this.signupFormController.bind(this);
        this.inputChange=this.inputChange.bind(this);
    }
    inputChange(event){
        switch (event.target.name){
            case "pseudo":
                this.setState({"pseudo":event.target.value});
                break;
            case "password":
                this.setState({"password":event.target.value});
                break;
            case "confirm_Password":
                this.setState({"confirmPassword":event.target.value});
                break;

            default:
                break;
        }
        event.preventDefault();

    }

    signupFormController(event) {
        console.log(this.state);
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({password: "", confirmPassword: ''});

        } else {
            if (event.target.password !== "" && event.target.pseudo !== "") {

                let url = "http://localhost:3002/signin";
                let init = {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    //make sure to serialize your JSON body
                    body: JSON.stringify({
                        name: this.state.pseudo,
                        password: this.state.password,
                    })
                }
                fetchrequest(url, init).then(c => {
                    console.log(c)
                    c.success?alert('inscription prise en compte'):alert('le pseudo est déja pris');

                });
                this.setState({pseudo: "", password: "", confirmPassword: ""});
            }
        }
    }
    render() {
        return(
            <div className="form-style-5">
                <form onChange={this.inputChange}>
                    <fieldset>
                        <legend>Inscription</legend>
                    <label>
                        pseudo<input type="text" name="pseudo" value={this.state.pseudo} />
                    </label>
                    <label>
                        password <input type="password" name="password" value={this.state.password}/>
                    </label>
                    <label>

                        confirm <input type="password" name="confirm_Password" value={this.state.confirmPassword}/>
                    </label>
                    </fieldset>
                </form>
                <button onClick={this.signupFormController}>inscription</button>

            </div>
        );
    }
}

//------------------------
class LoginOrDisconnect extends  React.Component{
    constructor() {
        super();
        this.state={
            connected:false,
        }
    }
    render() {
        if (!this.props.user_connected) {
            return (<div className="LoginOrDiconnect">
                <LogIn update_user_data={this.props.update_user_data}/>
            </div>)
        }
        else{
            return (<div className="LoginOrDiconnect">
                <Disconnect
                update_user_data={this.props.update_user_data}
                user_pseudo={this.props.user_pseudo}
            />
            </div>
        );
        }
    }
}
class Disconnect extends React.Component{
    constructor() {
        super();

        this.disconectEvent=this.disconectEvent.bind(this);
    }
    disconectEvent(){
        eraseCookie("session");
        this.props.update_user_data({id:0,connected:false,pseudo:""})

    }
    render() {
        return(
            <div className="LoginForm">
                <button onClick={this.disconectEvent}>Déconnexion</button>
            </div>
        )
    }
}
class LogIn extends  React.Component {
    constructor() {
        super();
        this.state = {
            password: "",
            pseudo: "",
        }
        this.LogInFormController = this.LogInFormController.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    inputChange(event) {
        switch (event.target.name) {
            case "pseudo":
                this.setState({"pseudo": event.target.value});
                break;
            case "password":
                this.setState({"password": event.target.value});
                break;
            default:
                break;
        }
        event.preventDefault();

    }

    LogInFormController(event) {
        if (event.target.password !== "" && event.target.pseudo !== "") {
            let url = "http://localhost:3002/login";
            let init = {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.pseudo,
                    password: this.state.password,
                })
            }
            fetchrequest(url, init).then(c => {
                if(c.connected) {
                    console.log({pseudo:c.pseudo,connected:true,id:c.id});
                    this.props.update_user_data({pseudo:c.pseudo,connected:true,id:c.id});
                    let json_str = JSON.stringify(c);
                    document.cookie = "session=" + json_str + "; ";
                    //       this.props.updateState(true);
                }

            });

            this.setState({pseudo: "", password: ""});
        }
    }

    render() {

        return (
            <div className="LoginForm">
                <form onChange={this.inputChange}>
                    <label>
                        <input placeholder="pseudo" type="text" name="pseudo" />
                    </label>
                    <label>
                         <input placeholder="password" type="password" name="password" />
                    </label>
                </form>
                <button onClick={this.LogInFormController}>Connexion</button>

            </div>
        );
    }

}
export {LoginOrDisconnect,SignUp}