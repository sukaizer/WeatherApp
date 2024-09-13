import React, {useState, useEffect} from 'react';
import './mainGame.css';

// Main game component, drag and drop clothes
const MainGame = (props) => {

  const [selectedCircle, setSelectedCircle] = useState('top');
  const [onDrop, setOnDrop] = useState(false);
  const [lastDragged, setLastDragged] = useState(null);

  const handleCircleClick = (circle) => {
    setSelectedCircle(circle);
  };

  var dragged = null;
  var lastPosition = { x: 0, y: 0 };

  // Utility functions 

  // if position is inside the element 
  const isInsideImage = (element, x, y) => {
  const rect = element.getBoundingClientRect();
  return x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom;
  };

  const getOffset = ( el ) => {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  const getPositionAndSize = (id) => {
    const element = document.getElementById(id);
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  };

  const handleDrag = (id, newLeft, newTop) => {
    props.setClothesList(prevList => prevList.map(cloth => 
      cloth.id === id ? {...cloth, left: newLeft, top: newTop} : cloth
    ));
  };

  const handleDrop = (id, pickable) => {
    props.setClothesList(prevList => prevList.map(cloth => 
      cloth.id === id ? {...cloth, pickable: pickable} : cloth
    ));
    setLastDraggedCloth(props.clothesList.find(cloth => cloth.id === id));
    setDrop(true);
  };

  const endGame = async () => {
    props.setScore();
  };

  useEffect(() => {
    if (onDrop === false) return;
    props.clothesList.forEach(cloth => {
      if (cloth.pickable === false && cloth.type === lastDragged.type && cloth.id !== lastDragged.id) {
        const character = document.getElementById('characterDropzone');
        const position = getOffset(document.getElementById(lastDragged.id));
        if (isInsideImage(character, position.left, position.top)) {
          cloth.pickable = true;
        }
      }      
    });
  }, [onDrop]);

  const setDrop = (bool) => {
    setOnDrop(bool);
  };

  const setLastDraggedCloth = (cloth) => {
    setLastDragged(cloth);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragged !== null) {
        const boundingBox = getPositionAndSize('gameArea');

        const newLeft = event.clientX;
        const newTop = event.clientY;
        const dx = newLeft - lastPosition.x;
        const dy = newTop - lastPosition.y;
        
        if (newLeft >= boundingBox.left && newLeft <= boundingBox.left + boundingBox.width && newTop >= boundingBox.top && newTop <= boundingBox.top + boundingBox.height) {
          var x = getOffset( dragged ).left;
          var y = getOffset( dragged ).top;
          x += dx;
          y += dy;
          
          dragged.style.left = x + 'px';
          dragged.style.top = y + 'px';
          handleDrag(dragged.id, x, y);
          lastPosition = ({ x: newLeft, y: newTop });
        }
        const character = document.getElementById('characterDropzone');
        const position = getOffset( dragged );
        if (isInsideImage(character, position.left, position.top)) {
          props.setHighlight(true);
        } else {
          props.setHighlight(false);
        }
      }
    };

    const handleMouseDown = (event) => {
      setDrop(false);
      props.clothesList.forEach(cloth => {
        if (document.getElementById(cloth.id) === null) return;
        if (isInsideImage(document.getElementById(cloth.id), event.clientX, event.clientY)) {
          dragged = (document.getElementById(cloth.id));
        }
        return;
      });
      lastPosition = ({ x: event.clientX, y: event.clientY });
    };
    
    const handleMouseUp = (event) => {
      if (dragged !== null) {
        const character = document.getElementById('characterDropzone');
        const position = getOffset(dragged);

        if (isInsideImage(character, position.left, position.top)) {
          handleDrop(dragged.id, false);
          props.setHighlight(false);
        } else {
          handleDrop(dragged.id, true);
        }
      }
      dragged = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div id='mainGameContainer' className='mainGame--container'>
      <div id='clothesDragzone' className='mainGame--clothes'>
      {props.clothesList.map((cloth, index) => (
        <img
          key={index}
          id={cloth.id} 
          className='mainGame--cloth' 
          draggable='false' 
          src={cloth.image} 
          alt={cloth.id} 
          style={{
            left: cloth.pickable ? "" : cloth.left,
            top: cloth.pickable ? "" : cloth.top,
            display: cloth.pickable ? cloth.type === selectedCircle ? '' : 'none' : 'block'
          }}
        />
      ))}
      </div>
      <div className='mainGame--categories'>
        <div className={`circle ${selectedCircle === 'top' ? 'selected-circle' : ''}`} onClick={() => handleCircleClick('top')}>
          <span>Top</span>
        </div>
        <div className={`circle ${selectedCircle === 'bottom' ? 'selected-circle' : ''}`} onClick={() => handleCircleClick('bottom')}>
          <span>Bottom</span>
        </div>
        <div className={`circle ${selectedCircle === 'footwear' ? 'selected-circle' : ''}`} onClick={() => handleCircleClick('footwear')}>
          <span>Footwear</span>
        </div>
        <div className={`circle ${selectedCircle === 'headwear' ? 'selected-circle' : ''}`} onClick={() => handleCircleClick('headwear')}>
          <span>Headwear</span>
        </div>
        <div className={`circle ${selectedCircle === 'accessories' ? 'selected-circle' : ''}`} onClick={() => handleCircleClick('accessories')}>
          <span>Accessories</span>
        </div>
        <div className={`circle ${selectedCircle === 'outwear' ? 'selected-circle' : ''}`} onClick={() => handleCircleClick('outwear')}>
          <span>Outwear</span>
        </div>
      </div>
      <button className="game--main--btn" onClick={() => endGame()}>Dress!</button>
    </div>
  );
}

export default MainGame;