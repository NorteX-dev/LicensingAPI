import { Container, Divider, Text, TextInput, Box, Button, Alert } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import Layout from "../components/Layout";
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
		<Layout active={"createnew"}>
			<Container>
				<Text sx={{ fontSize: "2rem", textAlign: "center" }}>Create a new license</Text>
				<Divider my={20} />
				<form onSubmit={handleSubmitForm}>
					{error && (
						<Alert color={"red"} mb={20}>
							{error}
						</Alert>
					)}
					<Box mb={15}>
						<TextInput
							id="label"
							name="label"
							placeholder={"A recognizable name"}
							label={"Label:"}
							required
						/>
					</Box>
					<Box>
						<DatePicker
							id="exp"
							name="exp"
							placeholder={"Expiration date"}
							minDate={new Date()}
							label={"Expiration date:"}
						/>
					</Box>
					<Button color={"green"} type={"submit"} mt={15} loading={loading}>
						Create
					</Button>
				</form>
			</Container>
		</Layout>
	);
}
