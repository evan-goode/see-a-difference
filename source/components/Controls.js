import React from "react";
import _ from "lodash";
import styled from "styled-components";

import { Input, Check } from "./common";

const FieldSet = styled.fieldset`
	border: none;
`;

const Tr = styled.tr`
	> td:first-child {
		text-align: right;
	}
	> td:last-child {
		text-align: center;
	}
`;

const Td = styled.td`
	padding: 0.5em;
`;

const MeanControl = props => {
	const meanName = `${props.sample}-mean`;
	const meanId = _.uniqueId();
	return (
		<Tr>
			<Td>
				<label htmlFor={meanId}>{props.label} Mean</label>
			</Td>
			<Td>
				<Input
					id={meanId}
					name={meanName}
					value={props.controls[meanName]}
					onChange={props.handleChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const SpreadControls = props => {
	if (props.controls["use-se"]) {
		const seName = `${props.sample}-se`;
		const nName = `${props.sample}-n`;
		const seId = _.uniqueId();
		const nId = _.uniqueId();
		return (
			<>
				<Tr>
					<Td>
						<label htmlFor={seId}>{props.label} SEM</label>
					</Td>
					<Td>
						<Input
							id={seId}
							name={seName}
							value={props.controls[seName]}
							onChange={props.handleChange}
							color={props.color}
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>
						<label htmlFor={nId}>
							{props.label} <em>n</em>
						</label>
					</Td>
					<Td>
						<Input
							id={nId}
							name={nName}
							value={props.controls[nName]}
							onChange={props.handleChange}
							color={props.color}
						/>
					</Td>
				</Tr>
			</>
		);
	}
	const sdName = `${props.sample}-sd`;
	const sdId = _.uniqueId();
	return (
		<Tr>
			<Td>
				<label htmlFor={sdId}>{props.label} SD</label>
			</Td>
			<Td>
				<Input
					id={sdId}
					name={sdName}
					value={props.controls[sdName]}
					onChange={props.handleChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const UseSeControl = props => {
	const useSeName = "use-se";
	const useSeId = _.uniqueId();
	return (
		<Tr>
			<Td>
				<label htmlFor={useSeId}>Use Standard Error</label>
			</Td>
			<Td>
				<Check
					id={useSeId}
					name={useSeName}
					checked={props.controls[useSeName]}
					onChange={props.handleChange}
				/>
			</Td>
		</Tr>
	);
};

export default class extends React.PureComponent {
	handleChange = event => {
		this.props.setControls(
			Object.assign({}, this.props.controls, {
				[event.target.name]:
					event.target.type === "checkbox"
						? event.target.checked
						: event.target.value
			})
		);
	};
	render() {
		return (
			<FieldSet>
				<table>
					<tbody>
						<MeanControl
							controls={this.props.controls}
							label="Male"
							sample="a"
							handleChange={this.handleChange}
							color={this.props.colors["a-color"]}
						/>
						<SpreadControls
							controls={this.props.controls}
							label="Male"
							sample="a"
							handleChange={this.handleChange}
							color={this.props.colors["a-color"]}
						/>
						<MeanControl
							controls={this.props.controls}
							label="Female"
							sample="b"
							handleChange={this.handleChange}
							color={this.props.colors["b-color"]}
						/>
						<SpreadControls
							controls={this.props.controls}
							label="Female"
							sample="b"
							handleChange={this.handleChange}
							color={this.props.colors["b-color"]}
						/>
						<UseSeControl
							controls={this.props.controls}
							handleChange={this.handleChange}
						/>
					</tbody>
				</table>
			</FieldSet>
		);
	}
}
