import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Card, CardProps, theme } from 'antd';
import React from 'react';
import { StepState } from '../types';

const { useToken } = theme;

type Props = {
	title: React.ReactNode
	active: boolean
	state: StepState

	prevButton?: React.ReactNode
	nextButton?: React.ReactNode

	children?: React.ReactNode
}

export default function CollapsableCard({ title, active, state, nextButton, prevButton, children }: Props) {

	const { token } = useToken();

	const disabledStyle: CardProps["styles"] = {body: {display: "none"}, header: {borderBottom: "0"}}
	let icon: React.ReactNode
	switch (state) {
		case StepState.Loading:
			icon = <LoadingOutlined style={{color: token.colorPrimary}}/>
			break;
		case StepState.Completed:
			icon = <CheckCircleOutlined style={{color: token.colorSuccess}}/>
			break;
		default:
			break;
	}

	const actions: React.ReactNode[] = []
	if (prevButton) actions.push(prevButton)
	if (nextButton) actions.push(nextButton)

	return (active) ? (
		<Card title={title} style={{width: "100%"}} actions={actions} styles={{actions: {cursor: "default"}}}>
			{children}
		</Card>
	) : (
		<Card title={title} styles={disabledStyle} extra={icon}/>
	)
}