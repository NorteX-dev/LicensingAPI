import { Container, Text, Table, Alert, Box, Loader, Badge, ActionIcon, Divider } from "@mantine/core";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";
import { IconPencil, IconTrash } from "@tabler/icons";
import moment from "moment";

const LicensesTable = ({ status, data, error }: { status: string; data: any; error: any }) => {
	if (status === "loading") {
		return (
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<Loader />
			</Box>
		);
	}

	if (status === "error") {
		return (
			<Alert my={20} color={"red"}>
				Failed to get licenses: {error.message}
			</Alert>
		);
	}

	return (
		<Table my={10}>
			<thead>
				<tr>
					<th style={{ width: "15%" }}>ID</th>
					<th style={{ width: "15%" }}>Status</th>
					<th style={{ width: "20%" }}>Label</th>
					<th style={{ width: "20%" }}>Expires</th>
					<th style={{ width: "20%" }}>Created</th>
					<th style={{ textAlign: "right", width: "10%" }}>Actions</th>
				</tr>
			</thead>
			<tbody>
				{data.map((license: any) => (
					<tr key={license.id}>
						<td>{license.id}</td>
						<td>
							{license.status ? (
								<>
									{license.status === "valid" ? (
										<Badge color={"green"}>Valid</Badge>
									) : (
										<Badge color={"red"}>Invalid</Badge>
									)}
								</>
							) : (
								<Badge color={"gray"}>Unknown</Badge>
							)}
						</td>
						<td>{license.label}</td>
						<td>{license.expires ? moment(license.expires).fromNow() : "never"}</td>
						<td>{moment(license.createdAt).fromNow()}</td>
						<td style={{ display: "flex", justifyContent: "flex-end" }}>
							<ActionIcon color={"blue"} variant={"outline"} size={"lg"}>
								<IconPencil size={18} />
							</ActionIcon>
							<ActionIcon color={"red"} variant={"outline"} size={"lg"} ml={10}>
								<IconTrash size={18} />
							</ActionIcon>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default function LicensesManager() {
	const { data, status, error } = useQuery<any, Error>(["licenses"], async () => {
		const response = await fetch(`${API_URL}/licenses`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Api-Key": "secretcat5",
			},
		});
		if (!response.ok) throw new Error(response.statusText);
		const data = await response.json();
		if (!data.ok) throw new Error(data.message);
		return data.data.licenses;
	});

	return (
		<Layout active={"licenses"}>
			<Container>
				<Text sx={{ fontSize: "2rem", textAlign: "center" }}>Active Licenses</Text>
				<Divider my={20} />
				<LicensesTable data={data} status={status} error={error} />
			</Container>
		</Layout>
	);
}
