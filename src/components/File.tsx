import React, { Fragment, useRef, useState } from 'react';
import { Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

// Local absolute imports
import { REACT_APP_BASE_URL } from 'configs/EnvConfig';
import { FILE_EXTENSIONS } from 'constants/FileExtensionsConstant';
import { IMG_LOGO } from 'helpers/ImagesHelper';
import { showErrorToastMessage, showSuccessToastMessage } from 'utils/ToastUtils';
import { generateExcelFromJson, generateJsonFromExcel } from 'services/FileService';

const File = () => {
    const jsonFileRef = useRef<HTMLInputElement>(null);
    const excelFileRef = useRef<HTMLInputElement>(null);
    const [selectedJsonFile, setSelectedJsonFile] = useState(null);
    const [selectedExcelFile, setSelectedExcelFile] = useState(null);
    const [generatedFileType, setGeneratedFileType] = useState('csv');

    const openUrlInNewTab = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const handleJsonFileUpload = async () => {
        try {
            if (selectedJsonFile) {
                const formData = new FormData();
                formData.append('file', selectedJsonFile);
                formData.append('generatedFileType', generatedFileType);
                const response = await generateExcelFromJson(formData);
                const { data: responseData } = response;
                if (responseData) {
                    const { success, message, data } = responseData;
                    if (success) {
                        showSuccessToastMessage(message);
                        openUrlInNewTab(`${REACT_APP_BASE_URL}/${data.excelFilePath}`);
                    } else {
                        showErrorToastMessage(message);
                    }
                }
            }
        } catch (error) {
            console.log('ERROR IN JSON UPLOAD: ', error);
        }
    };

    const handleExcelFileUpload = async () => {
        try {
            if (selectedExcelFile) {
                const formData = new FormData();
                formData.append('excel', selectedExcelFile);
                const response = await generateJsonFromExcel(formData);
                const { data: responseData } = response;
                if (responseData) {
                    const { success, message, data } = responseData;
                    if (success) {
                        showSuccessToastMessage(message);
                        openUrlInNewTab(`${REACT_APP_BASE_URL}/${data.jsonFilePath}`);
                    } else {
                        showErrorToastMessage(message);
                    }
                }
            }
        } catch (error) {
            console.log('ERROR IN EXCEL UPLOAD: ', error);
        }
    };

    const onReaderLoad = (event: any) => {
        try {
            const obj = JSON.parse(event.target.result);
            return obj;
        } catch (error) {
            console.log('ERROR IN JSON PARSING: ', error);
            jsonFileRef.current.value = '';
            setSelectedJsonFile(null);
            showErrorToastMessage('Please upload json file in proper format.');
        }
    };

    const handleJsonFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const file = evt.target.files[0];
        if (file) {
            const { name } = file;
            const fileNameArr = name.split('.');
            const fileExt = fileNameArr[fileNameArr.length - 1];
            if (fileExt !== FILE_EXTENSIONS.JSON) {
                showErrorToastMessage('Please upload .json file.');
                jsonFileRef.current.value = '';
                setSelectedJsonFile(null);
                return;
            }
            setSelectedJsonFile(file);
            const reader = new FileReader();
            reader.onload = onReaderLoad;
            reader.readAsText(file);
        }
    };

    const handleExcelFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {

        const file = evt.target.files[0];
        if (file) {
            const { name } = file;
            const fileNameArr = name.split('.');
            const fileExt = fileNameArr[fileNameArr.length - 1];
            if (fileExt === FILE_EXTENSIONS.XLS || fileExt === FILE_EXTENSIONS.XLSX) {
                setSelectedExcelFile(file);
            } else {
                showErrorToastMessage('Please upload .xls or .xlsx file.');
                excelFileRef.current.value = '';
                setSelectedExcelFile(null);
            }
        }
    };

    const handleRadioChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setGeneratedFileType(evt.target.value);
    };

    return (
        <Fragment>
            <div className="logo-container">
                <img src={IMG_LOGO} alt="logo" />
            </div>
            <div className="parent-container">
                <div className="child-container">
                    <h3>JSON TO EXCEL CONVERTER</h3>
                    <p>Here you can first upload the json file, then select the file types between csv and xlsx and then in response you will get the Excel file from the selected file types. </p>
                    <p><span className="warning-note">Note:- </span>
                        Please upload json file in proper format by adding things like double quote instead of single quote or removing things like
                        comma, semi-colon etc.
                        Accepted file extension is .json.
                    </p>
                    <div>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Generated File Types</FormLabel>
                            <RadioGroup row aria-label="file-types" defaultValue="csv" onChange={handleRadioChange} name="row-radio-buttons-group">
                                <FormControlLabel value="csv" control={<Radio />} label="CSV" />
                                <FormControlLabel value="xlsx" control={<Radio />} label="XLSX" />
                            </RadioGroup>
                        </FormControl>
                        <br />
                        <Button variant="contained" color="primary" className="file-upload-btn">
                            Upload Your File
                            <input type="file" ref={jsonFileRef} onChange={handleJsonFileChange} className="custom-file-input" />
                        </Button>
                        <Button variant="outlined" disabled={!selectedJsonFile} onClick={handleJsonFileUpload}>Start Uploading Json File</Button>
                    </div>
                </div>
                <div className="child-container">
                    <h3>EXCEL TO JSON CONVERTER</h3>
                    <p>Here you can first upload the Excel file, then in response you will get the json file. </p>
                    <p><span className="warning-note">Note:- </span>
                        Please upload the Excel file in the appropriate format by adding keys in the header or first row and values in the respective key columns.
                        The accepted file extensions are xls and xlsx formats.
                    </p>
                    <Button variant="contained" color="primary" className="file-upload-btn">
                        Upload Your File
                        <input type="file" ref={excelFileRef} onChange={handleExcelFileChange} className="custom-file-input" />
                    </Button>
                    <Button variant="outlined" disabled={!selectedExcelFile} onClick={handleExcelFileUpload}>Start Uploading Excel File</Button>
                </div>
            </div>
        </Fragment>
    );
};

export default File;
