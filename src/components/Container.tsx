import React, { useEffect, useState } from "react";
import Card from "./Card";
import Timer from "./Timer";
import "../App.css";

interface CardData {
  position?: number;
  type?: string;
  title?: string;
  thumbnail?: string;
}

export default function Container() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCards, setCurrentCards] = useState<CardData[]>([
    {},
    {},
    {},
    {},
    {},
  ]); // added placeholder to show shimmer
  const [originalCards, setOriginalCards] = useState<CardData[]>([]);

  const getCatsData = async (): Promise<void> => {
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

  const updateCatsData = async (): Promise<void> => {
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

  const saveData = async (): Promise<void> => {
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
    const interval = setInterval(() => {
      saveData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentCards, originalCards]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    e.dataTransfer.setData("cardIndex", index.toString());
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ): void => {
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
      {!loading && <Timer />}
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
