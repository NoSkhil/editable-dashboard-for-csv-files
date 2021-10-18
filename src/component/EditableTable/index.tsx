// @ts-nocheck
import "./styles.css";
import React, { useState,forwardRef, useEffect } from "react";
import { parseCsvData } from "./utils";
import Container from "typedi";
import DoctorService from "../../services/doctor.service";
import { CSVReader } from 'react-papaparse'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const initialColumns = [
  { title: "Phone Number", field: "phoneNumber", type: "numeric" as const, validate: rowData => rowData.phoneNumber?.toString().length === 10},
  { title: "First Name", field: "firstName", type: "string" as const,  validate: rowData => rowData.firstName?.length > 0 },
  {
    title: "Last Name",
    field: "lastName",
    type: "string" as const,
    validate: rowData => rowData.lastName?.length > 0
  },
  {
    title: "Group Name",
    field: "groupName",
    type: "string" as const,
    validate: rowData => rowData.groupName?.length > 0
  },
  {
    title: "City",
    field: "city",
    type: "string" as const,
    validate: rowData => rowData.city?.length > 0
  },
  {
    title: "State",
    field: "state",
    type: "string" as const,
    validate: rowData => rowData.state?.length > 0
  },
  { title: "Zip", field: "zip", type: "numeric" as const, validate: rowData => rowData.zip?.toString().length === 5},
  {
    title: "County",
    field: "county",
    type: "string" as const,
    validate: rowData => rowData.county?.length > 0
  },
  {
    title: "Address",
    field: "address",
    type: "string" as const,
    validate: rowData => rowData.address?.length > 0
  },
];

export default function EditableTable() {
  const [columns, setColumns] = useState(initialColumns);
  const [data, setData] = useState([]);
  const [addressColumns, setAddressColumns] = useState([]);
  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const apiService = Container.get(DoctorService);
    const res = await apiService.getDoctorInfo();
    const formattedData = formatData(res);
    setData(formattedData);
  };

  const formatData = (data) => {
    let tempData = data;
    let tempAddressColumns = addressColumns;
    let newColumns = initialColumns;
    tempData.map(rowData=> {
      rowData[`address`] = rowData.addresses[0];
      rowData.addresses.map((address,index)=>{
        if(index > 0) {
          let count = index + 1;
          rowData[`address${count}`] = address;
        if (!tempAddressColumns.includes(count)) {
          newColumns.push({
            title: `Address${count}`,
            field: `address${count}`,
            type: "string" as const,
            addressIndex: count,
          });
          tempAddressColumns.push(count)
        }
        }
      })
    });
    setColumns(newColumns);
    setAddressColumns(tempAddressColumns);
    return tempData;
  };

  const addInfo = async (csvData) => {
    const apiService = Container.get(DoctorService);
    const res = await apiService.addDoctorInfo(csvData);
    const combinedData = data.concat(res);
    const formattedData = formatData(combinedData);
    setData(formattedData);
  };

  const handleOnDrop = async (newData) => {
      const formattedData = await parseCsvData(newData);
      addInfo(formattedData);
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data) => {

  }
  
  return (
    <div className="DoctorInfo">
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        removeButtonColor='#659cef'
        onRemoveFile={handleOnRemoveFile}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
      <MaterialTable
        icons={tableIcons}
        title="Doctor/Clinic Info"
        columns={columns}
        data={data}
        options={{
          pageSize:10,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(async () => {
                setData([...data, newData]);
                let tempData = newData;
                tempData['addresses'] = [newData['address']];
                addressColumns.map(addressIndex=>{
                  if (newData[`address${addressIndex}`]) tempData['addresses'].push(newData[`address${addressIndex}`]);
                });
                const apiService = Container.get(DoctorService);
                const res = await apiService.addDoctorInfo([tempData]);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(async () => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                let tempData = newData;
                tempData['addresses'] = [newData['address']];
                addressColumns.map(addressIndex=>{
                  if (newData[`address${addressIndex}`]) tempData['addresses'].push(newData[`address${addressIndex}`]);
                });
                const apiService = Container.get(DoctorService);
                const res = await apiService.editDoctorInfo(newData._id,tempData);
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(async () => {
                let dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData(dataDelete);
                const apiService = Container.get(DoctorService);
                const res = await apiService.deleteDoctorInfo(oldData._id);
                resolve();
              }, 1000);
            })
        }}
      />
    </div>
  );
}
