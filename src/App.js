import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';
import data from './data';
import data_chl from 'https://chaohanlin.github.io/img/tos/number/data.js';

const mergedData = data.concat(data_chl).sort((a, b) => a.id - b.id);
const path = 'https://hiteku.github.io/img/tos';

function RadioOptions({ options, selected, handleOptionChange }) {
  return (
    <div className='filter'>
      {options.map((option) => (
        <label key={option.value} className={selected === option.value ? 'selected' : ''}>
          <input
            type="radio"
            name={option.name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

function App() {
  const [attribute, setAttribute] = useState('none');
  const [race, setRace] = useState('none');
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [numberImageSrc, setNumberImageSrc] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedValue, setSelectedValue] = useState('23');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('1st');
  const [numberImageWidth, setNumberImageWidth] = useState(null);

  const selectOptions = [
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
    { value: '20', label: '20' },
    { value: '21', label: '21' },
    { value: '22', label: '22' },
    { value: '23', label: '23' },
    { value: '24', label: '24' },
    { value: '25', label: '25' },
    { value: '26', label: '26' },
    { value: '27', label: '27' },
    { value: 'Cross-Shaped_1', label: '單十字' },
    { value: 'Cross-Shaped_2', label: '雙十字' },
    { value: 'Cross-Shaped_3', label: '三十字' },
    { value: 'Same_5', label: '相同五組' },
    { value: 'Different_5', label: '相異五組' },
  ];

  const getBranchLabel = (branchValue) => {
    switch (branchValue) {
      case 2:
        return [ { value: '1st', label: '首' }, { value: '2nd', label: '次' } ];
      case 3:
        return [ { value: 'T', label: '上' }, { value: 'L', label: '左' }, { value: 'R', label: '右' } ];
      case 4:
        return [ { value: 'A', label: '左上' }, { value: 'B', label: '右上' }, { value: 'C', label: '左下' }, { value: 'D', label: '右下' } ];
      default:
        return [];
    }
  };

  const branchOptions = useMemo(() => {
    if (selectedItem && selectedItem.branch) {
      return getBranchLabel(selectedItem.branch);
    }
    return [];
  }, [selectedItem]);

  useEffect(() => {
    filterData(attribute, race, keyword);
  }, [attribute, race, keyword, selectedValue, selectedBranch]);

  const handleAttributeChange = (value) => {
    setAttribute(value);
  };

  const handleRaceChange = (value) => {
    setRace(value);
  };

  // eslint-disable-next-line
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    if (selectedItem) {
      loadNumberImage(selectedItem.id, event.target.value, selectedBranch);
    }
  };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    if (selectedItem && selectedValue) {
      loadNumberImage(selectedItem.id, selectedValue, event.target.value);
    }
  };

  const filterData = (attribute, race, keyword) => {
    const filteredData = mergedData.filter(item => (
      (attribute === 'none' || item.attr === attribute) &&
      (race === 'none' || item.race === race) &&
      (item.id.toString().includes(keyword))
    ));
    setFilteredData(filteredData);
  };

  const handleIconClick = (itemId) => {
    const selectedItem = mergedData.find(item => item.id === itemId);
    setSelectedItem(selectedItem);
    setSelectedIcon(itemId);
    var branch = ''
    if (selectedItem.branch === 2)
      branch = '1st'
    else if (selectedItem.branch === 3)
      branch = 'T'
    else if (selectedItem.branch === 4)
      branch = 'A'
    setSelectedBranch(branch);
    loadNumberImage(itemId, selectedValue, branch);
  };

  const loadNumberImage = (itemId, selectedValue, selectedBranch) => {
    const branchPath = selectedBranch ? `/${selectedBranch}` : '';
    const handleImageLoad = (type) => {
      const newImage = new Image();
      var srcImg = `${path}/number/${itemId}${branchPath}/${selectedValue}.${type}`
      if (!data.map(item => item.id).includes(itemId))
        srcImg = `https://chaohanlin.github.io/img/tos/number/${itemId}${branchPath}/${selectedValue}.${type}`
      newImage.onload = () => {
        const newWidth = `${newImage.width / 3}px`;
        setNumberImageSrc(srcImg);
        setNumberImageWidth(newWidth);
      };
      newImage.onerror = () => {
        setNumberImageSrc('');
        setNumberImageWidth(null);
      };
      newImage.src = srcImg;
    };

    if (itemId > 10616 || ((itemId === 10598 || itemId === 10580 || itemId === 10534 || itemId === 10410) && isNaN(selectedValue))) {
      handleImageLoad('png');
    } else {
      handleImageLoad('jpg');
    }
  };

  return (
    <>
      <h1>固版轉法查詢</h1>
      <div className='border'>
        <RadioOptions
          options={[
            { name: 'attribute', value: 'water', label: '水' },
            { name: 'attribute', value: 'fire', label: '火' },
            { name: 'attribute', value: 'wood', label: '木' },
            { name: 'attribute', value: 'light', label: '光' },
            { name: 'attribute', value: 'dark', label: '暗' },
            { name: 'attribute', value: 'none', label: '不限' },
          ]}
          selected={attribute}
          handleOptionChange={handleAttributeChange}
        />
        <RadioOptions
          options={[
            { name: 'race', value: 'god', label: '神族' },
            { name: 'race', value: 'demon', label: '魔族' },
            { name: 'race', value: 'human', label: '人類' },
            { name: 'race', value: 'beast', label: '獸類' },
            { name: 'race', value: 'dragon', label: '龍類' },
            { name: 'race', value: 'fairy', label: '妖精' },
            { name: 'race', value: 'machine', label: '機械' },
            { name: 'race', value: 'none', label: '不限' },
          ]}
          selected={race}
          handleOptionChange={handleRaceChange}
        />
        <div className='filter' style={{display: 'flex'}} >
          <p>轉法：
            <select value={selectedValue} onChange={handleSelectChange}>
              {selectOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </p>
          {selectedItem && selectedItem.branch && (
            <p>盤面：
              <select value={selectedBranch} onChange={handleBranchChange}>
                {branchOptions.map(branch => (
                  <option key={branch.value} value={branch.value}>{branch.label}</option>
                ))}
              </select>
            </p>
          )}
        </div>
      </div>
      <div className='result'>
        <div className='result-icon'>
          {filteredData.map(item => (
            <img
              key={item.id}
              // src={`${path}/cards/icon/${item.id}i.png`}
              src={`https://web-assets.tosconfig.com/gallery/icons/${String(item.id).padStart(4, '0')}.jpg`}
              alt={`Icon ${item.id}`}
              style={{
                borderRadius: '9%', 
                width: '50px',
                margin: '5px',
                border: selectedIcon === item.id ? '2px solid #D3A4FF' : 'none',
                boxShadow: selectedIcon === item.id ? '0 0 5px #D3A4FF' : 'none'
              }}
              onClick={() => handleIconClick(item.id)}
            />
          ))}
          <p>⚠️超級緩慢補檔中…<small>（新角色優先）</small></p>
        </div>
        <div className='result-path'>
          {selectedItem && (
            <>
              {numberImageSrc ? (
                <img src={numberImageSrc} alt={`Number ${selectedItem}`} style={{ width: numberImageWidth, marginTop: '7px', }} />
              ) : (
                <span style={{ fontSize: '30px' }}>未補或從缺</span>
              )}
            </>
          )}
        </div>
      </div>
      <div className='src'>
        <sub>
          <a href="https://forum.gamer.com.tw/C.php?bsn=23805&snA=703158" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.github.io/img/-/bahamut.png`}
              alt="imgCover"
            />
          </a>&nbsp;
          <a href="https://www.youtube.com/Hiteku" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.github.io/img/-/youtube.png`}
              alt="imgCover"
            />
          </a> © 2024 Hiteku
        </sub>
      </div>
      <ScrollToTopButton></ScrollToTopButton>
    </>
  );
}

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    background: '#222',
    color: '#fff',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    opacity: showButton ? '1' : '0',
    transition: 'opacity 0.3s ease-in-out'
  };

  return (
    <div style={buttonStyles} onClick={scrollToTop} >
      <i className="fa-solid fa-angle-up"></i>
    </div>
  );
};

export default App;
