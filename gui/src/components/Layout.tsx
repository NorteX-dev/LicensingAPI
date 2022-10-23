import Head from "next/head";
import Header from "./Header";

export default function Layout({ active, children }: any) {
	return (
		<>
			<Head>
				<title>Licensing API GUI</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Header active={active} />
			{children}
		</>
	);
}
