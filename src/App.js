import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';
import data from './data';

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
  const [mergedData, setMergedData] = useState([]);

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
    { value: '10C', label: '10C' },
    { value: '8C_nH', label: '8C無心' },
    { value: '8C_nW', label: '8C無水' },
    { value: '8C_nF', label: '8C無火' },
    { value: '8C_nD', label: '8C無暗' }
  ];

  const getBranchLabel = (branchValue) => {
    switch (branchValue) {
      case 2:
        return [ { value: '1st', label: '首' }, { value: '2nd', label: '次' } ];
      case 3:
        return [ { value: 'T', label: '上' }, { value: 'L', label: '左' }, { value: 'R', label: '右' } ];
      case 4:
        return [ { value: 'A', label: '左上' }, { value: 'B', label: '右上' }, { value: 'C', label: '左下' }, { value: 'D', label: '右下' } ];
      case 13:
        return [
          { value: '5', label: '五色' },
          { value: '5F', label: '五色_消火' },
          { value: '5W', label: '五色_消水' },
          { value: '5E', label: '五色_消木' },
          { value: '5L', label: '五色_消光' },
          { value: '5D', label: '五色_消暗' },
          { value: '2', label: '雙色' },
          { value: '2L', label: '雙色_消光' },
          { value: '2D', label: '雙色_消暗' },
          { value: '3', label: '三色' },
          { value: '3F', label: '三色_消火' },
          { value: '3W', label: '三色_消水' },
          { value: '3E', label: '三色_消木' }
        ];
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
    const fetchData = async () => {
      var mergedDataResult = data;
      try {
        const response = await fetch('https://chaohanlin.github.io/img/tos/number/data.js');
        const fetch_data = await response.text();
        const regex = /const data = (\[.*?\]);/s;
        // eslint-disable-next-line
        const data_chl = eval(fetch_data.match(regex)[1]);
        mergedDataResult = data.concat(data_chl.filter(item2 => !data.some(item1 => item1.id === item2.id))).sort((a, b) => a.id - b.id);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setMergedData(mergedDataResult);
    };
    fetchData();
  }, [attribute, race, keyword, selectedValue, selectedBranch]);

  useEffect(() => {
    filterData(attribute, race, keyword);
    // eslint-disable-next-line
  }, [mergedData]);

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
    else if (selectedItem.branch === 13)
      branch = '5'
    setSelectedBranch(branch);
    loadNumberImage(itemId, selectedValue, branch);
  };

  const loadNumberImage = (itemId, selectedValue, selectedBranch) => {
    if (itemId !== 10617 && ['10C', '8C_nH', '8C_nW', '8C_nF', '8C_nD'].includes(selectedValue)) selectedValue = 15
    const branchPath = selectedBranch ? `/${selectedBranch}` : '';
    const handleImageLoad = (type) => {
      const newImage = new Image();
      var srcImg = `${path}/number/${itemId === 10619 ? 20003 : itemId}${branchPath}/${selectedValue}.${type}`
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

    if (itemId === 10617 || ((itemId === 10598 || itemId === 10580) && isNaN(selectedValue))) {
      handleImageLoad('png');
    } else {
      handleImageLoad('jpg');
    }
  };

  const renderCRImage = (id, value, type) => {
    const imagePath = `${path}/number/${id}/${value}_CR.${type}`;
    return <img src={imagePath} alt={`Number ${id}_CR`} style={{ width: numberImageWidth }} />;
  };

  return (
    <>
      {/* <h1>固版轉法查詢</h1> */}
      <div id="imgCover">
        <img
          src={`https://hiteku.github.io/img/tos/tool/tosPath/header.png`}
          alt="imgCover"
          style={{ maxWidth: '500px', width: '100%' }}
        />
      </div>
      <div className='border'>
        <RadioOptions
          options={[
            { name: 'attribute', value: 'water', label: '水' },
            { name: 'attribute', value: 'fire', label: '火' },
            { name: 'attribute', value: 'earth', label: '木' },
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
            { name: 'race', value: 'elf', label: '妖精' },
            { name: 'race', value: 'machina', label: '機械' },
            { name: 'race', value: 'none', label: '不限' },
          ]}
          selected={race}
          handleOptionChange={handleRaceChange}
        />
        <div className='filter' style={{display: 'flex'}} >
          <p>轉法：
          <select value={selectedValue} onChange={handleSelectChange}>
            {selectedItem && selectedItem.id === 10617 ? selectOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            )) : selectOptions.slice(0, 18).map(option => (
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
          {filteredData.slice().reverse().map(item => (
            <img
              key={item.id}
              src={item.id === 10619 ? `${path}/cards/icon/20003i.png`
                : `https://web-assets.tosconfig.com/gallery/icons/${String(item.id).padStart(4, '0')}.jpg`}
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
          <p>⚠️超級緩慢補檔中…<small>（若有誤請海涵並回報）</small></p>
        </div>
        <div className='result-path'>
          {selectedItem && (
            <>
              {numberImageSrc ? (
                <>
                  <img src={numberImageSrc} alt={`Number ${selectedItem}`} style={{ width: numberImageWidth, marginTop: '8px' }} /><br/>
                  {selectedItem.id === 2828 && <span>該路徑為三消</span>}
                  {selectedItem.id === 10329 && <><span>第三種盤面可參考 </span><img
                    src={`https://hiteku.github.io/img/tos/cards/icon/2791i.png`}
                    alt="img10329"
                    style={{ width: '35px' }}
                  /></>}
                  {selectedItem.id === 10410 && (selectedValue !== 'Same_5' && selectedValue !== 'Different_5') && 
                    renderCRImage(selectedItem.id, selectedValue, 'jpg')
                  }
                  {selectedItem.id === 10450 && 
                    <span>目前僅收錄 <a href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4061331" target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://hiteku.fly.dev/static/assets/logo/bahamut.png`}
                        alt="imgBahamut"
                        style={{ width: '20px', marginBottom: '-4px' }}
                      />
                    </a> 部分盤面</span>
                  }
                  {selectedItem.id === 10580 && (selectedValue === 'Cross-Shaped_1' || selectedValue === 'Cross-Shaped_2') && 
                    <img src={`${path}/number/${selectedItem.id}/${selectedValue}.jpg`} alt={`Number ${selectedItem}`} style={{ width: numberImageWidth }} />
                  }
                  {selectedItem.id === 10583 && (selectedValue === 'Same_5' || selectedValue === 'Different_5') && 
                    renderCRImage(selectedItem.id, selectedValue, 'jpg')
                  }
                  {selectedItem.id === 10619 && <span>該路徑為二消</span>}
                  {(selectedItem.id === 10659 || selectedItem.id === 10645) && (selectedValue !== 'Cross-Shaped_2' && selectedValue !== 'Cross-Shaped_3' && selectedValue !== 'Different_5') && 
                    renderCRImage(selectedItem.id, selectedValue, 'jpg')
                  }
                </>
              ) : (
                <span style={{ fontSize: '24px' }}>圖檔未補</span>
              )}
            </>
          )}
        </div>
      </div>
      <div className='src'>
        <sub>
          <a href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4103723" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.fly.dev/static/assets/logo/bahamut.png`}
              alt="imgBahamut"
            />
          </a>&nbsp;
          <a href="https://www.youtube.com/Hiteku" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.fly.dev/static/assets/logo/youtube.png`}
              alt="imgYoutube"
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
