import React from 'react';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { NavDropdown, NavLink } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import { ButtonGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import Instructions from './instructions';
import { downloadFileJSON , downloadFileCSV} from '../../processing/download';
import { Edit } from '../../annotations/segmentation_edit';

import {run_model, load} from '../../tensorflow/ObjectDetection';
import { run_model_segment } from '../../tensorflow/SemanticSegmentation'; 

import ExportingAnnotation from '../../processing/exporting_annotation';
import ProcessVideo from './process_video';
import store from '../../store' 

import {initFrameData, updateFrameData, getFrameData, initAnnotationData, updateAnnotationData, getAnnotationData, initColumnData} from '../../processing/actions'

export default function CustomNavBar(props){
	const [show, setShow] = useState(false);
	const [uploadShow, setUploadShow] = useState(true);
	const [frameRate, setFrameRate] = useState(0)
	const [videoFormat, setVideoFormat] = useState(0)
	const [videoLink, setVideoLink] = useState("")
	const [model, setModel] = useState("")
	const [process, setProcess] = useState(false)
	const [editSeg, setEditSeg] = useState(false)
	const [columnData, setColumnData] = useState({})

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleUploadClose = () => {setUploadShow(false); setProcess(true)}
	const handleUploadShow = () => {
		setUploadShow(true)
	}

	const handleDownloadJSON = () => {
		var converted_annot = new ExportingAnnotation(store.getState().frame_data.data, props.fabricCanvas, props.VIDEO_METADATA, props.image_frames).get_frame_json()
		downloadFileJSON(props.ANNOTATION_VIDEO_NAME, props.ANNOTATOR_NAME, converted_annot, props.annotation_data, props.VIDEO_METADATA)
	}
	const handleVideoFormat = (type) => {
		console.log(type)
		//TODO Make sure bug is resolved and simply have video format equal type
		type = parseInt(type)
		if(type === 0){
			setVideoFormat(0)
		}else if (type === 1){
			setVideoFormat(1)
		}else if (type === 2){
			setVideoFormat(2)
			props.handleInputType(1)
		}
	}

	const handleEnableModel = (event) => {
		//Defualt value is true which is disbaled. False turns it on!
		if(model === ""){
			alert("Please select a model")
		}
		load(model)
	}

	const handleVideoLink = (event) => {
		if(typeof(event) === "string"){
			setVideoLink(event.target.value)
			console.log(event.target.value)
		}else{
			setVideoLink(URL.createObjectURL(event.target.files[0]))
		}
	}

	const edit_click = (event) => {
		setEditSeg(!editSeg);
		//Edit(props.fabricCanvas, props.save_data);
		props.toggle_segmentation();
		//props.save_data()
	}

	const handleColumnUpload = (event) => {
		var promise = downloadColumn(event)
		promise.then(function (result) {
			if(result != null){
				setColumnData(result);
				console.log(result)
				initColumnData(result)
			}else{
				alert("Error in processing columns")
			}
		})
	}

	const downloadColumn = (file) => {
		return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.onload = function(e) {
			resolve((JSON.parse(e.target.result)));
		}
		reader.readAsText(file.target.files[0])
		})
	}


	return (
		<div>
		{
			//TODO Re-enable this for video processing. 
			process == 2 && 
			<ProcessVideo
				frame_rate={frameRate}
				video_link={videoLink}
			/>
		}
		<Modal show={show} onHide={handleClose} size='lg'>
			<Modal.Header closeButton>
			<Modal.Title>Instructions</Modal.Title>
			</Modal.Header>
			<Modal.Body><Instructions></Instructions></Modal.Body>
			<Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>Close</Button>
			</Modal.Footer>
		</Modal>
		<Modal show={uploadShow} onHide={handleUploadClose} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Upload</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div style={{display: "grid"}}>
					{/*onClick and onBlur events are for the sole purpose to stop the eventKeys from firing off*/}
					<Form style={{float: "left",gridColumn: 1, gridRow:1, zIndex:99}}>
						Video Format: 
						<Form.Control
							as="select"
							id="inlineFormCustomSelect"
							onChange={(event)=>{handleVideoFormat(event.target.value)}}
							defaultValue={videoFormat}
						>
							<option value="0">Video</option>
							<option value="1">Youtube</option>
							<option value="2">Image</option>
						</Form.Control>
						<NavDropdown.Divider />
					</Form>
					<div style={{float: "left",gridColumn: 1, gridRow:3, zIndex:99}}>

					</div>
					<NavDropdown.Divider />
					{videoFormat === 0 && 
						<Form style={{float: "left",gridColumn: 1, gridRow:4}}>
							<Form.File multiple id="file" label="Video Upload" accept=".mp4" custom type="file" onChange={(event) => {props.handleVideoUpload(event); handleVideoLink(event)}} />
						</Form>
					}
					{videoFormat === 1 &&
						<div style={{float: "left",gridColumn: 1, gridRow:4}}>
							{'Youtube URL:'}
							<input onChange={handleVideoLink}></input>
							<Button onClick={(event) => {props.handleVideoUpload(videoLink)}}>Upload</Button>
						</div>
					}{videoFormat === 2 &&
						<Form style={{float: "left",gridColumn: 1, gridRow:4}}>
							<Form.File multiple id="file" label="Image-set Upload" accept="image/*" custom type="file" onChange={(event) => {props.handleVideoUpload(event); handleVideoLink(event)}} />
						</Form>
					}
					<Form style={{float: "left",gridColumn: 1, gridRow:5}}>
						<Form.File disabled={props.disable_buttons} accept=".json" id="file" label="Annotation Upload" custom type="file" onChange={props.handleOldAnnotation}/>
					</Form>
					<Form style={{float: "left",gridColumn: 1, gridRow:6}}>
						<Form.File disabled={props.disable_buttons} accept=".json" id="file" label="Column Upload" custom type="file" onChange={handleColumnUpload}/>
					</Form>
					<NavDropdown.Divider />
					Frame Rate: <input type="number" value={props.frame_rate} onClick={(event) => {props.toggleKeyCheck(false)}} onBlur={(event) => {props.toggleKeyCheck(true)}} onChange={(event) => {props.setFrameRate(parseInt(event.target.value)); setFrameRate(parseInt(event.target.value))}}></input>
					<NavDropdown.Divider />
					Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
					Playback Rate: <input type='number' defaultValue="1" onChange={(event) => {props.handleSetPlaybackRate(parseInt(event.target.value))}}></input>
					<NavDropdown.Divider />
					<div>
						Enable Object Detection Model:{' '}
						<select defaultValue={model} onChange={(event) => {setModel(event.target.value)}} id='base_model'>
							<option value="">Select</option>
							<option value="lite_mobilenet_v2">SSD Lite Mobilenet V2</option>
							<option value="mobilenet_v1">SSD Mobilenet v1</option>
							<option value="mobilenet_v2">SSD Mobilenet v2</option>
						</select>{' '}
						<Button size='sm' variant='outline-success' onClick={handleEnableModel}>Enable</Button>
					</div>
					<NavDropdown.Divider />
				</div>
			</Modal.Body>
			<Modal.Footer>
			<Button variant="success" onClick={handleUploadClose}>Upload</Button>
			</Modal.Footer>
		</Modal>
		<Navbar sticky="top" bg="dark" variant="dark" className="bg-5">
				<Navbar.Brand href="#home">AVAT</Navbar.Brand>
				<Nav className="mr-auto">
						<NavDropdown disabled={props.disable_buttons} title="Export" id="basic-nav-dropdown">
							<NavDropdown.Item onClick={handleDownloadJSON}>JSON</NavDropdown.Item>
							<NavDropdown.Divider />
						</NavDropdown>
						<NavLink onClick={handleShow}>Instructions</NavLink>
						<NavLink onClick={props.handle_link_open}>Report</NavLink>
				</Nav>
				<div>
					{
						//model.length > 0 &&
						//<Button id="run" variant="outline-info" onClick={(event) => {run_model_segment(props.fabricCanvas, props.annotation_data, props.currentFrame, props.save_data, props.handle_visual_toggle); props.handle_visual_toggle();}}>Run model</Button>
					}
					<Button variant="outline-success" onClick={handleUploadShow}>Upload</Button>{' '}
					{
						//props.fabricCanvas != undefined &&props.fabricCanvas.getActiveObject !== undefined && props.fabricCanvas.getActiveObject()._objects[0].type == "polygon" && <Button variant="outline-success" onClick={edit_click}>Edit Seg</Button>
						//<Button variant="outline-success" onClick={edit_click}>Edit Seg</Button>
					}
					{' '}
					<Dropdown as={ButtonGroup}>
						<Button variant="secondary" disabled={true}>{props.display_frame_num}</Button>{' '}
						<Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
						<Dropdown.Menu>
							Skip Value: <input type='number' defaultValue="1" onChange={(event) => {props.change_skip_value(parseInt(event.target.value))}}></input>
							Playback Rate: <input type='number' defaultValue="1" onChange={(event) => {props.handleSetPlaybackRate(parseInt(event.target.value))}}></input>
						</Dropdown.Menu>
					</Dropdown>{' '}
					
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_backward}>Prev</Button>{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.handlePlaying}>{props.play_button_text}</Button>{' '}
					<Button variant="primary" disabled={props.disable_buttons} onClick={props.skip_frame_forward}>Next</Button>{' '}
					<Dropdown as={ButtonGroup} drop='left'>
						<Button variant="success" onClick={props.addToCanvas}>Add</Button>
						<Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
						<Dropdown.Menu>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("1")}}>Behavior Annotation</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("2")}}>BoundingBox</Dropdown.Item>
							<Dropdown.Item onClick={(event) =>{props.change_annotation_type("3")}}>Segmentation</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					{/*<Button variant="danger" onClick={remove} disabled={disable_buttons} style={{position:"relative"}}>Remove</Button>{' '}*/}
				</div>
		</Navbar>
		</div>
	)
}