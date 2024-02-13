import { Button, Divider, Select, Space, message, theme } from 'antd';
import { DefaultStepProps, StepState } from '../types';
import CollapsableCard from '../components/CollapsableCard';
import Converters from '../converters/converter';
import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';

type Props = DefaultStepProps

const thisStep = 3

enum ConvertingState {
	"Awaiting",
	"Converting",
	"Finished"
}

export default function Step3({ jsonData: [jsonData, setJSONData], currentStep: [currentStep, setCurrentStep], fullUID }: Props) {

	const { token } = theme.useToken()

	const [selection, setSelected] = useState<string>()
	const [convertingState, setConvertingState] = useState<ConvertingState>(ConvertingState.Awaiting)
	const [finalData, setFinalData] = useState<{[key: string]: any}>()

	const onPrevious: React.PointerEventHandler<HTMLElement> = () => {
		setCurrentStep(2)
	}
	const onNext: React.PointerEventHandler<HTMLElement> = () => {
		document.dispatchEvent(new CustomEvent("resetApp"))
		setJSONData(undefined)
		setCurrentStep(1)
		setSelected(undefined)
		setConvertingState(ConvertingState.Awaiting)
		setFinalData(undefined)
	}

	const prevButton = <Button onPointerDown={onPrevious} disabled={false}>Previous</Button>
	const nextButton = <Button onPointerDown={onNext} type="primary" danger={true}>Restart</Button>

	const options = []
	for (const name of Object.keys(Converters)) {
		options.push({
			value: name,
			label: name
		})
	}

	const onSelect = (value: string) => {
		setSelected((Converters[value]) ? value : undefined)
	}

	const onClick = () => {
		if (convertingState === ConvertingState.Awaiting && selection) {
			console.log("Converting!")
			setConvertingState(ConvertingState.Converting)
			Converters[selection]({...jsonData!, uid: fullUID.current!}).then((finalObject) => {
				setFinalData(finalObject)
				setConvertingState(ConvertingState.Finished)
			}).catch(e => {
				message.error("Failed to convert.")
				console.error(e)
				setConvertingState(ConvertingState.Awaiting)
			})
		} else if (convertingState === ConvertingState.Finished && finalData) {
			const jsonStr = JSON.stringify(finalData, null, 2)
			const blob = new Blob([jsonStr], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = "genshin_history.json"
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	return (
		<CollapsableCard title={<><b>Step 3</b> - Convert History</>} active={currentStep === thisStep} state={(currentStep > thisStep) ? StepState.Completed : StepState.Default} prevButton={prevButton} nextButton={nextButton}>
			<p>Convert your history for use in other platforms such as <a href='https://paimon.moe/'>paimon.moe</a></p>
			<Divider />
			<Space>
				<Select
					showSearch
					style={{width: "100%"}}
					placeholder="Select service"
					filterOption={(input, option) => (option?.label as string ?? "").toLowerCase().includes(input.toLowerCase())}
					options={options}
					disabled={convertingState !== ConvertingState.Awaiting}
					onSelect={onSelect}
				></Select>
				<Button
					type="primary"
					icon={(convertingState === ConvertingState.Finished) ? <DownloadOutlined/> : undefined}
					loading={convertingState === ConvertingState.Converting}
					disabled={!selection}
					onClick={onClick}
				>
				{(convertingState === ConvertingState.Finished) ? "Download" : "Convert"}
				</Button>
			</Space>
		</CollapsableCard>
	)
}