import React, { useRef, useEffect } from 'react';
import readXlsxFile from 'read-excel-file';

const Table = ({
  dataset,
  setDataset,
  fileInputRef,
  testTable = false,
  testedRow,
  result
}) => {
  const readExcel = (file) => {
    readXlsxFile(file).then((rows) => {
      console.log('aaa');
      setDataset(rows);
    });
  };

  const rowScroll = useRef();

  const scrollIntoRow = () => {
    if (rowScroll.current) {
      rowScroll.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollIntoRow();
  }, [testedRow]);

  return (
    <>
      <div className="tableWrapper">
        <table className="dataTable">
          {dataset.map((row, index1) => (
            <tr
              ref={index1 === testedRow && testTable ? rowScroll : null}
              key={index1}
              style={{
                background:
                  testTable && index1 === testedRow && index1 !== 0
                    ? 'yellow'
                    : 'transparent',
                color:
                  testTable && index1 === testedRow && index1 !== 0
                    ? 'blue'
                    : ''
              }}
            >
              {row.map((cell, index2) => (
                <td key={index2}>{cell}</td>
              ))}

              {testTable && index1 === 0 && <td>Result</td>}
              {testTable && index1 !== 0 && (
                <td>{result.length && result[index1 - 1]}</td>
              )}
              {/* {testTable && row === 0 && <td>Result</td>}
              {testTable &&
                dataset.map((cell, index2) => (
                  <td key={index2}>{testedRow === index2 ? '1' : ''}</td>
                ))} */}
            </tr>
          ))}
        </table>
        {!dataset.length && (
          <button
            className="customFileInputButton"
            onClick={() => fileInputRef.current.click()}
          >
            Veri seti seç
          </button>
        )}
      </div>
      <input
        style={{ display: 'none' }}
        type={'file'}
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
    </>
  );
};

export default Table;
