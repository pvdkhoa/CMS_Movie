import React, { useState } from 'react';
import { Divider, Radio, Table, Empty } from 'antd';


// rowSelection object indicates the need for row selection

const TableComp = (props) => {
  const [selectionType, setSelectionType] = useState('radio');
  
  const rowSelection = {
    type: selectionType,
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
    onSelect: (record) => {
      props.selectedRow(record.id); 
    },
  };
  return (
     
    <div className='font-MonaSans'>
      {props.data ? (<Table
        rowSelection={rowSelection}
        columns={props.columns}
        dataSource={props.data}
        pagination={{
          pageSize:5,
          total: props.totalItem
          
        }}
      />) : (<Empty/>)}
      
    </div>
  );
};
export default TableComp;