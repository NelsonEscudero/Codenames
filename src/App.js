import React, { useState, useMemo } from "react";
import "./App.css";
import { ROLES, makeNewGame } from "./Game";

function DecorLayer() {
  return (
    <div className="decor-layer" aria-hidden="true">
      <div className="blood-banner" />
      <div className="web-top-right" />
      <img src="/skeleton.gif" alt="dancing skeleton" className="skeleton-left" />
    </div>
  );
}
function HalloweenDecor() {
  return (
    <>
      {/* floating emoji (replace with <img src="/pumpkin.png" .../> if you add files) */}
      <div className="floaters" aria-hidden="true">
        <span className="floater pumpkin" style={{ left: "6%", animationDelay: "0s" }}>🎃</span>
        <span className="floater ghost"   style={{ left: "22%", animationDelay: ".6s" }}>👻</span>
        <span className="floater mummy"   style={{ left: "38%", animationDelay: ".2s" }}>🧟</span>
        <span className="floater pumpkin" style={{ left: "58%", animationDelay: ".9s" }}>🎃</span>
        <span className="floater ghost"   style={{ left: "78%", animationDelay: ".3s" }}>👻</span>
      </div>
    </>
  );
}

export default function App() {
  const [game, setGame] = useState(makeNewGame());
  const [codemaster, setCodemaster] = useState(false);
  const [hintText, setHintText] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const [guessesLeft, setGuessesLeft] = useState(0);
  const [history, setHistory] = useState([]);

  const { cards, currentTeam, winner } = game;
  const otherTeam = currentTeam === ROLES.RED ? ROLES.BLUE : ROLES.RED;

  const canGuess = winner == null && guessesLeft > 0;
  
  const statusText = useMemo(() => {
    if (winner) return `${winner.toUpperCase()} wins!`;

    if (guessesLeft > 0) return `${currentTeam.toUpperCase()} guessing `;
    return `${currentTeam.toUpperCase()} codemaster: give a hint`;
  }, [winner, guessesLeft, currentTeam]);

  function resetGame() {
    setGame(makeNewGame());
    setCodemaster(false);
    setHintText("");
    setHintCount(0);
    setGuessesLeft(0);
    setHistory([]);
  }

  function giveHint() {
    if (!hintText.trim()) return;
    const n = Math.max(0, Math.floor(Number(hintCount) || 0));
    setGuessesLeft(n + 1);
    setHistory([{ team: currentTeam, text: hintText.trim(), count: n }, ...history]);
    setHintText("");
    setHintCount(0);
  }

  function revealCard(i) {
    if (!canGuess) return;

    setGame(prev => {
      const next = { ...prev, cards: prev.cards.slice() };
      const c = { ...next.cards[i] };
      if (c.revealed) return prev;

      c.revealed = true;
      next.cards[i] = c;

      if (c.role === ROLES.ASSASSIN) {
        next.winner = otherTeam;
        next.assassinHit = true;
        return next;
      }

      if (c.role === ROLES.RED || c.role === ROLES.BLUE) {
        next.remaining = { ...prev.remaining, [c.role]: prev.remaining[c.role] - 1 };
        if (next.remaining[c.role] === 0) next.winner = c.role;
      }

      return next;
    });

    const clicked = game.cards[i];
    if (clicked.role !== currentTeam) {
      setGuessesLeft(0);
      endTurn();
    }
  }

  function endTurn() {
    setGame(prev => ({ ...prev, currentTeam: otherTeam }));
    setGuessesLeft(0);
  }

  return (
    <>
      <DecorLayer />
      <div className="app">
        <header className="site-header">
          <h1 className="bloody">Codenames</h1>
        </header>

         <p>{statusText}</p>

        <button onClick={() => setCodemaster(c => !c)}>
          {codemaster ? "Hide Codemaster" : "Show Codemaster"}
        </button>
        <button onClick={resetGame}>New Game</button>

        <div className="hint-controls">
          <input value={hintText} onChange={e => setHintText(e.target.value)} placeholder="Hint word" />
          <input type="number" value={hintCount} onChange={e => setHintCount(e.target.value)} />
          <button onClick={giveHint}>Give Hint</button>
          <button onClick={endTurn}>End Turn</button>
        </div>

        <div className="board">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`card ${c.revealed ? c.role : ""} ${codemaster && !c.revealed ? c.role + "-hidden" : ""}`}
              onClick={() => revealCard(i)}
            >
              {c.word}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}