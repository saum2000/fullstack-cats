import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import Timer from "./Timer.jsx";
import "../App.css";

export default function Container() {
  const [loading, setLoading] = useState(true);
  const [currentCards, setCurrentCards] = useState([{}, {}, {}, {}, {}]); // added placeholder to show shimmer
  const [originalCards, setOriginalCards] = useState([]);
  
  const getCatsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/cats");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setCurrentCards(data);
      setOriginalCards(data);
    } catch (error) {
      console.error("Error fetching cats data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCatsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/cats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCards),
      });

      if (!response.ok) {
        throw new Error(`Failed to update cats data: ${response.statusText}`);
      } else {
        setOriginalCards(currentCards);
      }
    } catch (error) {
      console.error("Error updating cats data:", error);
    }
  };

  const saveData = async () => {
    if (
      currentCards?.length > 0 &&
      JSON.stringify(currentCards) !== JSON.stringify(originalCards)
    ) {
      setLoading(true);
      await updateCatsData();
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getCatsData();

  }, []);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      saveData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentCards, originalCards]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("cardIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("cardIndex"), 10);

    const newConfig = [...currentCards];
    const [draggedCard] = newConfig.splice(draggedIndex, 1);
    newConfig.splice(dropIndex, 0, draggedCard);

    newConfig.forEach((card, index) => (card.position = index));
    setCurrentCards(newConfig);
  };

  return (
    <>
      {!loading && <Timer loading={loading} />}
      <div className="wrapper" id="main-wrapper">
        {currentCards.map((cardData, i) => (
          <Card
            key={i}
            isLoading={loading}
            card={cardData}
            index={i}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
          />
        ))}
      </div>
    </>
  );
}
