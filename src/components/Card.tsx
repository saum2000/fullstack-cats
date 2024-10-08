import React, { useState, useEffect } from "react";

interface CardProps {
  card: {
    title?: string;
    type?: string;
    thumbnail?: string;
    position?: number;
  };
  index: number;
  isLoading: boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

export default function Card({ card, index, isLoading, handleDragStart, handleDrop }: CardProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOverlayVisible(false);
      }
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleCardClick = (imageSrc: string): void => {
    setCurrentImageSrc(imageSrc);
    setIsOverlayVisible(true);
  };

  const closeOverlay = (): void => {
    setIsOverlayVisible(false);
  };

  return (
    <div
    key={index}
    id={`card-${index}`}
    draggable
    onDragStart={(e) => handleDragStart(e, index)}
    onDrop={(e) => handleDrop(e, index)}
    onDragOver={(e) => e.preventDefault()}
    className="card"
    >
      {isLoading ? (
        <>
          <div
            className="shimmer mb-5 w-[100px] h-[25px]"
            style={{ height: "25px", width: "100px"}}
          ></div>
          <div
            className="shimmer w-full"
            style={{ width: "100%" }}
          ></div>
        </>
      ) : (
        <>
          <div
            onClick={() => handleCardClick(`${card.thumbnail}`)}
            className="cursor-pointer bg-red"
          >
            <p>{card.title}</p>
            <img src={card.thumbnail} />
          </div>

          {isOverlayVisible && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10"
              onClick={closeOverlay}
            >
              <div className="absolute" onClick={(e) => e.stopPropagation()}>
                <img
                  src={currentImageSrc}
                  alt="Overlay"
                  className="w-[600px] "
                />
                <button
                  className="absolute top-2 right-2 text-black bg-white px-2 text-2xl rounded"
                  onClick={closeOverlay}
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
