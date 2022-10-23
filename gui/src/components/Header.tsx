import { Box, Text } from "@mantine/core";
import Link from "next/link";

interface IProps {
	active?: string;
}

export default function Header({ active = "licenses" }: IProps) {
	return (
		<Box
			p={"xl"}
			sx={(theme) => ({
				display: "flex",
				gap: "30px",
			})}
		>
			<Link href={"/"} passHref>
				<Text weight={active === "licenses" ? "bold" : "normal"} sx={{ cursor: "pointer" }}>
					Licenses
				</Text>
			</Link>
			<Link href={"/settings"} passHref>
				<Text weight={active === "settings" ? "bold" : "normal"} sx={{ cursor: "pointer" }}>
					Settings
				</Text>
			</Link>
		</Box>
	);
}
