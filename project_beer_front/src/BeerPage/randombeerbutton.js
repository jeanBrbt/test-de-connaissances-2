import React from "react" ;
class RandomBeerButton extends React.Component{
    constructor(props) {
        super(props);
        this.randomButtonEvent=this.randomButtonEvent.bind(this);
    }
    randomButtonEvent(){
        window.location.href = "http://localhost:3000/beer";
    }

    render() {
        return(
            <button onClick={this.randomButtonEvent}>j’ai de la chance</button>

        );
    }
}
export {RandomBeerButton}