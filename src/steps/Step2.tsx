import { Button, Card, Col, Divider, Row } from 'antd';
import { useRef } from 'react';
import { DefaultStepProps, StepState } from '../types';
import CollapsableCard from '../components/CollapsableCard';
import UIDInput from '../components/UIDInput';
import Step2NextButton from '../components/Step2NextButton';

type Props = DefaultStepProps

const thisStep = 2

function BannerNumber(title: string, count: number, loading: boolean): JSX.Element {
	return (
		<Col style={{width: "30%", textAlign: "center"}} id={title.toLowerCase().replaceAll(" ", "-")}>
			<Card title={title} loading={loading}>
				<div className="center-container"><div>
					<p><span style={{color: "#1668dc"}}><b>{count}</b></span> Wishes</p>
				</div></div>
			</Card>
		</Col>
	)
}

export default function Step2({ jsonData: [jsonData,], currentStep: [currentStep, setCurrentStep], fullUID }: Props) {

	let loading = true

	let eventWishes = 0
	let weaponWishes = 0
	let standardWishes = 0
	
	if (jsonData && jsonData.history) {
		eventWishes = (jsonData.history.filter(e => e.gacha_type === "400" || e.gacha_type === "301").length)
		weaponWishes = (jsonData.history.filter(e => e.gacha_type === "300" || e.gacha_type === "302").length)
		standardWishes = (jsonData.history.filter(e => e.gacha_type === "200").length)
		loading = false
	}

	const onPrevious: React.PointerEventHandler<HTMLElement> = () => {
		setCurrentStep(1)
	}
	const onNext: React.PointerEventHandler<HTMLElement> = () => {
		if (loading || !fullUID.current) return
		setCurrentStep(3)
	}

	const nextRef = useRef<React.Dispatch<React.SetStateAction<boolean>>>(() => {})

	const prevButton = <Button onPointerDown={onPrevious} disabled={false}>Previous</Button>
	const nextButton = <Step2NextButton callback={onNext} disabledCallback={(ref) => nextRef.current = ref} fullUID={fullUID}/>

	const callback = (value: string) => {
		if (/^\d{9}$/.test(value)) {
			fullUID.current = value
			nextRef.current(false)
		} else {
			fullUID.current = undefined
			nextRef.current(true)
		}
	}

	nextRef.current(loading || !fullUID.current)

	return (
		<CollapsableCard title={<><b>Step 2</b> - Check History</>} active={currentStep === thisStep} state={(currentStep > thisStep) ? StepState.Completed : StepState.Default} prevButton={prevButton} nextButton={nextButton}>
			<p>Verify that your history is correct and matches the numbers of your <a href='https://genshin.hotgames.gg/wish-counter#'>Genshin Pity Counter</a> lifetime history for each banner</p>
			<Divider />
			<div className="center-container"><div>
				<p style={{textAlign: "center"}}>Input your UID</p>
				<UIDInput uid={jsonData?.uid} fullUID={fullUID} callback={callback} />
			</div></div>
			<br/>
			<Row justify="space-evenly">
				{BannerNumber("Event Banner", eventWishes, loading)}
				{BannerNumber("Weapon Banner", weaponWishes, loading)}
				{BannerNumber("Standard Banner", standardWishes, loading)}
			</Row>
			<br/>
			
		</CollapsableCard>
	)
}