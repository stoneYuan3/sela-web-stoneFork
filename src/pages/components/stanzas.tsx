import React, { Component } from "react";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  boxesIntersect,
  useSelectionContainer
} from "@air/react-drag-to-select";


interface PoemViewProps {
    poemContent: string[][][];
    mode: string;
    fontSize: number;
    // bgColour: any;
    pickerStatus: boolean;
    wordStatus: boolean;
    setWordStatus: Function;

    // wordArray: [];
    selectedIndexes:number[];
    setSelectedIndexes:Function;
    // updateNewArray: Function;
    // childState: any;

    bgColor_custom: object;
    bgButtonClicked: boolean;
}

export const PoemView: React.FC<PoemViewProps> = ({
    poemContent,
    mode,
    fontSize,
    pickerStatus,
    wordStatus,
    setWordStatus,
    selectedIndexes,
    setSelectedIndexes,

    bgColor_custom,
    bgButtonClicked,
}) => {
    var pickerOn = pickerStatus;
    // var background = bgColour;

    const componentStyle = {
        fontSize: fontSize,
    };

    const [selectionBox, setSelectionBox] = useState<Box>();
    const selectableItems = useRef<Box[]>([]);
    const elementsContainerRef = useRef<HTMLDivElement | null>(null);

    const { DragSelection } = useSelectionContainer({
    //   eventsElement: document.getElementById("root"),
      onSelectionChange: (box) => {
        /**
         * Here we make sure to adjust the box's left and top with the scroll position of the window
         * @see https://github.com/AirLabsTeam/react-drag-to-select/#scrolling
         */
        const scrollAwareBox: Box = {
          ...box,
          top: box.top + window.scrollY,
          left: box.left + window.scrollX
        };
        setSelectionBox(scrollAwareBox);

        //detecting if target is selected & add to a list of selected items
        const indexesToSelect: number[] = [];
        selectableItems.current.forEach((item, index) => {
          if (boxesIntersect(scrollAwareBox, item)) {
            indexesToSelect.push(index);
            console.log(index);
          }
        });
        
        setSelectedIndexes(indexesToSelect);
      },
      onSelectionStart: () => {
        console.log("OnSelectionStart");
        console.log(selectableItems);
      },
      onSelectionEnd: () => console.log("OnSelectionEnd"),
      selectionProps: {
        style: {
          border: "2px dashed purple",
          borderRadius: 4,
          backgroundColor: "brown",
          opacity: 0.5
        }
      },
      isEnabled: true
    });

    useEffect(() => {
        // console.log(elementsContainerRef.current);
        if (elementsContainerRef.current) {
          Array.from(elementsContainerRef.current.children).forEach((para) => {

            Array.from(para.children).forEach((line) => {
                Array.from(line.children).forEach((item) => {
                    // console.log(item);
                    const { left, top, width, height } = item.getBoundingClientRect();
                    selectableItems.current.push({
                      left,
                      top,
                      width,
                      height
                    });
                })
            })

          });
        }
      }, []);

    var poemStructure;

    //from Peter Han
    const get1DIndex = (x: number, y: number, z: number) => {
        let index = 0;
        const numColumns = poemContent[0][0].length;
        const numRows = poemContent[0].length;

        for (let row = 0; row < x; row++) {
            for (let col = 0; col < numRows; col++) {
                index += poemContent[row][col].length;
            }
        }
        for (let col = 0; col < y; col++) {
            index += poemContent[x][col].length;
        }
        index += z;
        // console.log(index);
        return index;
    }
    ///////////////////

    switch (mode) {
        case "structure":
            poemStructure = (
                <>
                    <DragSelection />
                    <div 
                        id="elements-container"
                        className="poemViewPort elements-container" 
                        style={componentStyle}
                        ref={elementsContainerRef}
                    >
                        {
                            poemContent.map(content => (
                                <PoemParagraph
                                    num={content.stanzaSort}
                                    // color={index % 2 === 0 ? "white" : "#EFEFEF"}
                                    color={content.color}
                                >
                                    {content.strophes.map(lineContent => (
                                        <PoemLine 
                                            num={lineContent.stropheSort}
                                        >
                                            {
                                                lineContent.words.map(word => 
                                                    {
                                                        // let keyIndex = get1DIndex(index,lineIndex,wordIndex);
                                                        return(
                                                        <PoemWord
                                                            num={word.hebSort}
                                                            selectedIndexes={selectedIndexes}
                                                            setSelectedIndexes={setSelectedIndexes}
                                                            color={word.wordColor}
                                                            bgColor_default={word.backgroundColor}
                                                            borderColour={word.borderColor}

                                                            bgColor_custom={bgColor_custom}

                                                            text={word.eng}
                                                            wordStatus={wordStatus}
                                                            setWordStatus={setWordStatus}
                                                            bgButtonClicked={bgButtonClicked}
                                                        />
                                                        );
                                                    }
                                                )
                                            }
                                        </PoemLine>
                                    ))}
                                </PoemParagraph>
                            ))
                        }
                    </div>
                </>
            );
            break;
        default:
            poemStructure = (
                <>
                    <DragSelection />
                    <div 
                        id="elements-container"
                        className="poemViewPort elements-container" 
                        style={componentStyle}
                        ref={elementsContainerRef}
                    >
                        {
                            poemContent.map(content => (
                                <PoemParagraph
                                    num={content.stanzaSort}
                                    // color={index % 2 === 0 ? "white" : "#EFEFEF"}
                                    color={content.color}
                                >
                                    {content.strophes.map(lineContent => (
                                        <PoemLine num={lineContent.stropheSort}>
                                            {
                                                lineContent.words.map(word => 
                                                    {
                                                        // let keyIndex = get1DIndex(index,lineIndex,wordIndex);
                                                        return(
                                                            <PoemWord
                                                            num={word.hebSort}
                                                            selectedIndexes={selectedIndexes}
                                                            setSelectedIndexes={setSelectedIndexes}
                                                            color={word.wordColor}
                                                            bgColor_default={word.backgroundColor}
                                                            borderColour={word.borderColor}

                                                            bgColor_custom={bgColor_custom}

                                                            text={word.eng}
                                                            wordStatus={wordStatus}
                                                            setWordStatus={setWordStatus}
                                                            bgButtonClicked={bgButtonClicked}
                                                        />
                                                        );
                                                    }
                                                )
                                            }
                                        </PoemLine>
                                    ))}
                                </PoemParagraph>
                            ))
                        }
                    </div>
                </>
            );
            break;
    }
    return poemStructure;
}

export default PoemView;


interface PoemParagraphProps {
    num: number;
    children: any;
    // paragraphContent: string[][];
    color: string;
    // wordStatus: boolean;
    // setWordStatus: any;
}

export class PoemParagraph extends Component<PoemParagraphProps> {
    render() {
        const { num, children, color } = this.props;
        const componentStyle = {
            backgroundColor: color,
        };
        return (
            <>
                <div 
                    key={num} 
                    className="poemParagraph" 
                    style={componentStyle}
                >
                    {children}
                </div>
            </>
        );
    }
}

interface PoemLineProps {
    num: number;
    children: any;
    // lineContent: string[];
    // wordStatus: boolean;
    // setWordStatus: any;
}

export class PoemLine extends Component<PoemLineProps> {
    render() {
        const { num, children } = this.props;
        return (
            <>
                <div key={num} className="poemLine">
                    {children}
                </div>
            </>
        );
    }
}

interface PoemWordProps {
    color: string;
    bgColor_custom: object;
    borderColour: string;
    text: string;
    wordStatus: boolean;
    setWordStatus: Function;
    bgButtonClicked:boolean;
    bgColor_default:object;
    num: number;
    selectedIndexes:number[];
    setSelectedIndexes: Function
}

export class PoemWord extends Component<PoemWordProps> {

    setWordStatus:Function;
    // updateNewArray:Function;
    constructor(props:any){
        super(props);
        this.setWordStatus=props.setWordStatus.bind(this);
        // this.updateNewArray=props.updateNewArray.bind(this);
        this.state = {
            selected: props.wordStatus,
            bgColor: props.bgColor_default
        };
    }

    state = {
        selected: false,
        bgColor: {},
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
        if (this.state.bgColor !== this.props.bgColor_custom && prevProps.bgButtonClicked != this.props.bgButtonClicked) {
            if(this.state.selected){
                console.log('colour change')
                console.log(this.props.bgButtonClicked);
                this.setState({ bgColor: this.props.bgColor_custom });
                console.log(this.props.bgColor_custom)
            }
        }

        if(this.props.selectedIndexes.includes(this.props.num)){
            if(!this.state.selected){
                this.setState({ selected: true });
                // this.addToArray(this.props.wordArray, this.props.text);
                this.toggleColourTools();
                console.log('reset state based on selectedIndexes')
            }
        }
    }

    addToArray = (array:[], target) => {
        array.push(target);
        // this.updateNewArray(array);
    }
    removeFromArray = (array:[], target) => {
        var removeTarget = array.indexOf(target);
        array.splice(removeTarget, 1);
        console.log(removeTarget);
        // this.updateNewArray(array);
    }

    //used to toggle colour tools when there is no word selected, has nothing to do with word's state
    toggleColourTools = () => {
        if(this.props.selectedIndexes.length>0){
            this.setWordStatus(true);
        }
        else{
            this.setWordStatus(false);
        }
    }

    handleClick = () => {
        var { text, wordStatus } = this.props;
        if(this.state.selected){
            this.setState({ selected: false })
            this.removeFromArray(this.props.selectedIndexes, this.props.num);
            console.log(this.props.selectedIndexes);
            console.log(this.state.selected);
        }
        else{
            this.setState({ selected: true })
            this.addToArray(this.props.selectedIndexes, this.props.num);
        }
        this.toggleColourTools();
    };

    render() {
        const { color, borderColour, text, num, selectedIndexes } = this.props;
        const bgColourValue = `rgba(${this.state.bgColor.r}, ${this.state.bgColor.g}, ${this.state.bgColor.b}, ${this.state.bgColor.a})`

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
                <div 
                    key={num}
                    className='poemWord'
                    data-testid={`grid-cell-${num}`}
                    style={componentStyle} 
                    onClick={this.handleClick}
                >
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

