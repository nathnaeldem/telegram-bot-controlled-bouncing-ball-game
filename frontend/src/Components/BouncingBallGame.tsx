import React, { useEffect, useRef, useState } from "react";
import "./BouncingBallGame.css";
import { useInitData, useExpand } from "@vkruglikov/react-telegram-web-app";

interface InitDataUnsafe {
  query_id: string;
  user: User;
  auth_date: number;
  hash: string;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  language_code: string;
}

const BouncingBallGame: React.FC = () => {
  const [initDataUnsafe] = useInitData() as readonly [InitDataUnsafe | undefined, unknown];
  const ballRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const floorRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLSpanElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null); // WebSocket reference

  const [y, setY] = useState(0); // Ball's vertical position
  const [speed, setSpeed] = useState(2); // Ball's speed (constant)
  const [direction, setDirection] = useState(1); // 1 for down, -1 for up
  const [isRunning, setIsRunning] = useState(true);

  const [containerHeight, setContainerHeight] = useState(500); // Fallback value
  const [floorHeight, setFloorHeight] = useState(50); // Fallback value

  const user = initDataUnsafe?.user || { first_name: "Guest", username: "guest" }; // Fallback user for browsers
  const [isExpanded, expand] = useExpand();

  // Use expand for mini-apps in Telegram
  useEffect(() => {
    if (initDataUnsafe && !isExpanded) expand();
  }, [initDataUnsafe, isExpanded, expand]);

  // WebSocket connection and message handling
  useEffect(() => {
    const userAgent = navigator.userAgent || "unknown"; // Set user-agent dynamically
    const wsUrl = `wss://gray-neighborly-plain.glitch.me/?user-agent=${encodeURIComponent(userAgent)}`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established!");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    wsRef.current.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        try {
          const message = JSON.parse(text);
          switch (message.command) {
            case "start":
              setIsRunning(true);
              break;
            case "stop":
              setIsRunning(false);
              break;
            case "speedUp":
              setSpeed((prev) => prev + 1);
              break;
            case "slowDown":
              setSpeed((prev) => (prev > 1 ? prev - 1 : 1));
              break;
            case "reverse":
              setDirection((prev) => -prev);
              break;
            default:
              console.warn("Unknown command:", message.command);
          }
        } catch (error) {
          console.error("Failed to parse JSON:", error);
        }
      } else if (event.data === "pong") {
        console.log("Received pong from server");
      } else {
        console.warn("Unexpected WebSocket message type:", typeof event.data);
      }
    };

    // Ping the server every 30 seconds to keep the connection alive
    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Sending ping to server");
        wsRef.current.send("ping");
      }
    }, 30000); // Ping every 30 seconds

    // Clean up on component unmount
    return () => {
      clearInterval(interval);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    // Get dimensions dynamically
    const updateDimensions = () => {
      if (containerRef.current && floorRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
        setFloorHeight(floorRef.current.offsetHeight);
      }
    };

    // Update on load and resize
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setY((prevY) => {
        const floorPosition =
          containerHeight -
          floorHeight -
          (ballRef.current ? ballRef.current.offsetHeight : 50); // Dynamic ball size
        let newY = prevY + speed * direction;

        // Bounce off the bottom
        if (newY >= floorPosition) {
          newY = floorPosition;
          setDirection(-1); // Reverse direction
        }

        // Bounce off the top
        if (newY <= 0) {
          newY = 0;
          setDirection(1); // Reverse direction
        }

        return newY;
      });
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [isRunning, speed, direction, containerHeight, floorHeight]);

  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.style.top = `${y}px`;
    }

    if (infoRef.current) {
      infoRef.current.innerText = `Speed: ${speed}, Direction: ${direction > 0 ? "Down" : "Up"}`;
    }
  }, [y, speed, direction]);

  // Button Handlers
  const startGame = () => {
    setIsRunning(true);
  };
  const pauseGame = () => {
    setIsRunning(false);
  };
  const speedUp = () => {
    setSpeed((prev) => prev + 1);
  };
  const slowDown = () => {
    setSpeed((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const reverse = () => {
    setDirection((prev) => -prev);
  };

  return (
    <div>
      <div className="game-container" ref={containerRef}>
        <div className="welcome-message">
          <p>Welcome, {user.first_name}</p>
        </div>
        <div className="ball" ref={ballRef}>
          <span className="info" ref={infoRef}>Info</span>
        </div>
        <div className="floor" ref={floorRef}></div>
      </div>
      <div className="controls">
        <button onClick={startGame} className="control-button">
          <i className="fas fa-play"></i> Start
        </button>
        <button onClick={pauseGame} className="control-button">
          <i className="fas fa-pause"></i> Pause
        </button>
        <button onClick={speedUp} className="control-button">
          <i className="fas fa-arrow-up"></i> Speed Up
        </button>
        <button onClick={slowDown} className="control-button">
          <i className="fas fa-arrow-down"></i> Slow Down
        </button>
        <button onClick={reverse} className="control-button">
          <i className="fas fa-sync-alt"></i> Reverse
        </button>
      </div>
    </div>
  );
};

export default BouncingBallGame;
