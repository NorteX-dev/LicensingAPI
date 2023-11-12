import moment from "moment";
import {
	Container,
	Text,
	Table,
	Alert,
	Box,
	Loader,
	Badge,
	ActionIcon,
	Pagination,
	TextInput,
	Divider,
	MediaQuery,
} from "@mantine/core";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";
import { useEffect, useState } from "react";
import CreateNew from "../components/CreateNew";
import Waves from "../components/Waves";

const LicensesLoader = ({ data, status, error, setPage }: any) => {
	if (status === "loading") {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
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

	return <LicensesTable data={data} status={status} error={error} setPage={setPage} />;
};

const LicensesTable = ({ data, setPage }: any) => {
	const [search, setSearch] = useState("");
	const [filteredLicenses, setFilteredLicenses] = useState(data.licenses);

	useEffect(() => {
		setFilteredLicenses(data.licenses);
	}, []);

	useEffect(() => {
		if (search === "") {
			setFilteredLicenses(data.licenses);
		} else {
			setFilteredLicenses(
				data.licenses.filter((license: any) => {
					return (
						license.label.toLowerCase().includes(search.toLowerCase()) ||
						license.id.toLowerCase().includes(search.toLowerCase())
					);
				})
			);
		}
	}, [search]);

	return (
		<>
			<Box
				sx={(theme) => ({
					display: "flex",
					justifyContent: "right",
					margin: "20px 0",
					[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
						flexDirection: "column",
					},
				})}
			>
				<TextInput
					mr={15}
					placeholder={"Search..."}
					icon={<IconSearch size={16} />}
					onChange={(e) => setSearch(e.target.value)}
					sx={(theme) => ({
						[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
							marginBottom: "10px",
							width: "100%",
						},
					})}
				></TextInput>
				<Pagination
					total={data.pages.total}
					onChange={(page) => setPage(page)}
					sx={(theme) => ({
						[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
							justifyContent: "right",
						},
					})}
				></Pagination>
			</Box>
			<div style={{ border: "1px solid #444", borderRadius: "5px", margin: "10px 0" }}>
				<Table
					striped={true}
					withColumnBorders={true}
					style={{ display: "block", overflowX: "auto", whiteSpace: "nowrap" }}
				>
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
						{filteredLicenses.map((license: any) => (
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
								<td
									style={{
										display: "flex",
										justifyContent: "flex-end",
										borderRight: "1px solid #373a40",
									}}
								>
									<ActionIcon color={"blue"} variant={"outline"} size={"lg"}>
										<IconPencil size={18} />
									</ActionIcon>
									<ActionIcon color={"red"} variant={"filled"} size={"lg"} ml={10}>
										<IconTrash size={18} />
									</ActionIcon>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
};

export default function LicensesManager() {
	const [page, setPage] = useState(1);

	const { data, status, error } = useQuery<any, Error>(["licenses", page], async () => {
		const response = await fetch(`${API_URL}/licenses?page=${page || 1}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Api-Key": "secretcat5",
			},
		});
		if (!response.ok) throw new Error(response.statusText);
		const data = await response.json();
		if (!data.ok) throw new Error(data.message);
		return data.data;
	});

	return (
		<Layout active={"licenses"}>
			<Box
				sx={(theme) => ({
					backgroundImage: 'url("/title_waves.svg")',
					width: "100%",
					color: "white",
					aspectRatio: "960/100",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "cover",
					position: "relative",
					[`@media (max-width: ${theme.breakpoints.md}px)`]: {
						display: "none",
					},
				})}
			>
				<Text
					weight={"bold"}
					size={"lg"}
					sx={{
						fontSize: "2rem",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -100%)",
					}}
				>
					Active Licenses
				</Text>
			</Box>
			{/* MOBILE HEADER */}
			<Text
				weight={"bold"}
				size={"lg"}
				sx={(theme) => ({
					fontSize: "2rem",
					textAlign: "center",
					[`@media (min-width: ${theme.breakpoints.md}px)`]: {
						display: "none",
					},
				})}
			>
				Active Licenses
			</Text>
			<Container mb={100}>
				<LicensesLoader data={data} status={status} error={error} setPage={setPage} />
				<Divider my={20} />
				<CreateNew />
			</Container>
		</Layout>
	);
}
