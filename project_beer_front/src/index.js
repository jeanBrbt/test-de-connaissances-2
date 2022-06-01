import React,{ useState, useEffect,Component } from "react";
import {FilterableBeerTable_V2, getBeerList} from './BeerTable/BeerTableComponent'
import {LoginOrDisconnect,SignUp} from "./LogIn_SignIn/Account"
import {BeerSelector} from "./BeerPage/beerPageComponent";
import {getCookie} from "./utils/cookie";
import {Navbar} from "./header/navbar";

import ReactDOM from "react-dom/client";
import { useLocation } from "react-router-dom";
import { withRouter } from "react-router-dom";

import {
    BrowserRouter,
    Routes,
    Route,
    useParams,
} from "react-router-dom";
import "./index.css";


function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<PageSelector page={"BeerTable"}/>} />
                <Route path="/inscription" element={<PageSelector page={"Signup"}/>} />
                <Route path="beer:id" element={<PageSelector page={"beer"}/>} />
                <Route path="/beer" element = {<PageSelector page={"beer"}/>} />
                <Route path="/login" element = {<LoginOrDisconnect/>} />
            </Routes>
        </BrowserRouter>
    );
}

class PageSelector extends React.Component {
    constructor() {
        super();
        this.state={
            user_pseudo:"",
            user_connected:false,
            user_id:0
        }
        this.updateloginstate= this.updateloginstate.bind(this);
        /*let c =getCookie("session");
        if (c!==null) {
            if (c.connected) this.setState({user_pseudo: c.pseudo, user_connected: true, user_id: c.id});
        }*/
    }

    updateloginstate(data){
        this.setState({user_pseudo:data.pseudo});
        this.setState({user_id:data.id});
        this.setState({user_connected:data.connected});
    }

    componentDidMount(){
        let c =getCookie("session");
        if (c!==null) {
            if (c.connected) this.setState({user_pseudo: c.pseudo, user_connected: true, user_id: c.id});
        }
    }
    render() {
        switch (this.props.page) {
            case "Signup":
                return (
                    <div>
                        <Navbar
                            user_pseudo={this.state.user_pseudo}
                            user_id={this.state.user_id}
                            user_connected={this.state.user_connected}
                            update_user_data={this.updateloginstate}
                        />
                        <SignUp/>
                    </div>
                );
                break;
            case "BeerTable":
                return (
                    <div>
                        <Navbar
                            user_pseudo={this.state.user_pseudo}
                            user_id={this.state.user_id}
                            user_connected={this.state.user_connected}
                            update_user_data={this.updateloginstate}
                        />
                        <FilterableBeerTable_V2
                            user_id={this.state.user_id}
                            user_connected={this.state.user_connected}
                        />
                    </div>
                )
                break;
            case "beer":
                return (
                    <div>
                        <Navbar
                            user_pseudo={this.state.user_pseudo}
                            user_id={this.state.user_id}
                            user_connected={this.state.user_connected}
                            update_user_data={this.updateloginstate}
                        />
                        <BeerSelector
                            user_id={this.state.user_id}
                            user_connected={this.state.user_connected}
                        />
                    </div>
                )
                break;
            default :
                break;
        }
    }
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);





