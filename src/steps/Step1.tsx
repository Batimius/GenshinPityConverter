import { CheckCircleFilled, ExclamationCircleFilled, InboxOutlined } from '@ant-design/icons';
import { Button, Divider, UploadFile, UploadProps, notification, theme } from 'antd';
import { useEffect, useState } from 'react';
import { DefaultStepProps, StepState } from '../types';
import { SearchProps } from 'antd/es/input';
import CollapsableCard from '../components/CollapsableCard';
import Dragger from 'antd/es/upload/Dragger';
import Search from 'antd/es/input/Search';

type Props = DefaultStepProps

const thisStep = 1

function validateJSON(jsonData: { [key: string]: unknown }) {
	// Check if the JSON object has 'uid' and 'history' properties
	if (!jsonData.hasOwnProperty('uid') || !jsonData.hasOwnProperty('history')) {
		return false;
	}

	// Check if 'uid' is a string
	if (typeof jsonData.uid !== 'string') {
		return false;
	}

	// Check if 'history' is an array and each item in 'history' has the required properties
	if (!Array.isArray(jsonData.history)) {
		return false;
	}

	// Check if the invidiual 'history' items have the required properties
	for (let i = 0; i < jsonData.history.length; i++) {
		const entry = jsonData.history[i];
		if (
			typeof entry.gacha_type !== 'string' ||
			typeof entry.time !== 'string' ||
			typeof entry.name !== 'string' ||
			typeof entry.rank_type !== 'string' ||
			typeof entry.item_type !== 'string'
		) {
			return false;
		}
	}

	// If all checks pass, return true
	return true;
}

export default function Step2({ jsonData: [, setJSONData], currentStep: [currentStep, setCurrentStep] }: Props) {

	const {token} = theme.useToken()
	const [api, contextHolder] = notification.useNotification()

	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [canContinue, setCanContinue] = useState<boolean>(false)

	const [isSearching, setIsSearching] = useState<boolean>(false)
	const [searchState, setSearchState] = useState<number>(0)

	useEffect(() => {
		document.addEventListener("resetApp", () => {
			setFileList([])
			setCanContinue(false)
			setSearchState(0)
			setIsSearching(false)
		})
	}, [])

	const onSearch: SearchProps["onSearch"] = async (value) => {
		setIsSearching(true)

		try {
			var data = await fetch(value)
		} catch (error) {
			setIsSearching(false)
			setSearchState(2)
			createNotification("Failed to fetch JSON", "Unable to fetch JSON from URL. Please try again or verify the URL.", false)
			return
		}

		try {
			var fetchedData = await data.json()
		} catch (error) {
			setIsSearching(false)
			setSearchState(2)
			createNotification("Failed to parse JSON", "Try uploading again.", false)
			return
		}

		const isValid = validateJSON(fetchedData)

		if (!isValid) {
			setIsSearching(false)
			setSearchState(2)
			createNotification("JSON data is invalid", "Are you use you are using the correct file?", false)
			return
		}

		setJSONData(fetchedData)
		setIsSearching(false)
		setCanContinue(true)
		setSearchState(1)
		createNotification("Successfully fetched and imported file", undefined, true)
	}

	const onInput: SearchProps["onInput"] = async () => {
		if (searchState > 0) setSearchState(0)
		setCanContinue(false)
	}

	const createNotification = (message: string, description: string | undefined, success: boolean) => {
		api.info({
			message,
			description,
			placement: "top",
			icon: (success) ? <CheckCircleFilled style={{color: token.colorSuccess}}/> : <ExclamationCircleFilled style={{color: token.colorError}}/>
		})
	}

	const handleFileRead = (file: File) => {
		const reader = new FileReader()
		reader.onload = (event) => {
			const fileContent = event.target!.result as string
			try {
				const parsedData = JSON.parse(fileContent)

				const isValid = validateJSON(parsedData)

				if (!isValid) {
					setCanContinue(false)
					createNotification("JSON data is invalid", "Are you use you are using the correct file?", false)
					setFileList([{uid: "-1", name: file.name, status: "error"}])
					return
				}

				setJSONData(parsedData)
				setCanContinue(true)
				createNotification("Successfully uploaded file", undefined, true)
				setFileList([{uid: "-1", name: file.name, status: "done"}])
			} catch (error) {
				createNotification("Failed to parse JSON file", "Try uploading again.", false)
				console.error('Error parsing JSON:', error)
				setFileList([{uid: "-1", name: file.name, status: "error"}])
				setCanContinue(false)
			}
		};
		reader.readAsText(file)
	}

	const props: UploadProps = {
		name: 'Genshin Pity Tracker History',
		multiple: false,
		showUploadList: true,
		accept: "application/JSON",
		fileList: fileList,
		beforeUpload: (file) => {
			handleFileRead(file);
			return false; // Prevent default upload behavior
		},
		onDrop(e) {
			handleFileRead(e.dataTransfer.files[0])
		},
		onRemove() {
			setFileList([])
			setCanContinue(false)
			setJSONData(undefined)
		}
	}

	const onNext: React.PointerEventHandler<HTMLElement> = (event) => {
		if (!canContinue) return
		setCurrentStep(2)
	}

	const nextButton = <Button type="primary" onPointerDown={onNext} disabled={!canContinue}>Next</Button>

	return (
		<CollapsableCard title={<><b>Step 1</b> - Import History</>} active={currentStep === thisStep} state={(currentStep > thisStep) ? StepState.Completed : StepState.Default} nextButton={nextButton}>
			{contextHolder}
			<p>Import your JSON history from <a href='https://genshin.hotgames.gg/wish-counter#'>Genshin Pity Counter</a> by either uploading it as a JSON file or pasting the JSON URL</p>
			<Divider />
			<Dragger {...props} disabled={isSearching || searchState === 1}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">Click or drag file to this area to upload</p>
				<p className="ant-upload-hint">
					Support for a single or bulk upload. Strictly prohibited from uploading company data or other
					banned files.
				</p>
			</Dragger>
			<br/>
			<Search placeholder="Paste JSON URL here" onSearch={onSearch} onInput={onInput} enterButton loading={isSearching} styles={{input: {borderColor: (searchState === 1) ? token.colorSuccess : (searchState === 2) ? token.colorError : token.colorBorder}}} disabled={fileList.length > 0}/>
		</CollapsableCard>
	)
}