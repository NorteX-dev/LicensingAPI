import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "../styles/globals.scss";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
				<Component {...pageProps} />
			</MantineProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default MyApp;
