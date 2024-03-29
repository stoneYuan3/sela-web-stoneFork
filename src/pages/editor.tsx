import ButtonAppBar from "./AppBar";
import Toolbar from '@mui/material/Toolbar';
import { Undo, Redo } from '@mui/icons-material';
import Link from "next/link";

import {NavMain,NavTools, NavBasicTools} from "./components/Nav"
import { useState,useReducer } from "react";


import { PoemView } from "./components/stanzas"

export default function Editor() {

    const [language, setLanguage] = useState("ENG");
    const handleLanguageChange = () => {
      setLanguage((prevLanguage) => (prevLanguage === "ENG" ? "HEB" : "ENG"));
      console.log(language);
    };

    const [selectedButton, setSelectedButton] = useState("default");
    const handleSelectButton = (button) => {
      setSelectedButton(button);
      console.log(selectedButton);
    };

    //changing font size function
    const [fontSize, setFontSize] = useState(16);
    const increaseFontSize = () => {
        setFontSize(prevSize => prevSize + 2);
    };
    const decreaseFontSize = () => {
        setFontSize(prevSize => prevSize - 2);
    };

    //controls preview colour for the change background colour button
    const [colour, setColour] = useState(
        {
            color: {
                r: '255',
                g: '255',
                b: '255',
                a: '1',
            },
        }
    );
    const setNewColour = (newColour) => {
        // setColour(newColour);
        setColour( (prevColour) => ({
                color: {
                    r: newColour.r,
                    g: newColour.g,
                    b: newColour.b,
                    a: newColour.a,
                },
            })
        )
        console.log(colour);
    }
    //
    //need to add the same structure for border and font colour below


    //pickerStatus: also exist under nav.tsx, stanza.tsx and colourPicker.tsx. no longer needed, plan to remove
    const [pickerStatus, setPickerStatus] = useState(false);
    const setNewPickerStatus = (newState) => {
        setPickerStatus(newState);
        console.log(pickerStatus);
    }

    //wordStatus: used to detect whether words are selected under stanzas.tsx
    const [wordStatus, setWordStatus] = useState(false);
    const setNewWordStatus = (newState) => {
        setWordStatus(newState);
        console.log(wordStatus);
    }

    // const poemTest = [
    //     [["A Psalm","of David"]],
    //     [["1 Give", "unto Yahweh", "sons", "You mighty ones", "Give", "unto Yahweh", "glory", "and strength"]],
    //     [["2 Give", "unto Yahweh", "The glory due to", "His name", "Worship", "Yahweh", "In the beauty", "of Holiness"]],
    //     [["3 The voice", "of Yahweh", "[is] over", "the waters", "the God", "of glory", "thunders", "Yahweh [is]", "over", "waters", "many"]],
    //     [["4 The voice", "of Yahweh", "[is] powerful", "The voice", "of Yahweh", "[is full] of majesty"]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],

    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    //     [["5 the voice", "of Yahweh", "breaks", "the cedars", "And yes splinters", "Yahweh", "-", "the cedars", "of lebanon",]],
    // ];
    const poemTest =[
        {
            "stanzaSort": 1,
            "color": "grey",
            "strophes":
                [
                    {
                        "stropheSort": 1,
                        "color": "yellow",
                        "words":
                        [
                            { "hebSort": 198628, "strong": "4210", "heb": "מִזְמ֗וֹר", "eng": "A Psalm", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198629, "strong": "1732", "heb": "מִזְמ֗וֹר", "eng": "of David ", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""}
                        ]
                    },
                    {
                        "stropheSort": 2,
                        "color": "red",
                        "words":
                        [
                            { "hebSort": 198630, "strong": "3051", "heb": "הָב֣וּ", "eng": "1 Give", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198631, "strong": "3068", "heb": "הָב֣וּ", "eng": "unto Yahweh", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198632, "strong": "1121", "heb": "הָב֣וּ", "eng": "sons", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198633, "strong": "410",  "heb": "הָב֣וּ", "eng": "you mighty ones ", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198634, "strong": "3051", "heb": "הָב֣וּ", "eng": "2 Give", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198635, "strong": "3068", "heb": "הָב֣וּ", "eng": "unto Yahweh", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198636, "strong": "3519", "heb": "הָב֣וּ", "eng": "glory", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""},
                            { "hebSort": 198637, "strong": "5797", "heb": "הָב֣וּ", "eng": "and strength", "wordColor": "", "backgroundColor": {r:"255",g:"255",b:"255",a:"1"}, "borderColor": ""}
                        ]
                    }
    
                ]
        },
        {
            "stanzaSort": 2,
            "color": "green",
            "strophes":
                [
                    {
                        "stropheSort": 1,
                        "color": "yellow",
                        "words":
                        [
    
                        ]
                    }
                ]
        }
    ]


    return (
        <div>
            <NavMain 
                onLanguageChange={handleLanguageChange}
                selectedButton={selectedButton}
                onSelectButton={handleSelectButton}
            />
            <NavTools 
                selectedButton={selectedButton} 
                poem={poemTest} 
                fontSize={fontSize} 
                onFontSizeUp={increaseFontSize} 
                onFontSizeDown={decreaseFontSize}
                color={colour.color}
                setNewColour={setNewColour}
                pickerStatus={pickerStatus}
                setPickerStatus={setNewPickerStatus}
                wordStatus={wordStatus}
                setWordStatus={setNewWordStatus}
            />
            {/* <ButtonAppBar /> */}
            <Toolbar className="flex-container">
                <Link href="/">home</Link>
                <button className="flex-items">
                    <Undo onClick={() => console.log("Undo")} />
                </button>
                <button className="flex-items">
                    <Redo onClick={() => console.log("Redo")} />
                </button>
            </Toolbar>

            {/* <PoemView /> */}
            <p>Editor</p>
        </div>
    )
}


