import React, { Component } from "react";

interface PoemViewProps {
    poemContent: string[][][];
    mode: string;
    fontSize: number;
    bgColour: any;
    pickerStatus: boolean;
    wordStatus: boolean;
    setWordStatus: Function;

    wordArray: [];
    updateNewArray:Function;
    childState:any;

    colour_Bg:object;
    bgButtonClicked:boolean;
    // wordArrayAdd: Function;
}

export class PoemView extends Component<PoemViewProps> {
    constructor(props: PoemViewProps) {
        super(props);
        this.containerRef = React.createRef();
        this.state = {
            dragging: false,
            selectedWords: [],
        };
    }

    handleMouseDown = () => {
        this.setState({ dragging: true });
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('mousemove', this.handleMouseMove);
    };

    handleMouseUp = () => {
        this.setState({ dragging: false });
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
    };

    handleMouseMove = (event) => {

        console.log('moveing')

        const { dragging } = this.state;
        if (!dragging) return;
    
        // Obtain the bounding rectangle of the container
        const containerBounds = this.containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - containerBounds.left;
        const mouseY = event.clientY - containerBounds.top;
    
        // Iterate over all PoemWord components and check if they are within the drag area
        const selectedWords = [];
        const poemWords = document.getElementsByClassName('poemWord');
        for (let i = 0; i < poemWords.length; i++) {
            const word = poemWords[i];
            const wordBounds = word.getBoundingClientRect();
            const wordX = wordBounds.left - containerBounds.left + wordBounds.width / 2;
            const wordY = wordBounds.top - containerBounds.top + wordBounds.height / 2;
    
            if (
                wordX >= 0 && wordY >= 0 &&
                wordX <= containerBounds.width && wordY <= containerBounds.height &&
                Math.abs(mouseX - wordX) <= wordBounds.width / 2 && Math.abs(mouseY - wordY) <= wordBounds.height / 2
            ) {
                console.log(selectedWords)
                // If the PoemWord is within the drag area, add its text content to the selectedWords array
                selectedWords.push(word.textContent);
                // Update the selection state of the PoemWord component
                const poemWord = word.querySelector('.poemWord');
                if (poemWord) {
                    poemWord.classList.add('selected');
                }
            } else {
                // If the PoemWord is not within the drag area, remove its selection state
                const poemWord = word.querySelector('.poemWord');
                if (poemWord) {
                    poemWord.classList.remove('selected');
                }
            }
        }
    
        // Update the state to reflect the selected words
        this.setState({ selectedWords });
    };
    

    render() {
        const { poemContent, mode, fontSize, bgColour, pickerStatus, wordStatus, setWordStatus, wordArray, updateNewArray, colour_Bg, bgButtonClicked} = this.props;

        return (
            <div className="poemViewPort" style={{ fontSize }}>
                <div className="poemViewWrapper" ref={this.containerRef} onMouseDown={this.handleMouseDown}>
                    {
                        poemContent.map((content, index) => (
                            <PoemParagraph key={index} color={index % 2 === 0 ? "white" : "#EFEFEF"}>
                                {content.map((lineContent, index) => (
                                    <PoemLine key={index}>
                                        {
                                            lineContent.map((word,wordIndex) => (
                                                <PoemWord 
                                                    key={wordIndex} 
                                                    color="black" 
                                                    backgroundColor={colour_Bg} 
                                                    borderColour="grey" 
                                                    text={word} 
                                                    wordStatus={wordStatus} 
                                                    setWordStatus={setWordStatus} 
                                                    wordArray={wordArray}
                                                    updateNewArray={updateNewArray}
                                                    bgButtonClicked={bgButtonClicked}
                                                    selected={this.state.selectedWords.includes(word)}
                                                />
                                            ))
                                        }
                                    </PoemLine>
                                ))}
                            </PoemParagraph>
                        ))
                    }
                </div>
            </div>
        );
    }
}



interface PoemParagraphProps {
    key: number;
    children: any;
    // paragraphContent: string[][];
    color: string;
    // wordStatus: boolean;
    // setWordStatus: any;
}

export class PoemParagraph extends Component<PoemParagraphProps> {
    render() {
        const { key, children, color } = this.props;
        const componentStyle = {
            backgroundColor: color,
        };
        return (
            <>
                <div key={key} className="poemParagraph" style={componentStyle}>
                    {children}
                </div>
            </>
        );
    }
}

interface PoemLineProps {
    key: number;
    children: any;
    // lineContent: string[];
    // wordStatus: boolean;
    // setWordStatus: any;
}

export class PoemLine extends Component<PoemLineProps> {
    render() {
        const { key, children } = this.props;
        return (
            <>
                <div key={key} className="poemLine">
                    {children}
                </div>
            </>
        );
    }
}

interface PoemWordProps {
    color: string;
    backgroundColor: object;
    borderColour: string;
    text: string;
    wordStatus: boolean;
    setWordStatus: Function;
    wordArray: [];
    updateNewArray: Function;
    // wordArrayAdd: Function;
    bgButtonClicked:boolean;
}

export class PoemWord extends Component<PoemWordProps> {

    setWordStatus:Function;
    updateNewArray:Function;
    // wordArrayAdd;
    constructor(props:any){
        super(props);
        this.setWordStatus=props.setWordStatus.bind(this);
        this.updateNewArray=props.updateNewArray.bind(this);
        this.state = {
            selected: props.wordStatus,
            colour_Bg: props.backgroundColor
        };
    }

    state = {
        selected: false,
        colour_Bg: {},
    };

    componentDidUpdate(prevProps) {
        // Update the internal state when the prop changes
        //to prevent selecting everything when clicking, but ensures that everything is deselected when clear all is clicked in Nav
        if (prevProps.wordStatus == true && this.props.wordStatus==false) {
            this.setState({
              selected: this.props.wordStatus,
            });
        }
        // if the colour of this word's state is different from backgroundColour AND picker button is clicked
        //ensures that colour changes only when the picker button is clicked
        if (this.state.colour_Bg !== this.props.backgroundColor && prevProps.bgButtonClicked != this.props.bgButtonClicked) {
            if(this.state.selected){
                console.log('colour change')
                console.log(this.props.bgButtonClicked);
                this.setState({ colour_Bg: this.props.backgroundColor });
                console.log(this.props.backgroundColor)
            }
        }
        //consider this structure:
            //if( this local bg != props.backgroundColour && bucket button is clicked){
            //  change colour    
            //}
    }

    addToArray = (array:[], target) => {
        array.push(target);
        this.updateNewArray(array);
    }
    removeFromArray = (array:[], target) => {
        var removeTarget = array.indexOf(target);
        array.splice(removeTarget, 1);
        console.log(removeTarget);
        this.updateNewArray(array);
    }

    handleClick = () => {
        var { text, wordStatus } = this.props;
        if(this.state.selected){
            this.setState({ selected: false })
            this.removeFromArray(this.props.wordArray, this.props.text);
            // console.log("removed "+this.props.text);
        }
        else{
            this.setState({ selected: true })
            this.addToArray(this.props.wordArray, this.props.text);
            // console.log("added "+this.props.text);
        }
        // console.log(this.props.wordArray);
        // console.log("arr len: "+this.props.wordArray.length);
        if(this.props.wordArray.length>0){
            this.setWordStatus(true);
        }
        else{
            this.setWordStatus(false);
        }
    };

    render() {
        const { color, borderColour, text } = this.props;
        
        const bgColourValue = `rgba(${this.state.colour_Bg.r}, ${this.state.colour_Bg.g}, ${this.state.colour_Bg.b}, ${this.state.colour_Bg.a})`
        const componentStyle = {
            color: color,
            backgroundColor: bgColourValue,
            border: '3px solid ' + borderColour,
            padding: '0.25rem 1rem',
            borderRadius: '0.5rem',
            width: 'fit-content',
        };

        return (
            <>
                <div className="poemWord" style={componentStyle} onClick={this.handleClick}>
                    <p
                        style={this.state.selected ? { backgroundColor: 'rgba(0,0,0,0.25)' } : { backgroundColor: 'rgba(0,0,0,0)' }}
                    >
                        {text}
                    </p>
                </div>
            </>
        );
    }
}

