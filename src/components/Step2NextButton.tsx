import { Button } from 'antd'
import React, { useState } from 'react'

type Props = {
	callback: React.PointerEventHandler<HTMLElement>
	disabledCallback: (setDisabled: React.Dispatch<React.SetStateAction<boolean>>) => void
	fullUID: React.MutableRefObject<string | undefined>
}

export default function Step2NextButton({ callback, disabledCallback, fullUID }: Props) {

	const [disabled, setDisabled] = useState<boolean>(!fullUID.current)

	disabledCallback(setDisabled)

	return (
		<Button type="primary" onPointerDown={callback} disabled={disabled}>Next</Button>
	)
}
