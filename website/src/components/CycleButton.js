import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CycleButton.css';

const CycleButton = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const navigate = useNavigate();
  
  const symbols = ['/\\', '日', '口', '山', '工', '丅'];
  const symbolMap = {
    '/\\': 'whoami',
    '日': 'blog',
    '口': 'contact',
    '山': 'warlok',
    '工': 'oomi',
    '丅': 'projects',
  };

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % symbols.length;
    setCurrentIndex(nextIndex);
    const route = symbolMap[symbols[nextIndex]];
    navigate(`/${route}`);
  };

  return (
    <button className="cycle-button" onClick={handleClick}>
      <div className="symbol">{symbols[currentIndex]}</div>
    </button>
  );
};

export default CycleButton; 