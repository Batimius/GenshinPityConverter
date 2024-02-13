import { Input } from 'antd'
import React, { useEffect, useState } from 'react'

type Props = {
	uid?: string,
	fullUID: React.MutableRefObject<string | undefined>
	callback: (value: string) => void
}

export default function UIDInput({ uid, fullUID, callback }: Props) {

	const splitUID = uid?.split("*").filter(c => c) || ["0", "0000"]
	const remainingUID = 9 - splitUID[0].length - splitUID[1].length

	const [input, setInput] = useState<string>((fullUID.current) ? fullUID.current.slice(splitUID[0].length, 9 - splitUID[1].length) : "")
	const [status, setStatus] = useState<"warning" | "error">()

	useEffect(() => {
		document.addEventListener("resetApp", () => {
			setInput("")
			setStatus(undefined)
		})
	}, [])


	const onInput: React.FormEventHandler<HTMLInputElement> = (event) => {
		const currentTarget = event.target as HTMLInputElement
		const value = currentTarget.value

		if (value.length > remainingUID) return
		else if (!(/^\d*$/.test(value))) {
			setStatus("error")
		} else if (value.length === 4) {
			setStatus(undefined)
		} else {
			setStatus(undefined)
		}

		setInput(value)
		callback(splitUID[0] + value + splitUID[1])
	}

	return (
		<Input
			addonBefore={splitUID[0]}
			addonAfter={splitUID[1]}
			styles={{input: { width: "4rem", textAlign: "center" }}}
			placeholder={"0".repeat(remainingUID)}
			onInput={onInput}
			disabled={!uid}
			status={status}
			value={input}
			onBlur={() => setStatus((input.length === remainingUID) ? undefined : "warning")}
			onFocus={() => (status === "warning") ? setStatus(undefined) : null}
		/>
	)
}
