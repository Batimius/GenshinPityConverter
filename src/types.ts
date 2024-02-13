export enum StepState {
	Default,
	Loading,
	Completed
}

export interface PityHistoryEntry {
	gacha_type: "100" | "200" | "300" | "301" | "302" | "400"
	time: string
	name: string
	rank_type: "3" | "4" | "5"
	item_type: "Weapon" | "Character"
}

export interface PityHistory {
	uid: string,
	history: PityHistoryEntry[]
}

export interface DefaultStepProps {
	jsonData: [PityHistory | undefined, React.Dispatch<PityHistory | undefined>]
	currentStep: [number, React.Dispatch<number>]
	fullUID: React.MutableRefObject<string | undefined>
}