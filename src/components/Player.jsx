import { useState } from "react";

export default function Player({ initialName, symbol, isActive, onChangeName }) {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ currentPlayerName, setCurrentPlayerName ] = useState(initialName);

    function handleEditClick() {
        setIsEditing(editing => !editing);
        
        if (isEditing) {
            onChangeName(symbol, currentPlayerName);
        }
    }

    function handleNameChange(event) {
        setCurrentPlayerName(event.target.value);
    }

    return (
        <li className={isActive ? "active" : undefined}>
            <span className="player">
                {isEditing && (<input className="player-input" type="text" required value={currentPlayerName} onChange={handleNameChange} />)}
                {!isEditing && (<span className="player-name">{currentPlayerName}</span>)}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
        </li>
    );
}