import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5);

export const genLicenseKey = () => {
	let parts = [];
	for (let i = 0; i < 5; i++) {
		parts.push(nanoid());
	}
	return parts.join("-");
};
