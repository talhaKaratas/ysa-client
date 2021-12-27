import React from 'react';
import readXlsxFile from 'read-excel-file';

const Table = ({
  dataset,
  setDataset,
  fileInputRef,
  testTable = false,
  testedRow
}) => {
  const readExcel = (file) => {
    readXlsxFile(file).then((rows) => {
      console.log('aaa');
      setDataset(rows);
    });
  };

  return (
    <>
      <div className="tableWrapper">
        <table className="dataTable">
          {dataset.map((row, index1) => (
            <tr
              key={index1}
              style={{
                background:
                  testTable && index1 === testedRow && index1 !== 0
                    ? 'yellow'
                    : 'transparent'
              }}
            >
              {row.map((cell, index2) => (
                <td key={index2}>{cell}</td>
              ))}
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
