import React, { useState, useEffect, useRef } from 'react';

// Magnet component
const Magnet = ({ x, y, type, onDrag, onRotate, onClick, isActive }) => {
  const magnetRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const offsetX = e.clientX - x;
    const offsetY = e.clientY - y;

    const onMouseMove = (e) => {
      onDrag(e.clientX - offsetX, e.clientY - offsetY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleClick = () => {
    onClick(); // Trigger attraction when magnet is clicked
  };

  const magnetStyle = {
    left: `${x}px`,
    top: `${y}px`,
    position: 'absolute',
    width: '70px',
    height: '70px',
    backgroundColor: type === 'north' ? '#ff2d55' : '#007aff',
    borderRadius: '50%',
    cursor: 'grab',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    zIndex: isActive ? 20 : 10, // Highlight active magnet
  };

  return (
    <div
      ref={magnetRef}
      className={`magnet ${type}`}
      style={magnetStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    />
  );
};

// Metal Object component that can be attracted by magnets
const MetalObject = ({ x, y }) => {
  const metalRef = useRef(null);

  const metalStyle = {
    left: `${x}px`,
    top: `${y}px`,
    position: 'absolute',
    width: '40px',
    height: '40px',
    backgroundColor: '#B0B0B0',
    borderRadius: '50%',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    zIndex: 5,
  };

  return <div ref={metalRef} style={metalStyle} />;
};

// Main App component
const App = () => {
  const [magnets, setMagnets] = useState([
    { id: 1, x: 100, y: 100, type: 'north', rotation: 0, isActive: false },
    { id: 2, x: 300, y: 200, type: 'south', rotation: 0, isActive: false },
  ]);
  
  const [metalObjects, setMetalObjects] = useState([
    { id: 1, x: 400, y: 400 },
    { id: 2, x: 600, y: 150 },
  ]);

  const updateMagnetPosition = (id, x, y) => {
    setMagnets((prevMagnets) =>
      prevMagnets.map((magnet) =>
        magnet.id === id ? { ...magnet, x, y } : magnet
      )
    );
  };

  const updateMetalObjectPosition = (id, x, y) => {
    setMetalObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, x, y } : obj
      )
    );
  };

  // Function to handle magnet click to trigger attraction
  const handleMagnetClick = (clickedMagnetId) => {
    setMagnets((prevMagnets) =>
      prevMagnets.map((magnet) =>
        magnet.id === clickedMagnetId
          ? { ...magnet, isActive: !magnet.isActive } // Toggle magnet active state
          : magnet
      )
    );
  };

  // Attraction logic: if a magnet is active, it will attract nearby metal objects
  const checkAttraction = () => {
    setMetalObjects((prevObjects) => {
      return prevObjects.map((metalObject) => {
        let activeMagnet = null;
        let minDistance = Infinity;

        // Find the closest active magnet
        magnets.forEach((magnet) => {
          if (magnet.isActive) {
            const distance = Math.sqrt(
              Math.pow(magnet.x - metalObject.x, 2) + Math.pow(magnet.y - metalObject.y, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              activeMagnet = magnet;
            }
          }
        });

        // If a nearby magnet is found, move the metal object towards it
        if (activeMagnet && minDistance < 200) {
          const angle = Math.atan2(activeMagnet.y - metalObject.y, activeMagnet.x - metalObject.x);
          const newX = metalObject.x + Math.cos(angle) * 2; // Move towards the magnet
          const newY = metalObject.y + Math.sin(angle) * 2;

          updateMetalObjectPosition(metalObject.id, newX, newY);
        }

        return metalObject;
      });
    });
  };

  // Handle Magnet Movement
  useEffect(() => {
    checkAttraction(); // Check for attraction every time magnets or metal objects change
  }, [magnets, metalObjects]);

  const resetPositions = () => {
    setMagnets([
      { id: 1, x: 100, y: 100, type: 'north', rotation: 0, isActive: false },
      { id: 2, x: 300, y: 200, type: 'south', rotation: 0, isActive: false },
    ]);
    setMetalObjects([
      { id: 1, x: 400, y: 400 },
      { id: 2, x: 600, y: 150 },
    ]);
  };

  const appStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2',
    flexDirection: 'column',
    fontFamily: "'Roboto', sans-serif",
    padding: '20px',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#333',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const containerStyle = {
    position: 'relative',
    width: '80%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    transform: 'scale(1)',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  };

  const infoTextStyle = {
    fontSize: '1.2rem',
    color: '#555',
    marginTop: '20px',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: '1px',
  };

  return (
    <div style={appStyle}>
      <h1 style={headerStyle}>Magnet Simulation</h1>
      <div style={containerStyle}>
        {magnets.map((magnet) => (
          <Magnet
            key={magnet.id}
            x={magnet.x}
            y={magnet.y}
            type={magnet.type}
            onDrag={(newX, newY) => updateMagnetPosition(magnet.id, newX, newY)}
            onRotate={magnet.rotation}
            onClick={() => handleMagnetClick(magnet.id)} // Trigger attraction on click
            isActive={magnet.isActive} // Highlight active magnet
          />
        ))}
        {metalObjects.map((metal) => (
          <MetalObject
            key={metal.id}
            x={metal.x}
            y={metal.y}
          />
        ))}
      </div>
      <button style={buttonStyle} onClick={resetPositions}>Reset Magnets</button>
      <div style={infoTextStyle}>
        <p>Click on a magnet to make it attract metal objects around it.</p>
      </div>
    </div>
  );
};

export default App;
