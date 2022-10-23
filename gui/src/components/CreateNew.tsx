import { Text, TextInput, Box, Button, Alert } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { API_URL } from "../config";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateNew() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	let handleSubmitForm = async (e: any) => {
		setLoading(true);
		setError(null);
		e.preventDefault();
		let form = e.target;
		let formData = JSON.stringify(Object.fromEntries(new FormData(form)));
		let response = await fetch(`${API_URL}/licenses`, {
			method: "POST",
			body: formData,
			headers: {
				"X-Api-Key": "secretcat5",
				"Content-Type": "application/json",
			},
		});
		let data = await response.json();
		if (!data.ok) {
			setError(data.message);
		}
		setLoading(false);
		router.push("/");
	};

	return (
		<form onSubmit={handleSubmitForm}>
			<Text weight={"bold"}>Create new license:</Text>
			<Box
				mb={15}
				sx={(theme) => ({
					display: "flex",
					gap: "10px",
					justifyContent: "space-between",
					[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
						flexDirection: "column",
					},
				})}
			>
				<TextInput
					id="label"
					name="label"
					placeholder={"A recognizable name"}
					label={"Label:"}
					required
					sx={(theme) => ({
						width: "50%",
						[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
							width: "100%",
						},
					})}
				/>
				<DatePicker
					id="exp"
					name="exp"
					placeholder={"Optional date when the license is going to become invalid"}
					minDate={new Date()}
					label={"Expiration date:"}
					sx={(theme) => ({
						width: "50%",
						[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
							width: "100%",
						},
					})}
				/>
			</Box>
			<Button
				color={"green"}
				type={"submit"}
				loading={loading}
				sx={(theme) => ({
					[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
						width: "100%",
					},
				})}
			>
				Create
			</Button>
			{error && (
				<Alert color={"red"} mb={10}>
					Failed to create: {error}
				</Alert>
			)}
		</form>
	);
}
