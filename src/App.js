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

function CustomSelect({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = React.useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${isOpen ? 'open' : ''}`} ref={selectRef}>
      <div className="select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : label}</span>
        <div className="arrow"></div>
      </div>
      <div className="select-options">
        {options.map(option => (
          <div
            key={option.value}
            className="option"
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
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
  const [isImageLoading, setIsImageLoading] = useState(false);

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
    { value: 'Different_5', label: '相異五組' },
    { value: 'Same_5', label: '相同五組' },
    { value: '10C', label: '10C' },
    { value: '8C_nH', label: '8C無心' },
    { value: '8C_nW', label: '8C無水' },
    { value: '8C_nF', label: '8C無火' },
    { value: '8C_nD', label: '8C無暗' }
  ];

  function getLabelByValue(value) {
    const option = selectOptions.find(opt => opt.value === value);
    return option ? option.label : null;
  }

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

  const renderCRImage = (itemId, selectedValue) => {
    const type = 'jpg'
    const imagePath = `${path}/number/${itemId}/${selectedValue}_CR.${type}`;
    if (
      (itemId === 10410 && (selectedValue !== 'Same_5' && selectedValue !== 'Different_5')) ||
      (itemId === 10583 && (selectedValue === 'Same_5' || selectedValue === 'Different_5')) ||
      (itemId === 10645 && (selectedValue !== 'Cross-Shaped_2' && selectedValue !== 'Cross-Shaped_3' && selectedValue !== 'Different_5')) ||
      (itemId === 10659 && (selectedValue !== 'Cross-Shaped_2' && selectedValue !== 'Cross-Shaped_3'))
    )
    return <img src={imagePath} alt={`Number ${itemId}_CR`} style={{ width: numberImageWidth }} />;
  };

  const srcImgUrl = (itemId, branchPath) => {
    if (itemId === 2752) itemId = 10329  // 暗秦皇-安妮亞
    if (itemId === 10619) itemId = 20003
    else if ((itemId === 10696 && branchPath === '/L') || itemId === 10646) { itemId = 10373; branchPath = ''; }
    else if (itemId === 10636) { itemId = 2828; branchPath = '/1st'; }
    else if (itemId === 10542) itemId = 2828
    else if (itemId === 10329 && branchPath === '/T') { itemId = 2791; branchPath = ''; }
    else if (itemId === 10172 && branchPath === '/T') { itemId = 2186; branchPath = ''; }
    return `${path}/number/${itemId}${branchPath}/`;
  };

  const loadNumberImage = (itemId, selectedValue, selectedBranch) => {
    if (itemId !== 10617 && ['10C', '8C_nH', '8C_nW', '8C_nF', '8C_nD'].includes(selectedValue)) selectedValue = 15
    const branchPath = selectedBranch ? `/${selectedBranch}` : '';
    setIsImageLoading(true); // 開始載入時顯示載入狀態
    setNumberImageSrc(''); // 清空舊圖片
    
    const handleImageLoad = (type) => {
      const newImage = new Image();
      var srcImg = srcImgUrl(itemId, branchPath) + `${selectedValue}.${type}`
      if (!data.map(item => item.id).includes(itemId))
        srcImg = `https://chaohanlin.github.io/img/tos/number/${itemId}${branchPath}/${selectedValue}.${type}`
      newImage.onload = () => {
        const newWidth = `${newImage.width / 3}px`;
        setNumberImageSrc(srcImg);
        setNumberImageWidth(newWidth);
        setIsImageLoading(false); // 載入完成後隱藏載入狀態
      };
      newImage.onerror = () => {
        setNumberImageSrc('');
        setNumberImageWidth(null);
        setIsImageLoading(false); // 載入失敗後隱藏載入狀態
      };
      newImage.src = srcImg;
    };

    if (itemId === 10617 || itemId === 2914 || ((itemId === 10598 || itemId === 10580) && isNaN(selectedValue))) {
      handleImageLoad('png');
    } else {
      handleImageLoad('jpg');
    }
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
        <div className="filter" style={{ display: 'flex', flexWrap: 'wrap' }} >
          <p>轉法：
            <CustomSelect
              options={selectedItem && selectedItem.id === 10617 ? selectOptions : selectOptions.slice(0, 18)}
              value={selectedValue}
              onChange={handleSelectChange}
              label="請選擇轉法"
            />
          </p>
          {selectedItem && selectedItem.branch && (
            <p>盤面：
              <CustomSelect
                options={branchOptions}
                value={selectedBranch}
                onChange={handleBranchChange}
                label="請選擇盤面"
              />
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
                  <span>{getLabelByValue(selectedValue)}</span><br/>
                  {isImageLoading && (
                    <div className="loading-spinner loading-spinner-with-margin">
                      <div className="loading-spinner-icon"></div>
                      <span>載入中...</span>
                    </div>
                  )}
                  <img src={numberImageSrc} alt={`Number ${selectedItem.id}`} className="img-result-path" style={{ width: numberImageWidth }} /><br/>
                  {selectedItem.id === 2828 && <span>該路徑為三消</span>}
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
                    <img src={`${path}/number/${selectedItem.id}/${selectedValue}.jpg`} alt={`Number ${selectedItem.id}`} className="img-result-path" style={{ width: numberImageWidth }} />
                  }
                  {selectedItem.id === 10617 && selectedValue.includes('8C') &&
                    <span>其他轉法 <a href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4113002" target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://hiteku.fly.dev/static/assets/logo/bahamut.png`}
                        alt="imgBahamut"
                        style={{ width: '20px', marginBottom: '-4px' }}
                      />
                    </a></span>
                  }
                  {(selectedItem.id === 10628 || selectedItem.id === 10619 || selectedItem.id === 2487) && <span>該路徑為二消</span>}
                  {renderCRImage(selectedItem.id, selectedValue)}
                </>
              ) : (
                (selectedItem.id === 10628) ? <><span>隊長非黛玉可參考 </span><img
                  src={`https://web-assets.tosconfig.com/gallery/icons/2487.jpg`}
                  alt="img2487"
                  style={{ borderRadius: '9%', width: '35px' }}
                /></>
                : (selectedItem.id === 2907 && !isNaN(selectedValue)) ? <><span>盤面可參考 </span><img
                  src={`https://hiteku.github.io/img/tos/cards/icon/10668i.png`}
                  alt="img10668"
                  className="clickable-icon"
                  style={{ width: '35px' }}
                  onClick={() => handleIconClick(10668)}
                /></>
                : isImageLoading ? (
                    <div className="loading-spinner">
                      <div className="loading-spinner-icon"></div>
                      <span>載入中...</span>
                    </div>
                  ) : <span style={{ fontSize: '24px' }}>圖檔未補</span>
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
