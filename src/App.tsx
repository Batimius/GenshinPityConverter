import "./App.css"
import { ConfigProvider, Progress, theme } from 'antd';
import React, { useRef, useState } from 'react';
import { DefaultStepProps, PityHistory, StepState } from "./types";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";

const App: React.FC = () => {

	// Define shared states
	const [currentStep, setCurrentStep] = useState<number>(1)
	const [jsonData, setJSONData] = useState<PityHistory>()
	const fullUID = useRef<string>()

	const sharedProps: DefaultStepProps = {jsonData: [jsonData, setJSONData], currentStep: [currentStep, setCurrentStep], fullUID}
	
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm
			}}
		>
		<div className="center-container">
			<div className="center-content" style={{maxWidth: "800px"}}>
				<div className="center-container">
					<div>
						<Progress percent={33 * currentStep} steps={3} showInfo={false} style={{width: "100%"}} size={[100, 8]}/>
					</div>
				</div>
				<div className="center-container">
					<div className="center-content">
						<div className='App'>
							<br/>
							<Step1 {...sharedProps}/>
							<br/>
							<Step2 {...sharedProps}/>
							<br/>
							<Step3 {...sharedProps}/>
						</div>
					</div>
				</div>
			</div>
		</div>
		</ConfigProvider>
	)
};

export default App;