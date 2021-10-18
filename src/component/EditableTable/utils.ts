// @ts-nocheck
export async function parseCsvData (csvData:[Object]) {
    let columnsIndex = {};
    let addressCount = 1;
    /* Checks each column name and stores it's index. So that the order of the columns in the uploaded csv does not matter
       as long as the column name is correct.
    */
    csvData[0]?.data?.map((columnName,index)=>{
      let phoneNumber = columnName.match(/phone number/gi);
      if (phoneNumber) columnsIndex['phoneNumber'] = index;
      let firstName = columnName.match(/first name/gi);
      if (firstName) columnsIndex['firstName'] = index;
      let lastName = columnName.match(/last name/gi);
      if (lastName) columnsIndex['lastName'] = index;
      let city = columnName.match(/city/gi);
      if (city) columnsIndex['city'] = index;
      let county = columnName.match(/county/gi);
      if (county) columnsIndex['county'] = index;
      let groupName = columnName.match(/group name/gi);
      if (groupName) columnsIndex['groupName'] = index;
      let zip = columnName.match(/zip/gi);
      if (zip) columnsIndex['zip'] = index;
      let state = columnName.match(/state/gi);
      if (state) columnsIndex['state'] = index;
      let address = columnName.match(/^address$/i);
      if (address) {
        columnsIndex['addresses'] = [index];
        ++addressCount;
      }
      //Check for additional addresses
      if(addressCount !== 1) {
        let tempAddress = columnName.match(`address${addressCount}`);
        let tempAddress2 = columnName.match(`Address${addressCount}`);
        if ((tempAddress || tempAddress2)) {
          columnsIndex['addresses'].push(index);
            ++addressCount;
        }
      }
    });

  /*Creates the appropriate number of columns (Address, Address2, etc) based on the highest number of addresses, 
    and fills the info from the csv.
  */
 
    let tempData = [];
    csvData.map((rowData,rowIndex)=>{
      let addresses = [];
      let dataObject = {};
      if (rowIndex !=0 && rowData.data.length !== 1) {
        columnsIndex['addresses'].map((addressIndex,index) => {
          if (rowData.data[addressIndex] !== '') {
            addresses.push(rowData.data[addressIndex]);
          if (addresses.length > 1) {
            let count = index + 1;
            dataObject[`address${count}`] = addresses[index];
          }
        }
        });

        dataObject['phoneNumber'] = rowData.data[columnsIndex['phoneNumber']];
        dataObject['firstName'] = rowData.data[columnsIndex['firstName']];
        dataObject['lastName'] = rowData.data[columnsIndex['lastName']];
        dataObject['groupName'] = rowData.data[columnsIndex['groupName']];
        dataObject['city'] = rowData.data[columnsIndex['city']];
        dataObject['state'] = rowData.data[columnsIndex['state']];
        dataObject['zip'] = rowData.data[columnsIndex['zip']];
        dataObject['county'] = rowData.data[columnsIndex['county']];
        dataObject['addresses'] = addresses;

        tempData.push(dataObject);
      }
    });
    return tempData;
  }